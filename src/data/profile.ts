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
    title: "근거를 찾아가는 디버깅과 최적화",
    description:
      "버그나 프레임 드랍이 발생하면 입력 전달 경로와 컴포넌트 책임을 살피고, Unity Profiler와 중단점(Breakpoint)으로 원인을 좁혀 캐싱·이벤트 구조로 개선합니다.",
  },
  {
    title: "소통과 구조화로 완주하는 협업",
    description:
      "기획·타 직군과 구현 가능한 동작을 기준으로 조율하고, 작업 단위를 나누어 필요한 API와 저장소 규칙을 맞추며 프로젝트를 끝까지 완성합니다.",
  },
];

export const skills = [
  { name: "Unity", description: "2D 액션·3D 멀티플레이·시뮬레이션 프로젝트에서 인게임 시스템, New Input System, Addressables, UGUI, 씬 전환 및 Google Sheets 연동 에디터 도구를 다룬 경험.", category: "게임 엔진" },
  { name: "C#", description: "ScriptableObject 기반 데이터 분리, 인터페이스·추상 클래스를 활용한 스킬·축복 설계, C# 이벤트 기반 상태 알림, UniTask 비동기 처리 활용.", category: "프로그래밍 언어" },
  { name: "C", description: "System V 공유 메모리와 POSIX 시그널, 파이프 기반 프로세스 간 통신 구조에서 실행 루프를 설계하고 구동 검증을 수행.", category: "프로그래밍 언어" },
  { name: "Python", description: "객체지향 구조로 게임 루프와 엔티티 관리를 작성하고 외부 물리·그래픽 패키지를 결합한 경험.", category: "프로그래밍 언어" },
  { name: "C++", description: "컨테이너와 탐색·정렬 구조를 직접 작성하며 메모리 관리와 언어 기본기를 다지는 중.", category: "프로그래밍 언어" },
  { name: "Pygame", description: "프레임 타이밍 제어, 입력 이벤트 분기, 스프라이트 그룹 렌더링 및 사운드 재생 처리.", category: "라이브러리" },
  { name: "Pymunk", description: "2D 강체 물리 공간(Space) 설정과 도형 간 접점(Contact) 계산을 활용한 충돌 판정.", category: "라이브러리" },
  { name: "SDL2", description: "공유 메모리·파이프로 전달된 게임 상태를 SDL2 화면 출력 주기와 맞물려 갱신하는 루프 설계 및 구동 확인.", category: "라이브러리" },
  { name: "FSM", description: "대기·이동·대시·공격·피격 등 캐릭터 상태와 상점 손님 AI의 단계별 행동 전이를 설계.", category: "설계 및 구현" },
  { name: "게임 UI와 팝업 관리", description: "이벤트 기반의 플레이어·스킬 HUD 갱신과 Stack·Addressables를 활용한 비동기 팝업 생명주기 관리.", category: "설계 및 구현" },
  { name: "런타임 초기화와 프로파일링", description: "Bootstrapper·ServiceLocator 기반 초기화 순서 정립 및 Unity Profiler를 활용한 GC 스파이크·반복 조회 개선.", category: "설계 및 구현" },
  { name: "Linux와 공유 메모리", description: "System V 공유 메모리(shmget/shmat)와 POSIX 시그널을 이용한 프로세스 간 상태 동기화 구조 이해 및 검증.", category: "개발 환경" },
  { name: "Git", description: "협업 환경에서 브랜치 기반 버전 관리, 커밋 이력 확인 및 .gitignore 등 저장소 설정 관리.", category: "협업" },
  { name: "운영체제와 컴퓨터 이론", description: "프로세스·메모리 관리와 트리·그래프·해시 등 자료구조 및 알고리즘 같은 CS 전공 기초 이론을 학습.", category: "학습 중" },
];
