export const profile = {
  name: "이유찬",
  englishName: "Lee Yuchan",
  coverImage: "/portfolio/cover.jpg",
  photo: "/portfolio/profile.jpg",
  role: "게임 클라이언트 신입 개발자",
  tagline: "기획 의도를 명확한 코드로 풀어내고, 플레이어가 자연스럽게 몰입할 수 있는 완결된 게임을 만듭니다.",
  description:
    "주로 Unity와 C#으로 캐릭터 조작, 전투·스킬, UI 시스템을 다뤄 왔습니다. 문제가 생기면 동작 순서를 차근차근 짚어가며 원인을 찾고, 동료와 호흡을 맞춰 끝까지 결과물을 완성하는 일을 중요하게 생각합니다.",
  email: "flashedmite45@gmail.com",
  github: "https://github.com/delphinium04",
  notion: "https://www.notion.so/62d20568b61a83e0a2bf01d3fff20dc6",
  solvedAc: "https://solved.ac/profile/delphinium04",
  leetcode: "https://leetcode.com/u/delphinium04/",
  location: "대한민국 서울특별시 중랑구",
};

export const strengths = [
  {
    title: "캐릭터 조작과 상태 제어",
    description:
      "플레이어의 이동·대시·전투부터 상점 손님의 단계별 행동까지, 조건이 복잡한 동작을 유한 상태 머신(FSM)으로 명확하게 나눕니다.",
  },
  {
    title: "확장하기 쉬운 시스템과 UI",
    description:
      "데이터와 실행 로직을 분리해 새 규칙이나 스킬을 손쉽게 추가할 수 있는 구조를 잡고, 이벤트 구동 방식의 HUD와 팝업 관리 체계를 만듭니다.",
  },
  {
    title: "모듈 통합과 루프 설계",
    description:
      "입력부터 물리 연산, 규칙 판정, 화면 갱신으로 이어지는 처리 순서를 정돈해 여러 팀원의 작업물이 하나의 게임으로 매끄럽게 맞물리도록 합니다.",
  },
  {
    title: "근거를 찾아가는 디버깅",
    description:
      "버그가 발생하면 입력 전달 경로와 컴포넌트 책임을 먼저 살피고, 중단점(Breakpoint)으로 기대값과 어긋나는 지점을 좁혀 나갑니다.",
  },
  {
    title: "팀 호흡을 살리는 협업과 형상 관리",
    description:
      "작업 단위를 나누어 역할을 조율하고, Git 브랜치와 커밋 이력을 꼼꼼히 살피며 병합 충돌을 해결해 프로젝트의 완주율을 높입니다.",
  },
];

export const skills = [
  { name: "Unity", description: "2D 액션·3D 멀티플레이·시뮬레이션 프로젝트에서 인게임 시스템과 씬 전환, 에셋 파이프라인을 다룬 경험.", category: "게임 엔진" },
  { name: "C#", description: "인터페이스·추상 클래스를 활용한 스킬·축복 설계, C# 이벤트 기반 상태 알림, UniTask 비동기 처리 활용.", category: "프로그래밍 언어" },
  { name: "C", description: "포인터와 구조체, 프로세스 분기(fork) 및 파이프·시그널을 활용한 멀티프로세스 프로그램 작성.", category: "프로그래밍 언어" },
  { name: "Python", description: "객체지향 구조로 게임 루프와 엔티티 관리를 작성하고 외부 물리·그래픽 패키지를 결합한 경험.", category: "프로그래밍 언어" },
  { name: "C++", description: "컨테이너와 탐색·정렬 구조를 직접 작성하며 메모리 관리와 언어 기본기를 다지는 중.", category: "프로그래밍 언어" },
  { name: "Pygame", description: "프레임 타이밍 제어, 입력 이벤트 분기, 스프라이트 그룹 렌더링 및 사운드 재생 처리.", category: "라이브러리" },
  { name: "Pymunk", description: "2D 강체 물리 공간(Space) 설정과 도형 간 접점(Contact) 계산을 활용한 충돌 판정.", category: "라이브러리" },
  { name: "SDL2", description: "프로세스 간 전달된 게임 데이터를 받아 보드·캐릭터 텍스처와 한글 폰트(SDL2_ttf)를 화면에 렌더링.", category: "라이브러리" },
  { name: "FSM", description: "대기·이동·대시·공격·피격 등 캐릭터 상태와 상점 손님 AI의 단계별 행동 전이를 설계.", category: "설계 및 구현" },
  { name: "Shader Graph", description: "화면 전환 연출을 위한 커스텀 셰이더 제작 및 머티리얼 파라미터 제어.", category: "설계 및 구현" },
  { name: "게임 UI와 팝업 관리", description: "Addressables 비동기 로드와 스택(Stack) 구조를 결합한 팝업 생명주기 관리 및 HUD 갱신.", category: "설계 및 구현" },
  { name: "Linux와 공유 메모리", description: "System V 공유 메모리(shmget/shmat)와 POSIX 시그널을 이용한 프로세스 간 상태 동기화.", category: "개발 환경" },
  { name: "Git", description: "브랜치 전략에 따른 병렬 작업 병합, 커밋 이력 기반 충돌 원인 파악 및 기획·아트 에셋 형상 관리.", category: "협업" },
  { name: "자료구조와 알고리즘", description: "트리·그래프·해시 등 핵심 자료구조의 원리를 복습하고 매주 꾸준히 알고리즘 문제를 풀이.", category: "학습 중" },
  { name: "운영체제와 그래픽 렌더링", description: "프로세스·메모리 관리 등 CS 전공 이론과 렌더링 파이프라인의 동작 원리를 학습.", category: "학습 중" },
];
