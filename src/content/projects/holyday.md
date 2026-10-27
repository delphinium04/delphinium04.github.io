---
title: 'HolyDay'
description: '데이터와 효과를 분리한 11종의 축복과 스택형 팝업 관리자를 설계하고, 프로파일러 기반 리팩터링과 Git 병합을 맡았습니다.'
period: '2026.01 ~ 진행 중 (2026.05 PlayX4 전시 · Steam 출시 준비)'
team: '4인 팀 프로젝트'
role: '프로그래밍(UI / Scene) 및 Git 관리 (축복 시스템·팝업 관리·UI·초기화 및 매니저 구조)'
stack: ['Unity', 'C#', 'Photon Fusion', 'UniTask', 'UGUI']
order: 2
heroImage: '/portfolio/holyday.webp'
imageWidth: 460
imageHeight: 215
badge: 'PlayX4 2026 시연'
videos:
  - type: 'youtube'
    id: 'mF_PZJ_SnCo'
    title: 'HolyDay 소개 영상'
    unavailableReason: '업로더 설정에 의해 외부 페이지 임베드 재생이 제한되어 있습니다. 아래 링크를 통해 YouTube에서 바로 시청하실 수 있습니다.'
links:
  - label: '소개 영상 (YouTube)'
    url: 'https://youtu.be/mF_PZJ_SnCo'
---

> 다른 이를 저지하고 석상을 점령하여 당신의 신앙심을 증명하여라

## 1. 프로젝트 진행 배경

### 게임 소개

**HolyDay**는 상대 팀을 저지하며 전장의 석상을 점령해 더 많은 신성력(점수)을 획득하는 **4인 멀티플레이 MOBA(AOS) 게임**입니다. 2026년 5월 PlayX4 전시에서 상명대학교 게임전공 부스로 출품해 현장 유저 테스트를 거쳤으며, 현재 Steam 정식 출시를 목표로 UI/UX 개편 및 아키텍처 보수 작업을 진행하고 있습니다.

### 개발 목표와 조건

- Steam 출시를 목표로 한 4인 멀티플레이 게임 개발
- 4명이 기획 / 프로그래밍 / 그래픽 전반에 함께 참여
- 게임 실행부터 매칭 / 플레이 / 승패 처리 / 종료까지 이어지는 전체 게임 사이클 완성

---

## 2. 팀 구성 및 담당 역할

| 구성원 | 담당 영역 | 구체적인 작업 |
| --- | --- | --- |
| **본인** | 프로그래밍(UI / Scene), Git 관리 | 축복(Bless) 시스템, 팝업 관리, UGUI 구성, 게임 초기화 과정 및 매니저 구조, 런타임 리팩터링 |
| **팀원 1** | 프로그래밍 | 로비 생성 및 참여, 인게임 규칙 구현 |
| **팀원 2** | 기획 및 프로그래밍 | 게임 규칙 기획, 석상 점령 시스템 구현 |
| **팀원 3** | 기획 및 프로그래밍 | 캐릭터와 캐릭터 스킬 기획 및 구현 |

### 내가 맡은 핵심 구현

- **Bless(축복) 시스템**의 초기 구조 설계와 정적 데이터 / 실행 로직 분리
- **`PopupType` 키와 `Stack` 기반 비동기 Popup 관리 시스템** 설계 및 구현
- **UGUI 레이아웃 구성** 및 다국어(한국어·영어) 현지화 연동
- **서비스 로케이터 기반 게임 필수 매니저** 구성과 초기화 순서 정립
- **후반부 석상 / 공통 UI 계층 리팩터링** 및 Unity Profiler 기반 런타임 개선

### 협업과 기여 범위

축복(Bless)과 팝업(Popup)은 제가 주도한 구조 설계와 공통 실행 파이프라인을 중심으로 설명합니다. 캐릭터 내부 스탯 제어와 기도 애니메이션은 캐릭터 담당 팀원과 협업해 연결했습니다. 개발 후반부에는 팀원들의 기능 추가와 AI 생성 코드 병합 과정에서 누적된 중복 로직 및 구조 불일치를 점검하고, 매니저·UI 구조 통합과 런타임 최적화를 담당했습니다.

---

## 3. 주요 문제와 해결 과정

### 3-1. 데이터와 전략 패턴을 분리한 Bless(축복) 시스템

#### 구현 목표와 설계 배경

점령전 중심의 경기 양상에 변수를 부여하기 위해, 맵 내 연못과 상호작용하면 무작위 효과가 발동하는 축복 시스템을 기획했습니다. 리그 오브 레전드의 증강 시스템에서 아이디어를 얻었으며, 축복은 경기 규칙 변화와 캐릭터 버프·디버프를 제공합니다.

11종 이상의 축복이 서로 다른 타겟과 발동 조건을 요구했기 때문에, 단일 클래스의 조건문으로 처리하면 코드가 비대해질 위험이 있었습니다. 또한 후반부에 추가된 일부 축복은 캐릭터 내부 상태나 직업군 필터링을 요구했습니다. 이에 축복의 정적 데이터와 실행 로직을 분리하고, 외부 캐릭터 기능은 담당 팀원과 필요한 API를 합의해 연동하는 구조를 선택했습니다.

- **축복 적용 흐름**: `연못 상호작용 (INetworkInteract)` → `축복 등급 추첨` → `해당 등급 내 가용 축복 선택` → `기도 애니메이션` → `축복 인스턴스 생성` → `규칙 변경 / 버프 / 디버프 적용`

#### 내가 적용한 방법

- 연못 오브젝트에 `INetworkInteract` 기반 상호작용 진입점을 두어 멀티플레이 상호작용 규격 통일
- `BlessData`(`ScriptableObject`)에 축복 타입, 등급(`Rank`), 현지화 텍스트(`LocalizedString`) 등 정적 데이터 정의
- **Mercy 20% / Grace 50% / HolyMoly 30%** 비율로 등급을 먼저 결정하고, 해당 등급의 가용 축복을 균등 추첨하는 2단계 확률 로직 작성
- `IBlessLogic` 전략 인터페이스와 `Dictionary<BlessType, Func<IBlessLogic>>` 팩토리 매핑으로 타입별 분기문 대신 독립된 효과 인스턴스 생성 및 실행
- 캐릭터 스탯 등 외부 모듈 접근이 필요한 축복은 담당 팀원에게 필요한 API와 진입점을 요청해 연결

#### 핵심 코드: 데이터와 효과 실행 구조

```csharp
[Serializable]
[CreateAssetMenu(fileName = "Bless Data", menuName = "Game/Bless/Data")]
public class BlessData : ScriptableObject
{
    public BlessType Type => _type;
    public BlessRank Rank => _rank;
    public string StableKey => _type.ToString();

    public string Name =>
        LocalizedStringFallback.Resolve(_localizedName, _name);

    public string Description =>
        LocalizedStringFallback.Resolve(_localizedDescription, _description);

    [SerializeField] protected BlessType _type;
    [SerializeField] protected BlessRank _rank;
    [SerializeField] protected string _name;
    [SerializeField] LocalizedString _localizedName;
    [SerializeField] protected string _description;
    [SerializeField] LocalizedString _localizedDescription;
}

public interface IBlessLogic
{
    void Execute(BlessBehaviour self, NetworkObject player);
    void Destroy();
}
```

#### 핵심 코드: 축복 생성 (팩토리 매핑)

```csharp
static readonly Dictionary<BlessType, Func<IBlessLogic>> LogicFactories = new()
{
    { BlessType.AngelBaby,         () => new AngelBaby() },
    { BlessType.AngelSoldier,      () => new AngelSoldier() },
    { BlessType.GoddessOfRichness, () => new GoddessOfRichness() },
    { BlessType.FireDemon,         () => new FireDemon() },
    { BlessType.Ares,              () => new Ares() },
    { BlessType.Apollon,           () => new Apollon() },
    { BlessType.IceDemon,          () => new IceDemon() },
    { BlessType.Zeus,              () => new Zeus() },
    { BlessType.GoddessOfHunt,     () => new GoddessOfHunt() },
    { BlessType.Gabriel,           () => new Gabriel() },
    { BlessType.Theseus,           () => new Theseus() }
};

if (!LogicFactories.TryGetValue(data.Type, out var createLogic))
    return;

IBlessLogic logic = createLogic();
```

`BlessType`별 생성 함수를 사전 등록하고, 추첨된 축복 타입에 대응하는 `IBlessLogic` 객체를 생성합니다. 생성은 매 프레임이 아니라 연못 상호작용에 따른 축복 발동 시점에 이루어집니다. 인스턴스를 분리해 효과별 내부 상태와 해제 책임이 서로 섞이지 않도록 설계했으며, 발동 시 객체 할당은 발생하므로 GC 비용이 없다고 주장하지 않습니다.

#### 구현 결과

- 11종의 축복을 정적 데이터와 전략 로직으로 분리해 단일 실행 파이프라인에서 일관되게 관리
- 필요한 캐릭터 API는 요구 배경과 필요한 메서드·필드를 캐릭터 담당자에게 전달해 협업으로 확보

---

### 3-2. PopupType 키와 Stack 기반의 비동기 Popup 관리 시스템

#### 구현 목표와 설계 배경

로비, 매칭, 인게임, 결과 창 등 다양한 화면에서 팝업이 빈번하게 호출되었으나, 각 화면이 팝업 프리팹이나 리소스 경로를 직접 참조하면 의존성이 강해지고 생성·해제 코드가 중복되는 문제가 있었습니다. 호출부에서는 오직 `PopupType` 키만 전달하면 비동기 생성부터 표시, 중첩 순서 관리, 리소스 해제까지 일괄 처리하는 중앙 관리 시스템이 필요했습니다.

#### 내가 적용한 방법

- `PopupType` 열거형과 `PopupResourcePath`를 매핑하여 팝업 리소스 경로(Address)를 단일 지점에서 관리
- `Addressables.InstantiateAsync()`와 `UniTask`를 결합하여 팝업 프리팹의 비동기 로드 및 표시(`Show()`) 파이프라인 구축
- 제네릭 메서드 `Show<T>(PopupType, Action<T>)`를 제공하여 팝업이 화면에 표시되기 직전에 초기화 데이터를 타입 안전(Type-safe)하게 주입하도록 설계
- 다중 팝업이 겹쳐 열리는 상황을 제어하기 위해 `Stack<PopupBase>` 구조를 도입하고, 닫기 요청 시 항상 최상단(Top) 팝업부터 순차적으로 닫히도록 제어
- 팝업 종료 시 이벤트 구독을 해제한 뒤 `Addressables.ReleaseInstance()`를 호출하여 인스턴스를 파괴하고 관련 리소스의 참조 카운트를 감소시키도록 처리 (공유 리소스는 남아 있는 참조에 따라 유지되며, 참조 카운트를 기준으로 해제됨)

#### 핵심 코드: PopupType 키로 팝업 요청 및 Stack 등록

```csharp
public async UniTask<PopupBase> Show(PopupType type)
{
    if (!PopupResourcePath.TryGet(type, out var address))
    {
        this.LogWarning($"등록되지 않은 팝업 타입: {type}");
        return null;
    }

    return await Show(address);
}

public async UniTask<PopupBase> Show(string address)
{
    var popup = await InstantiatePopupAsync(address);
    if (popup == null)
        return null;

    if (_popupStack.Count == 0)
    {
        SetActive(true);
        FadeBackground(true).Forget();
    }

    _popupStack.Push(popup);
    await popup.Show();
    return popup;
}
```

호출부는 `PopupType.Settings`나 `PopupType.Notice`처럼 필요한 팝업의 키만 전달합니다. `PopupResourcePath`가 키에 대응하는 주소를 조회하고, `InstantiatePopupAsync()`에서 공용 UI 캔버스 구조를 준비해 팝업을 비동기 생성한 뒤 닫기·추가 팝업 요청 이벤트를 연결합니다. 닫을 때는 `Stack` 최상단 팝업을 꺼내 숨김 애니메이션을 실행하고, 이벤트 연결을 해제한 뒤 인스턴스를 반환합니다.

#### 구현 결과

- 호출부에서 프리팹이나 경로를 직접 참조하지 않고 `PopupType` 키만으로 팝업 제어 가능
- 새 팝업 추가 시 `PopupType` 키·경로 매핑과 `PopupBase` 상속 클래스만 작성하면 기존 비동기 생성 및 Stack 관리 체계에 즉시 편입
- 생성 / 표시 / 닫기 / 이벤트 해제 / Addressables 리소스 반환을 매니저에 일원화하여 화면별 중복 코드와 해제 누락으로 인한 메모리 누수 위험 감소
- **키워드**: `Addressables` · `UniTask` · `Stack` · `Generics` · `UGUI`

---

### 3-3. 매니저 구조 정리 및 프로파일러 기반 런타임 리팩터링

#### 구현 목표와 설계 배경

4명의 팀원이 기능을 병렬로 추가하고 개발 후반부에 AI 생성 코드가 누적되면서, 매니저의 책임과 참조 관계를 정리하고 초기화 순서를 명확하게 관리할 필요가 있었습니다. 플레이 테스트 후 Unity Profiler 점검에서 확인한 반복 컴포넌트 조회와 불필요한 상태 검사도 함께 개선했습니다.

#### 내가 적용한 방법

- **서비스 로케이터 기반 매니저 관리**: 게임 필수 매니저를 공통 접근 지점에서 관리하고 생성·초기화 순서를 정립해, 매니저마다 흩어진 직접 참조와 초기화 순서 의존을 완화했습니다.
- **석상 공통 동작과 UI 계층 통합**: 석상별 상호작용·표시 로직을 재사용 가능한 구조로 통합했습니다. 개별 UI가 직접 제어하던 계층과 표시 순서는 상위 UI 계층으로 옮겨 중복 코드와 오브젝트별 예외 처리를 줄였습니다.
- **Unity Profiler 기반 반복 조회 개선**: `Update()`에서 매 프레임 수행하던 `GetComponent` 등의 반복 조회를 초기화 시점 캐싱으로 전환했습니다.
- **Polling → Event 전환**: 매 프레임 확인할 필요가 없는 상태 정보를 이벤트 구독 방식으로 바꿔, 실제 값 변화가 있을 때만 UI를 갱신하도록 수정했습니다.
- **한·영 현지화 적용**: AI Agent를 활용해 하드코딩된 UI 문자열을 현지화 테이블 구조로 추출하고, 한국어·영어 선택 기능을 연결했습니다.

#### 변경 전후와 구현 결과

- **개별 매니저의 참조 / 초기화 책임 분산** → 공통 관리 지점과 명시적인 초기화 순서로 통합
- **석상 / UI마다 반복되던 제어 코드** → 상위 계층에 책임을 모아 재사용
- **매 프레임 컴포넌트 조회 및 상태 검사** → 초기화 시점 캐싱과 상태 변경 이벤트 기반 갱신으로 전환
- 반복 조회와 불필요한 갱신을 줄이고 유지보수 지점을 단일화했습니다. 성능 개선은 적용한 구조 변경 범위로 설명하며, 별도의 전후 측정 자료 없이 CPU 시간이나 FPS 개선율을 수치로 제시하지 않습니다.

---

## 4. 프로젝트 결과와 회고

### 최종 결과

![PlayX4 2026 상명대학교 게임전공 부스 HolyDay 전시 및 시연 현장](/portfolio/holyday-playx4.jpg)

- 2026년 1월부터 5월까지 플레이 가능한 멀티플레이 빌드를 완성하여 **PlayX4 상명대학교 게임전공 부스에서 현장 전시 및 시연**을 진행했습니다.
- 2026년 9월부터 Steam 정식 출시를 위한 보수 작업에 돌입했으며, 전반적인 게임 UI 개편 및 애니메이션 수정 작업을 이어가고 있습니다.

### 배운 점

게임을 완성할 때는 개개인의 구현 능력뿐 아니라 팀 내 규칙, 역할 분담, 의사결정 체계가 함께 뒷받침되어야 한다는 점을 배웠습니다. 또한 AI가 초기 코드 작성 속도를 높여줄 수는 있어도, 명확한 작업 기준과 지속적인 검증이 없으면 추후 구조를 합치고 디버깅하는 데 오히려 더 많은 시간이 소요될 수 있음을 경험했습니다.

### 아쉬운 점과 개선 방향

#### 1. 개발 규약과 Git 관리

팀 전체에 코딩 컨벤션이 일관되게 적용되지 않아 명명 방식과 코드 구조에 편차가 생겼고, Git 커밋 규칙도 충분히 통일하지 못했습니다. 다음 프로젝트에서는 개발 시작 전에 **명명 규칙 / 폴더 구조 / 커밋 메시지 / 브랜치 운영 방식**을 문서화하고, 코드 리뷰를 통해 규약이 지속적으로 유지되도록 관리할 계획입니다.

#### 2. 역할과 의사결정 구조

네 명 모두가 기획 / 프로그래밍 / 그래픽 전반에 참여하면서 각 영역의 책임과 최종 결정권이 명확하지 않았습니다. 그 결과 개발 중 게임 콘셉트가 반복해서 변경되었고, 최종 결과물이 초기 기획과 크게 달라졌습니다. 다음 협업에서는 직군별 책임과 결정 범위를 먼저 정하고, 콘텐츠 변경 시 담당자의 검토와 합의를 거치도록 해 방향이 흔들리는 상황을 줄이고자 합니다.

#### 3. 멀티플레이 프레임워크의 기술적 검토

Photon Fusion으로 멀티플레이 환경을 구축하면서, 프로젝트에 적용되는 동시접속자(CCU) 비용 구조와 로컬 LAN 매칭 테스트 환경 구성의 제약을 검토하게 되었습니다. 이 경험을 통해 기능 구현 가능 여부뿐 아니라 **테스트 편의성과 운영 비용**도 네트워크 솔루션 선정 기준에 포함해야 함을 배웠습니다. 차기 프로젝트에서는 FishNet 등 대안을 비용, 테스트 환경, 요구 기능에 맞춰 비교 검증할 계획입니다.

#### 4. 테스트 가능한 구조

게임의 주요 로직이 Singleton과 전체 게임 진행 단계에 강하게 묶여 있어, 특정 기능만 독립적으로 실행하거나 검증하기 어려웠습니다. 작은 수정을 확인할 때도 매칭과 게임 시작 단계부터 반복해야 했기 때문에 번거로움이 컸습니다. 앞으로는 기능을 제작할 때 단위 검증용 테스트 Scene도 함께 구성해, 게임을 처음부터 실행하지 않고도 해당 기능만 즉시 확인할 수 있도록 개선하고 싶습니다.

#### 5. AI 활용 개발 시의 코드 일관성 및 검증 파이프라인

개발 후반부에는 생산성을 높이기 위해 AI 코드 생성을 적극적으로 활용했습니다. 다만 공통 아키텍처 가이드라인 없이 각자 생성한 코드를 병합하면서 기존 컨벤션과 맞지 않거나 중복된 로직이 누적됐고, 이를 정리하는 리팩터링에 많은 시간이 필요했습니다. 이 과정에서 생성 속도와 별개로 **구조적 정합성을 검토하는 책임은 개발자에게 있음**을 배웠습니다.

향후에는 작업 전에 코딩 컨벤션, 아키텍처 규칙, 금지 패턴과 검증 절차를 팀 단위의 Agents 가이드라인 및 프롬프트 컨텍스트로 표준화하고, 생성된 코드가 기존 책임 분리에 맞는지 먼저 검토한 뒤 병합할 것입니다.
