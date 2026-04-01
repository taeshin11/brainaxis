import dicomParser from 'dicom-parser';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Well-known DICOM tag names (subset covering common tags)
const TAG_NAMES: Record<string, string> = {
  'x00080005': 'Specific Character Set',
  'x00080008': 'Image Type',
  'x00080016': 'SOP Class UID',
  'x00080018': 'SOP Instance UID',
  'x00080020': 'Study Date',
  'x00080021': 'Series Date',
  'x00080022': 'Acquisition Date',
  'x00080023': 'Content Date',
  'x00080030': 'Study Time',
  'x00080031': 'Series Time',
  'x00080032': 'Acquisition Time',
  'x00080033': 'Content Time',
  'x00080050': 'Accession Number',
  'x00080060': 'Modality',
  'x00080070': 'Manufacturer',
  'x00080080': 'Institution Name',
  'x00080081': 'Institution Address',
  'x00080090': 'Referring Physician Name',
  'x00080103': 'Coding Scheme Version',
  'x00081010': 'Station Name',
  'x00081030': 'Study Description',
  'x0008103e': 'Series Description',
  'x00081040': 'Institutional Department',
  'x00081050': 'Performing Physician Name',
  'x00081090': 'Manufacturer Model Name',
  'x00100010': 'Patient Name',
  'x00100020': 'Patient ID',
  'x00100030': 'Patient Birth Date',
  'x00100040': 'Patient Sex',
  'x00100042': 'Social Security Number',
  'x00101000': 'Other Patient IDs',
  'x00101010': 'Patient Age',
  'x00101020': 'Patient Size',
  'x00101030': 'Patient Weight',
  'x00180015': 'Body Part Examined',
  'x00180050': 'Slice Thickness',
  'x00180060': 'KVP',
  'x00180088': 'Spacing Between Slices',
  'x00181030': 'Protocol Name',
  'x00185100': 'Patient Position',
  'x0020000d': 'Study Instance UID',
  'x0020000e': 'Series Instance UID',
  'x00200010': 'Study ID',
  'x00200011': 'Series Number',
  'x00200012': 'Acquisition Number',
  'x00200013': 'Instance Number',
  'x00200032': 'Image Position (Patient)',
  'x00200037': 'Image Orientation (Patient)',
  'x00200052': 'Frame of Reference UID',
  'x00201041': 'Slice Location',
  'x00280002': 'Samples per Pixel',
  'x00280004': 'Photometric Interpretation',
  'x00280010': 'Rows',
  'x00280011': 'Columns',
  'x00280030': 'Pixel Spacing',
  'x00280100': 'Bits Allocated',
  'x00280101': 'Bits Stored',
  'x00280102': 'High Bit',
  'x00280103': 'Pixel Representation',
  'x00281050': 'Window Center',
  'x00281051': 'Window Width',
  'x00281052': 'Rescale Intercept',
  'x00281053': 'Rescale Slope',
  'x00281054': 'Rescale Type',
  'x7fe00010': 'Pixel Data',
};

export interface DicomTag {
  tag: string;        // e.g. "(0008,0060)"
  tagHex: string;     // e.g. "x00080060"
  name: string;
  vr: string;
  value: string;
  isPrivate: boolean;
}

function formatTag(hex: string): string {
  // "x00080060" -> "(0008,0060)"
  const g = hex.slice(1, 5);
  const e = hex.slice(5, 9);
  return `(${g},${e})`;
}

function isPrivateTag(hex: string): boolean {
  const group = parseInt(hex.slice(1, 5), 16);
  return (group & 1) === 1;
}

function getTagValue(dataSet: dicomParser.DataSet, tag: string, elem: dicomParser.Element): string {
  try {
    if (tag === 'x7fe00010') return `[Binary data: ${elem.length} bytes]`;
    if (elem.length > 256) return `[Data: ${elem.length} bytes]`;

    const str = dataSet.string(tag);
    if (str !== undefined && str !== null) return str;

    // Try numeric
    if (elem.length === 2) {
      const val = dataSet.uint16(tag);
      if (val !== undefined) return String(val);
    }
    if (elem.length === 4) {
      const val = dataSet.uint32(tag);
      if (val !== undefined) return String(val);
    }

    return `[${elem.length} bytes]`;
  } catch {
    return `[${elem.length} bytes]`;
  }
}

export function extractAllTags(arrayBuffer: ArrayBuffer): DicomTag[] {
  const byteArray = new Uint8Array(arrayBuffer);
  const dataSet = dicomParser.parseDicom(byteArray);
  const tags: DicomTag[] = [];

  for (const tag of Object.keys(dataSet.elements)) {
    const elem = dataSet.elements[tag];
    const priv = isPrivateTag(tag);
    tags.push({
      tag: formatTag(tag),
      tagHex: tag,
      name: TAG_NAMES[tag] || (priv ? 'Private Tag' : 'Unknown'),
      vr: elem.vr || '??',
      value: getTagValue(dataSet, tag, elem),
      isPrivate: priv,
    });
  }

  // Sort: standard tags first, then private; within each group sort by tag
  tags.sort((a, b) => {
    if (a.isPrivate !== b.isPrivate) return a.isPrivate ? 1 : -1;
    return a.tag.localeCompare(b.tag);
  });

  return tags;
}

export async function removeTagsAndDownload(
  rawBuffers: ArrayBuffer[],
  tagsToRemove: Set<string>
): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < rawBuffers.length; i++) {
    const byteArray = new Uint8Array(rawBuffers[i]);
    const dataSet = dicomParser.parseDicom(byteArray);

    // Build list of elements to keep
    const elementsToWrite: { tag: string; elem: dicomParser.Element }[] = [];
    for (const tag of Object.keys(dataSet.elements)) {
      if (!tagsToRemove.has(tag)) {
        elementsToWrite.push({ tag, elem: dataSet.elements[tag] });
      }
    }

    // Re-encode: copy the original bytes but skip removed tags
    // Strategy: build new byte array excluding removed elements
    const parts: Uint8Array[] = [];

    // DICOM preamble (128 bytes) + "DICM" (4 bytes) = 132 bytes
    if (byteArray.length > 132) {
      parts.push(byteArray.slice(0, 132));
    }

    // Sort elements by dataOffset to process in order
    const sortedElems = Object.keys(dataSet.elements)
      .map(tag => ({ tag, elem: dataSet.elements[tag] }))
      .filter(e => e.elem.dataOffset !== undefined)
      .sort((a, b) => {
        const aStart = (a.elem.dataOffset ?? 0) - (a.elem.vr ? 8 : 8);
        const bStart = (b.elem.dataOffset ?? 0) - (b.elem.vr ? 8 : 8);
        return aStart - bStart;
      });

    for (const { tag, elem } of sortedElems) {
      if (tagsToRemove.has(tag)) continue;

      // Calculate the start of this element (tag + VR + length + data)
      // Element header starts before dataOffset
      let headerSize: number;
      if (elem.hadUndefinedLength) {
        headerSize = elem.vr ? 12 : 8;
      } else if (elem.vr === 'OB' || elem.vr === 'OW' || elem.vr === 'OF' ||
                 elem.vr === 'SQ' || elem.vr === 'UC' || elem.vr === 'UN' ||
                 elem.vr === 'UR' || elem.vr === 'UT') {
        headerSize = 12; // 4 tag + 2 VR + 2 reserved + 4 length
      } else if (elem.vr) {
        headerSize = 8;  // 4 tag + 2 VR + 2 length
      } else {
        headerSize = 8;  // implicit VR: 4 tag + 4 length
      }

      const elemStart = (elem.dataOffset ?? 0) - headerSize;
      const elemEnd = (elem.dataOffset ?? 0) + elem.length;
      if (elemStart >= 0 && elemEnd <= byteArray.length) {
        parts.push(byteArray.slice(elemStart, elemEnd));
      }
    }

    // Concatenate parts
    const totalLen = parts.reduce((sum, p) => sum + p.length, 0);
    const output = new Uint8Array(totalLen);
    let offset = 0;
    for (const part of parts) {
      output.set(part, offset);
      offset += part.length;
    }

    const fileName = `EXPORT_${String(i + 1).padStart(2, '0')}.dcm`;
    zip.file(fileName, output);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'brainaxis-cleaned-dicom.zip');
}
