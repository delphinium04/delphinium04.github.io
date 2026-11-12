---
title: 'HolyDay'
description: '데이터와 효과를 분리한 11종의 축복과 스택형 팝업 관리자를 설계하고, 프로파일러 기반 리팩터링과 Git 병합을 맡았습니다.'
period: '2026.01 ~ 2026.11 (2026.11.09 Steam 출시)'
team: '4인 팀 프로젝트'
roleLabel: '구현한 주요 기능'
role: '축복(Bless) 시스템 · Stack 기반 팝업 관리 · Bootstrapper 초기화 및 매니저 구조 · 런타임 리팩터링 및 최적화'
stack: ['Unity', 'C#', 'Photon Fusion', 'UniTask', 'UGUI']
order: 2
heroImage: '/portfolio/holyday.webp'
imageWidth: 1730
imageHeight: 890
badge: 'PlayX4 2026 시연 · Steam 출시'
steamAppId: '5013770'
links:
  - label: 'Steam 상점 페이지'
    url: 'https://store.steampowered.com/app/5013770'
---

> 다른 이를 저지하고 석상을 점령하여 당신의 신앙심을 증명하여라

## 1. 게임 소개

**HolyDay**는 상대 팀을 저지하며 전장의 석상을 점령해 더 많은 신성력(점수)을 획득하는 **4인 멀티플레이 MOBA(AOS) 게임**입니다. 2026년 5월 PlayX4 전시에서 상명대학교 게임전공 부스로 출품해 현장 유저 테스트를 거쳤으며, 2026년 11월 9일 Steam에 정식 출시했습니다.

---

## 2. 프로젝트 소개

### 팀 구성 및 역할

| 구성원 | 구체적인 작업 |
| --- | --- |
| <mark>**[delphinium04(본인)](https://github.com/delphinium04)**</mark> | • **축복(Bless) 시스템**: 정적 데이터·실행 로직 분리 구조 설계 및 11종 축복 구현, 캐릭터 상호작용·Outline 효과 연동<br>• **UI 및 팝업 관리**: Stack 기반 비동기 `PopupManager`, UGUI 레이아웃 구성, 캐릭터 선택·로비·인게임 UI 구현<br>• **게임 초기화 및 시스템**: 부트스트래퍼·매니저 초기화 순서 정립, 씬 전환·인트로 연출, Steam Cloud 동기화 및 로비 인증<br>• **리팩터링 및 최적화**: 에셋·패키지 정리, 빌드 관리 최적화 및 맵 개선 |
| [yjh6467](https://github.com/yjh6467) | • **네트워크 및 로비**: Photon Fusion 기반 세션 생성·참여, 팀 변경·방 코드·Steam 친구 초대 및 콜백 분리<br>• **인게임 규칙 및 매칭**: 게임 매니저·매칭 흐름, 스폰 포인트·석상 스폰 관리, 데미지·사망·승패 판정 동기화<br>• **AI·사운드·이펙트**: AI 캐릭터 스폰·NavMesh 이동 연동, 이펙트 풀링 및 인게임·캐릭터 사운드 RPC 처리 |
| [GameHub2021](https://github.com/GameHub2021) | • **석상 점령 시스템**: 평화·전투·막타 등 석상 점령 로직 및 패널 UI, 석상 VFX/SFX, 맵 지형·미니맵 구성<br>• **커뮤니케이션**: Photon Chat 채팅 및 Photon Voice 음성 채팅 시스템 구축·UI 연동<br>• **튜토리얼 및 UI 연출**: 튜토리얼 씬·퀘스트·Waypoint·가이드 UI, 타이틀 화면·나레이션·EventFeed·게임 결과창 UI 연출 |
| [Solip0702](https://github.com/Solip0702) | • **캐릭터 및 스킬 구현**: 기사·버서커·듀얼블레이드·메이지(화염·얼음·전기) 캐릭터, 기본 공격·패시브·궁극기 구현<br>• **전투 판정 및 밸런스**: 투사체·히트박스·상태이상(빙결 등) 판정, 입력 잠금(InputLock)·조준감·직업군 밸런스 조정<br>• **애니메이션 및 VFX**: 캐릭터 모델링·애니메이션·디졸브 셰이더·스킬 VFX 적용 및 AI 캐릭터 전투 판정 연동 |

프로그래밍, 기획, 아트와 같은 역할 구분 없이 4명이 각자 배정된 기능과 관련한 요소를 맡아 작업했습니다.

### 개발 목표와 조건

- Steam 출시를 목표로 한 4인 멀티플레이 게임 개발
- 4명이 기획 / 프로그래밍 / 그래픽 전반에 함께 참여
- 게임 실행부터 매칭 / 플레이 / 승패 처리 / 종료까지 이어지는 전체 게임 사이클 완성

---

## 3. 주요 문제와 해결 과정

### 3-1. 데이터와 전략 패턴을 분리한 Bless(축복) 시스템

#### 구현 목표와 설계 배경

게임을 플레이 가능할 정도로 완성한 뒤, 다같이 테스트 해본 결과 점령전 규칙만으로는 게임이 너무 지루하다라는 공통된 의견이 나왔습니다. 그래서 게임에 변수를 부여하기 위해, 맵 내 연못과 상호작용하면 무작위 효과가 발동하는 축복 시스템을 추가했습니다. 리그 오브 레전드의 증강 시스템에서 아이디어를 얻었으며, 축복은 경기 규칙 변화 및 캐릭터 버프·디버프를 제공합니다.

11종 이상의 축복이 서로 다른 타겟과 발동 조건을 요구했고, 후반부에 추가된 일부 축복은 캐릭터 내부 상태나 직업군 필터링을 요구했습니다. 이에 축복의 정적 데이터와 실행 로직을 분리하고, 특정 직업 군의 스탯을 조정하는 등 다른 사람이 작업한 영역을 건드리는 경우엔 담당 팀원과 필요한 필드, 메소드를 이야기해서 연동하는 구조를 선택했습니다.

- **축복 적용 흐름**: `연못 상호작용 (INetworkInteract)` → `축복 등급 추첨` → `해당 등급 내 가용 축복 선택` → `기도 애니메이션` → `축복 인스턴스 생성` → `규칙 변경 / 버프 / 디버프 적용`

#### 내가 적용한 방법

- 연못 오브젝트에 `INetworkInteract` 기반 상호작용 진입점을 두어 멀티플레이 상호작용 규격 통일
- `BlessData`(`ScriptableObject`)에 축복 타입, 등급(`Rank`), 이름·설명 등 정적 데이터 정의
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

#### 구현 결과

- 11종의 축복을 정적 데이터와 전략 로직으로 분리해 단일 실행 파이프라인에서 일관되게 관리
- 필요한 캐릭터 API는 요구 배경과 필요한 메서드·필드를 캐릭터 담당자에게 전달해 협업으로 확보

#### 회고

돌아보면 이 구조에서 **팩토리 매핑(`Dictionary<BlessType, Func<IBlessLogic>>`)까지 도입할 필요가 있었을까** 하는 아쉬움이 남습니다. 당시에는 디자인 패턴을 학습하던 과도기였던 만큼 새롭게 배운 요소들을 실제 게임 코드에 적용해보고 싶은 마음이 컸고, 그 결과 문제 상황에 비해 다소 과도하게 패턴을 적용한 감이 있었습니다.

필요에 의해 자연스럽게 구조가 도출되었다기보다, **이 디자인 패턴을 써보기 위해 사용처를 찾고 있었다**에 가까웠다는 점이 후회됩니다. 이후에는 패턴 적용 자체보다 현재 규모에 맞는 단순한 해결책을 먼저 고민해봐야 할 것 같습니다.

---

### 3-2. PopupType 키와 Stack 기반의 비동기 Popup 관리 시스템

#### 구현 목표와 설계 배경

로비, 매칭, 인게임, 결과 창 등 다양한 화면에서 팝업이 빈번하게 호출되었으나, 각 화면이 팝업 프리팹이나 리소스 경로를 직접 참조하면 의존성이 강해지고 생성·해제 코드가 중복되는 문제가 있었습니다. 호출부에서는 오직 `PopupType` 키만 전달하면 비동기 생성부터 표시, 중첩 순서 관리, 리소스 해제까지 일괄 처리하는 중앙 관리 시스템이 필요했습니다.

#### 내가 적용한 방법

- `PopupType` 열거형과 `PopupResourcePath`를 매핑하여 팝업 리소스 경로(Address)를 단일 지점에서 관리
- `Addressables.InstantiateAsync()`와 `UniTask`를 결합하여 팝업 프리팹의 비동기 로드 및 표시(`Show()`)로 멈춤 최소화
- 제네릭 메서드 `Show<T>(PopupType, Action<T>)`를 제공하여 팝업이 화면에 표시되기 직전에 초기화 데이터를 안전하게 주입하도록 설계
- 다중 팝업이 겹쳐 열리는 상황을 제어하기 위해 `Stack<PopupBase>` 구조를 도입하고, 닫기 요청 시 항상 최상단(Top) 팝업부터 순차적으로 닫히도록 제어
- 팝업 종료 시 이벤트 구독을 해제한 뒤 `Addressables.ReleaseInstance()`를 호출하여 인스턴스를 파괴하고 관련 리소스의 참조 카운트를 감소시키도록 처리

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

<details>
<summary>전체 코드 보기: <code>PopupType.cs</code> · <code>PopupResourcePath.cs</code> · <code>PopupBase.cs</code></summary>

**`PopupType.cs`**

```csharp
public enum PopupType
{
	Settings,
	Profile,
	Language,
	Characters,
	Notice,
}
```

**`PopupResourcePath.cs`**

```csharp
// ReSharper disable InconsistentNaming

using System;
using System.Collections.Generic;

/// <summary>
/// PopupType enum을 Addressable 키로 매핑합니다.
/// 실제 키 문자열은 <see cref="AddressableKey.Popup"/>에서 관리합니다.
/// </summary>
public static class PopupResourcePath
{
	static readonly Dictionary<PopupType, string> AddressMap = new()
	{
		{ PopupType.Settings, AddressableKey.Popup.Settings },
		{ PopupType.Language, AddressableKey.Popup.Language },
		{ PopupType.Characters, AddressableKey.Popup.Characters },
		{ PopupType.Notice, AddressableKey.Popup.Notice },
	};

	public static string Get(PopupType type)
		=> AddressMap.TryGetValue(type, out var address)
			? address
			: throw new ArgumentOutOfRangeException(nameof(type), type, "등록되지 않은 팝업 타입");

	public static bool TryGet(PopupType type, out string address)
		=> AddressMap.TryGetValue(type, out address);
}
```

**`PopupBase.cs`**

```csharp
using Cysharp.Threading.Tasks;
using System;
using DG.Tweening;
using UnityEngine;

namespace Game.Popups
{
	public abstract class PopupBase : MonoBehaviour
	{
		const float ShowAnimationDuration = 0.2f;
		const float HideAnimationDuration = 0.1f;

		public abstract bool CanCloseByClickBackground { get; }
		public event Action CloseRequested;
		public event Action<PopupType> PopupRequested;

		RectTransform _panelRectTransform;
		CanvasGroup _canvasGroup;

		protected virtual void Awake()
		{
			_panelRectTransform = transform as RectTransform;
			if (!gameObject.TryGetComponent(out _canvasGroup))
			{
				_canvasGroup = gameObject.AddComponent<CanvasGroup>();
			}

			_canvasGroup.alpha = 0f;
			_canvasGroup.blocksRaycasts = true;
			_canvasGroup.interactable = true;
		}

		// 팝업 열기 흐름 제어 메서드
		public async UniTask Show()
		{
			Initialize();
			await PlayShowingAnimation();
			OnShowCompleted();
		}

		public async UniTask Hide()
		{
			await PlayHidingAnimation();
			OnHideCompleted();
		}

		public virtual void Close()
		{
			CloseRequested?.Invoke();
		}

		protected void RequestPopup(PopupType type) => PopupRequested?.Invoke(type);

		protected virtual void Initialize()
		{
		}

		// Time.timeScale == 0(일시정지)에서도 팝업이 열리고 닫히도록 언스케일 시간으로 재생
		async UniTask PlayShowingAnimation()
		{
			_panelRectTransform.localScale = Vector3.one * 0.9f;
			_canvasGroup.DOFade(1f, ShowAnimationDuration).SetUpdate(true);
			await _panelRectTransform.DOScale(Vector3.one, ShowAnimationDuration).SetUpdate(true)
				.AsyncWaitForCompletion();
		}

		protected virtual void OnShowCompleted()
		{
		}

		async UniTask PlayHidingAnimation()
		{
			_canvasGroup.DOFade(0f, HideAnimationDuration).SetUpdate(true);
			await _panelRectTransform.DOScale(Vector3.one * 0.8f, HideAnimationDuration).SetUpdate(true)
				.AsyncWaitForCompletion();
		}

		protected virtual void OnHideCompleted()
		{
		}
	}
}
```

</details>

#### 구현 결과

- 호출부에서 프리팹이나 경로를 직접 참조하지 않고 `PopupType` 키만으로 팝업 제어 가능
- 새 팝업 추가 시 `PopupType` 키·경로 매핑과 `PopupBase` 상속 클래스만 작성하면 기존 비동기 생성 및 Stack 관리 체계에 즉시 편입
- 생성 / 표시 / 닫기 / 이벤트 해제 / Addressables 리소스 반환을 매니저에 일원화하여 화면별 중복 코드와 해제 누락으로 인한 메모리 누수 위험 감소
- **키워드**: `Addressables` · `UniTask` · `Stack` · `Generics` · `UGUI`

---

### 3-3. 매니저 구조 정리 및 프로파일러 기반 런타임 리팩터링

#### 구현 목표와 설계 배경

4명의 팀원이 기능을 병렬로 추가하고 개발 후반부에 AI 생성 코드가 누적되면서, 매니저의 책임과 참조 관계를 정리하고 초기화 순서를 명확하게 관리할 필요가 있었습니다.

#### 내가 적용한 방법

- **서비스 로케이터 및 `Bootstrapper` 기반 초기화 순서 정립**: `Bootstrapper`가 `RegisterServices()`에서 `ISteamService`, `IAudioService`, `INetworkService`, `ISteamCloudService`, `IPlayerSessionService` 등 필수 서비스를 `ServiceLocator`에 먼저 등록한 뒤, `SingletonManagerRegistry`(`ScriptableObject`)에 등록된 싱글톤 매니저 프리팹 목록을 순서대로 인스턴스화(`CreateSingletonManagers()`)하고 초기화까지 완료한 후 `IsInitialized`를 활성화하도록 구성했습니다.
- **Unity Profiler 기반 반복 조회 개선**: 프로파일러로 확인하던 도중, 이상한 타이밍에 GC 스파이크가 일어나는 경우가 있었습니다. 해당 현상을 유발하는 메소드를 추적해서, `Update()`에서 매 프레임 수행하던 `GetComponent` 등의 반복 조회를 초기화 시점 캐싱으로 전환하는 등 조치를 취해 해결했습니다.
- **Polling → Event 전환**: 매 프레임 확인할 필요가 없는 상태 정보를 이벤트 구독 방식으로 바꿔, 실제 값 변화가 있을 때만 UI를 갱신하도록 수정했습니다.

#### 핵심 코드: Bootstrapper 및 SingletonManagerRegistry 초기화

```csharp
IEnumerator Initialize()
{
    if (IsInitialized) yield break;

    RegisterServices();
    CreateSingletonManagers();
    if (SettingsManager.Instance == null) yield break;
    yield return SettingsManager.Instance.InitializeLanguage();

    IsInitialized = true;
}
```

<details>
<summary>전체 코드 보기: <code>SingletonManagerRegistry.cs</code> · <code>Bootstrapper.cs</code></summary>

**`SingletonManagerRegistry.cs`**

```csharp
using System.Collections.Generic;
using UnityEngine;

namespace Core.Initialization
{
	[CreateAssetMenu(fileName = "SingletonManagerRegistry", menuName = "Core/Initialization/Singleton Manager Registry")]
	public class SingletonManagerRegistry : ScriptableObject
	{
		[SerializeField] List<GameObject> _managerPrefabs = new();

		public IReadOnlyList<GameObject> ManagerPrefabs => _managerPrefabs;
	}
}
```

**`Bootstrapper.cs`**

```csharp
using System.Collections;
using Core.Services;
using Core.Session;
using Game.Lobby;
using Game.Managers;
using UnityEngine;

namespace Core.Initialization
{
	public class Bootstrapper : Generic.Singleton<Bootstrapper>
	{
		[SerializeField] SingletonManagerRegistry _singletonManagerRegistries;

		public bool IsInitialized { get; private set; }

		public void Start()
		{
			StartCoroutine(nameof(Initialize));
		}

		IEnumerator Initialize()
		{
			if (IsInitialized) yield break;

			RegisterServices();
			CreateSingletonManagers();
			if (SettingsManager.Instance == null) yield break;
			yield return SettingsManager.Instance.InitializeLanguage();

			IsInitialized = true;
		}

		/// <summary>서비스 로케이터에 게임 내 필수 서비스 생성 및 등록</summary>
		void RegisterServices()
		{
			var steamManager = FindFirstObjectByType<SteamManager>();
			if (steamManager == null)
			{
				steamManager = new GameObject("@SteamManager").AddComponent<SteamManager>();
			}

            ...

			if (ServiceLocator.Instance.TryGet(out ISteamService steam))
			{
				playerSessionService.Initialize(steam.IsAvailable(), steam.GetSteamId(), steam.GetSteamName());
			}
			else
			{
				playerSessionService.Initialize(false, 0, "");
			}

			playerSessionService.SyncFromSteamCloud();
		}

		void CreateSingletonManagers()
		{
			foreach (var prefab in _singletonManagerRegistries.ManagerPrefabs)
			{
				if (prefab == null)
				{
					this.LogWarning("싱글톤 매니저 프리팹이 지정되지 않음");
					continue;
				}

				Instantiate(prefab);
			}
		}
	}
}
```

</details>

#### 변경 전후와 구현 결과

- **개별 매니저의 참조 / 초기화 책임 분산** → 공통 관리 지점과 명시적인 초기화 순서로 통합
- **석상 / UI마다 반복되던 제어 코드** → 상위 계층에 책임을 모아 재사용
- **매 프레임 컴포넌트 조회 및 상태 검사** → 초기화 시점 캐싱과 상태 변경 이벤트 기반 갱신으로 전환

---

## 4. 프로젝트 결과와 회고

### 최종 결과

![PlayX4 2026 상명대학교 게임전공 부스 HolyDay 전시 및 시연 현장](/portfolio/holyday-playx4.jpg)

- 2026년 1월부터 5월까지 플레이 가능한 멀티플레이 빌드를 완성하여 **PlayX4 상명대학교 게임전공 부스에서 현장 전시 및 시연**을 진행했습니다.
- **2026년 11월 9일 Steam에 정식 출시**했습니다.

### 아쉬운 점과 개선 방향

프로젝트를 완주하면서 개개인의 구현 능력뿐 아니라 팀 내 규칙·역할 분담·의사결정 체계, 그리고 기술 선택에 대한 사전 검증이 함께 뒷받침되어야 한다는 점을 체감했습니다.

#### 1. 개발 규약과 Git 관리

팀 전체에 코딩 컨벤션이 일관되게 적용되지 않아 명명 방식과 코드 구조에 편차가 생겼고, Git 커밋 규칙도 충분히 통일하지 못했습니다. 다음 프로젝트에서는 개발 시작 전에 **명명 규칙 / 폴더 구조 / 커밋 메시지 / 브랜치 운영 방식**을 문서화하고, 코드 리뷰를 통해 규약이 지속적으로 유지되도록 관리할 계획입니다.

#### 2. 역할과 의사결정 구조

네 명 모두가 기획 / 프로그래밍 / 그래픽 전반에 참여하면서 각 영역의 책임과 최종 결정권이 명확하지 않았습니다. 그 결과 개발 중 게임 콘셉트가 반복해서 변경되었고, 최종 결과물이 초기 기획과 크게 달라졌습니다. 다음 협업에서는 직군별 책임과 결정 범위를 먼저 정하고, 콘텐츠 변경 시 담당자의 검토와 합의를 거치도록 해 방향이 흔들리는 상황을 줄이고자 합니다.

#### 3. 멀티플레이 프레임워크의 기술적 검토

Photon Fusion 2를 사용해서 listen server 방식으로 서버를 대체했습니다. 하지만 PlayX4 전시 당시 현장 인터넷 환경이 불안정해 외부 인터넷을 통하지 않고 LAN 내부망만으로 게임을 구동하려 했으나, Fusion 2 구조상 외부 인터넷에 접속할 수 없는 환경에서는 플레이 자체가 불가능하도록 막혀 있다는 점을 뒤늦게 확인했습니다. 이로 인해 현장 유저들에게 최상의 플레이 경험을 온전히 제공하지 못한 점이 큰 아쉬움으로 남았습니다.

상용 SDK가 초기 멀티플레이 구현 속도를 높여준 것은 사실이지만, 네트워크 아키텍처와 오프라인·LAN 환경 제약까지 충분히 검증하지 않고 도입한 점에 후회가 남습니다. 차기 프로젝트에서는 FishNet 등 대안을 포함해 실제 전시·운영 환경과 요구 기능에 맞는 네트워크 솔루션을 사전에 비교 검증할 계획입니다.

#### 4. 테스트 가능한 구조

게임의 주요 로직이 Singleton과 전체 게임 진행 단계에 강하게 묶여 있어, 특정 기능만 독립적으로 실행하거나 검증하기 어려웠습니다. 작은 수정을 확인할 때도 매칭과 게임 시작 단계부터 반복해야 했기 때문에 번거로움이 컸습니다. 앞으로는 기능을 제작할 때 단위 검증용 테스트 Scene도 함께 구성해, 게임을 처음부터 실행하지 않고도 해당 기능만 즉시 확인할 수 있도록 개선하고 싶습니다.

#### 5. AI 활용 개발 시의 코드 일관성 및 검증 파이프라인

개발 후반부에는 생산성을 높이기 위해 AI 코드 생성을 적극적으로 활용했습니다. 다만 공통 아키텍처 가이드라인 없이 각자 생성한 코드를 병합하면서 기존 컨벤션과 맞지 않거나 중복된 로직이 누적됐고, 이를 정리하는 리팩터링에 많은 시간이 필요했습니다. 이 과정에서 생성 속도와 별개로 **결과물에 대한 모든 책임은 온전히 개발자에게 있음**을 배웠습니다.