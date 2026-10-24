# 이유찬 | 게임 클라이언트 개발자 포트폴리오

[delphinium04.github.io](https://delphinium04.github.io)

Astrofy의 사이드바, lofi 테마, 프로젝트 카드, 이력 타임라인을 유지하고 [Notion 포트폴리오](https://www.notion.so/62d20568b61a83e0a2bf01d3fff20dc6)의 내용을 옮긴 정적 사이트입니다.

## 실행

기존 잠금 파일과 GitHub Actions에 맞춰 pnpm 8.15.9를 사용합니다.

```sh
npx --yes pnpm@8.15.9 install --frozen-lockfile
npm run dev
```

배포용 파일을 확인하려면:

```sh
npm run build
npm run preview
```

Astro 설정 디렉터리 쓰기가 제한된 환경에서는 `ASTRO_TELEMETRY_DISABLED=1` 환경 변수를 설정한 뒤 실행합니다.

## 콘텐츠 수정

| 위치 | 내용 |
| --- | --- |
| `src/data/profile.ts` | 소개, 연락처, 핵심 역량 5개, 기술 및 학습 15개 |
| `src/content/projects/*.md` | 프로젝트 소개, 담당 역할, 구현 과정, 결과와 회고 |
| `src/pages/index.astro` | 홈 구성 |
| `src/pages/projects.astro` | 프로젝트 목록 |
| `src/pages/projects/[slug].astro` | 프로젝트 공통 상세 형식 |
| `src/pages/cv.astro` | 학력, 교육·활동, 자격 및 기타 경험 |
| `src/pages/services.astro` | 역량과 기술 |
| `src/content/blog/` | 앞으로 작성할 기술 기록 |
| `src/config.ts` | 사이트 제목과 설명 |
| `public/portfolio/` | Notion에서 내려받은 프로필·프로젝트 이미지, GIF, 플레이 영상 |
| `public/social.svg` / `public/social.png` | 공유 이미지 원본과 배포 이미지 |

프로젝트의 파일명이 상세 주소가 됩니다. 프런트매터에는 `title`, `description`, `period`, `team`, `role`, `stack`, `order`를 지정합니다. `badge`, `heroImage`, `imageWidth`, `imageHeight`, `links`, `videos`는 선택 항목입니다. 목록과 홈은 이 데이터를 함께 사용합니다.

프로필 사진과 프로젝트 대표 이미지 4개는 Notion에서 내려받아 `public/portfolio/`에 저장했습니다. `profile.photo`와 각 프로젝트의 `heroImage`는 `/portfolio/파일명.webp` 경로를 사용합니다. `imageWidth`와 `imageHeight`에는 실제 이미지 크기를 지정해 원본 비율로 표시합니다.

수박 게임의 시연 GIF는 Markdown 이미지로 본문에 넣고, 소개·플레이 영상은 `videos`에 지정합니다. YouTube 영상은 `type: 'youtube'`, `id`, `title`을, 로컬 MP4는 `type: 'file'`, `src`, `title`과 선택 항목 `poster`를 사용합니다. MP4와 GIF 역시 `public/portfolio/`에 저장하고 `/portfolio/` 경로로 참조합니다. 소개 영상의 원본 링크는 기존 `links`에도 유지합니다.

HolyDay의 원본 YouTube 영상은 업로더의 계정 폐쇄로 재생되지 않아 `unavailableReason`으로 상태를 표시하고 원본 링크를 보존합니다. 대체 영상이 생기면 `id`를 바꾸고 해당 항목을 제거하면 됩니다.

## 이식 기준

- Notion의 「이유찬 포트폴리오」에 표시된 Lolling Dice, HolyDay, 수박 게임, 2인 사다리 게임을 옮겼습니다.
- 최신 요약·기간·기여 범위를 우선하고, 연결된 상세 기록에서 구현 과정과 회고를 보완했습니다.
- 프로필 사진·대표 이미지·GIF·MP4는 같은 Notion 페이지의 첨부 미디어에서 내려받았고, YouTube 소개 영상·게임 플레이·GitHub 저장소 링크는 원본 페이지의 링크를 사용했습니다. 외부에 공개되는 파일은 이 저장소에서 함께 관리합니다.
- HolyDay의 2026.01~2026.05는 전시 빌드 개발 기간입니다.
- 청년 일경험은 원본의 기간 차이를 고려해 2025년으로, 매장 근무는 총 2년 이상으로 표시했습니다. 부트캠프는 수료로 표시하지 않았습니다.
- 템플릿의 예제 글과 상품은 제거했습니다. 기술 기록은 빈 화면을 안내하며, 자료실은 메뉴에서 제외했습니다.
- Notion과 자동 동기화하지 않습니다. 이후 수정은 이 저장소의 파일에 반영합니다.

## GitHub Pages

`main` 브랜치에 푸시하면 기존 `.github/workflows/deploy.yml`이 사이트를 빌드해 GitHub Pages로 배포합니다. 사이트 주소는 `astro.config.mjs`에 설정되어 있습니다.

## 기반 템플릿

[Astrofy](https://github.com/manuelernestog/astrofy) · Astro / Tailwind CSS / DaisyUI. 원본 라이선스는 [LICENSE](LICENSE)에 있습니다.
