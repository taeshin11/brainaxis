# BodyAtlas 인수인계 문서

> 다른 컴퓨터/세션에서 작업을 이어받을 때 제일 먼저 읽는 파일.
> 매 세션 종료 시 이 파일을 **덮어쓰기** — 항상 "지금의 상태"만 유지.

---

## 🏃 지금 바로 할 일

- **현재 상태:** Spine X-ray Atlas 기능 추가 완료 — 빌드 통과, 커밋/푸시 완료
- **다음 세션 시작 시:** `.env.local` 확인 후 `npm run dev` → Spine X-ray 탭 실제 동작 확인
- **미완료 WIP 내역 (Session 3):**
  - Spine X-ray Atlas 추가는 완료됨. 아직 **브라우저에서 실제 렌더링 검증 안 됨** (.env.local 없어서 dev 서버 못 띄운 상태)

## 📝 최근 결정사항 (WHY)

- **Spine X-ray Atlas 추가 (Session 3):**
  - `D:\ImageLabelAPI_SPINAI\SBJ_LLXR` 데이터에서 최적 이미지 2장 선별:
    - Lateral: `20250807_00273183_T-L-spine_Lat_1.png` (679×926, T5~S1, 15개 vertebra)
    - AP: `20250806_00154057_L-spine_AP_1.png` (467×895, T10~S1, 10개 vertebra)
  - labelme polygon JSON → BodyAtlas contour JSON 변환 (`scripts/gen_spine_xray_atlas.py`)
  - `public/data/spine-xray/` 생성 (images + labels + info.json + structures.json)
  - `SpineXrayViewer.tsx` 신규 컴포넌트 — Lateral/AP 2-panel 동시 표시
  - `RegionSelector.tsx` → `spine_xray` 탭 추가 (🦴 Spine X-ray / 척추 X선)
  - `page.tsx` → spine_xray 선택 시 SpineXrayViewer로 분기
- **다른 데이터셋 분석 결과:**
  - CTSpine1K (610 NIfTI seg masks) → CT 이미지 없어서 바로 사용 불가 (download 필요)
  - OLIF dataset (150k DICOM + labeled) → 임상 데이터, PHI 우려로 보류
  - LIDC (lung nodule HDF5) → 아틀라스 용도에 부적합

## 🚧 미해결 블로커

- 없음 (알려진 것 기준)

## 🔑 필요한 환경변수 (.env.local)

값은 직접 복사해서 옮겨야 함. Vercel 대시보드에도 이미 세팅되어 있음:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FORMSPREE_ID=
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=   # (선택)
```

## 🛠 다른 컴퓨터 세팅 순서

```bash
git clone https://github.com/taeshin11/bodyatlas.git BodyAtlas
cd BodyAtlas
npm install
# .env.local 파일 수동으로 옮기기
npm run dev
```

## 📚 핵심 파일 가이드

- `PRD.md` — 제품 요구사항 (현재 v2.0)
- `claude-progress.txt` — 세션 누적 로그
- `feature_list.json` — 기능 목록 원본
- `src/config/features.ts` — 활성화된 기능 플래그
- `src/components/AtlasViewer.tsx` — CT/MRI 뷰어 (axial/sagittal/coronal 3-plane)
- `src/components/SpineXrayViewer.tsx` — Spine X-ray 뷰어 (Lateral/AP 2-panel)
- `src/components/RegionSelector.tsx` — 바디 리전 탭 (BodyRegion 타입 포함)
- `public/data/chest-ct/` — CT 아틀라스 데이터 (108 structures, 1053 slices, 1.5mm)
- `public/data/spine-xray/` — Spine X-ray 아틀라스 (15 structures, Lateral+AP)
- `scripts/gen_spine_xray_atlas.py` — Spine X-ray 데이터 생성 스크립트
- `data_pipeline/` — 데이터 전처리 스크립트 (TotalSegmentator)
- `supabase/` — Supabase 설정

## 🌐 배포

- 프로덕션: brainaxis.vercel.app (도메인 교체 예정)
- GitHub: github.com/taeshin11/bodyatlas

---

_마지막 업데이트: 2026-04-06 (Session 3)_
