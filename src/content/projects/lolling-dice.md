---
title: 'Lolling Dice'
description: '주사위 눈금에 따라 달라지는 12종의 스킬과 플레이어 조작, 이벤트 기반 HUD, 기획 데이터 연동 도구를 제작했습니다.'
period: '2026.04.01 ~ 2026.04.20 (2주 개발 · 1주 QA)'
team: '13인 팀 프로젝트 (기획 8명 · 프로그래밍 5명)'
role: '프로그래밍 / 캐릭터 전반 구현 (플레이어 입력·FSM·스킬·HUD·Scene 전환·튜토리얼)'
stack: ['Unity', 'C#', 'New Input System', 'Addressables', 'Shader Graph']
order: 1
heroImage: '/portfolio/lolling-dice.webp'
imageWidth: 1024
imageHeight: 420
badge: '2주 개발 · 1주 QA'
videos:
  - type: 'youtube'
    id: '4j5FVpfi5hc'
    title: 'Lolling Dice 소개 영상'
links:
  - label: '게임 플레이 (itch.io)'
    url: 'https://devel-rocket.itch.io/smart04-lolling-dicemaster'
  - label: '소개 영상'
    url: 'https://www.youtube.com/watch?v=4j5FVpfi5hc'
  - label: 'GitHub 저장소'
    url: 'https://github.com/Kyungil-smart/08-firstcollabproject-Nahyunsusu'
---

> 주사위 속 세계에 갇힌 외계인 비비의 예측 불허 로그라이크 게임

## 1. 프로젝트 진행 배경

### 게임 소개

**LoLLing : Dice Master**는 지구에 불시착한 외계인 비비가 의문의 주사위 속 세계를 탈출하는 **2D 탑뷰 로그라이크 액션 게임**입니다. 플레이어는 마우스 기반 스킬로 몬스터를 처치하며, 스킬 사용 횟수(탄수)를 모두 소진하면 주사위가 자동으로 굴러갑니다. 주사위 눈금(1~6)에 따라 스킬에 추가 효과가 부여되어 매번 전투 양상이 달라집니다. 전투로 경험치와 골드를 획득하고 레벨업과 상점을 통해 비비를 강화하며, 매번 다르게 구성되는 방을 돌파해 세계의 끝에 도달하는 것이 목표입니다.

### 개발 조건과 협업 환경

- 기획 8명, 개발팀 5명으로 진행한 13인 협업 프로젝트
- 기획팀이 작성한 전투 규칙과 12종의 스킬 명세를 바탕으로 시스템 구축
- 2주간의 기능 개발 이후 1주간의 QA 기간 동안 GitHub Issue를 통해 버그 리포트와 수정 이력을 추적하며 완성도 향상

---

## 2. 팀 구성 및 담당 역할

| 구성원 | 담당 영역 | 구체적인 작업 |
| --- | --- | --- |
| **본인** | 프로그래밍 / 캐릭터 전반 | 플레이어 입력과 FSM, HUD, 12종 스킬, 데이터 연동 툴, Scene 전환 및 튜토리얼 |
| **기획팀 (8명)** | 게임 및 스킬 기획 | 전투 규칙과 12종 스킬 기획, 스킬 수치 데이터 설정, 이펙트 지정 |
| **프로그래밍팀 (4명)** | 인게임 콘텐츠 프로그래밍 | 상점, 보스, 일반 몬스터, 절차적 맵 생성 등 |

### 내가 맡은 핵심 구현

- **플레이어 입력 처리** (`New Input System` 기반 이벤트 변환)
- **캐릭터 FSM 설계 및 구현** (6개 상태 분리 및 생명주기 제어)
- **플레이어 스킬 및 전투 시스템** (주사위 눈금 반영 구조 및 12종 스킬 제작)
- **Google Sheets 기반 데이터 반영 자동화 에디터 툴**
- **레벨업 / 스탯 / 장비 및 Scene 간 데이터 영속성**
- **이벤트 기반 HUD와 Scene 전환 연출·튜토리얼**

---

## 3. 주요 문제와 해결 과정

### 3-1. 주사위 결과 기반 스킬 시스템

#### 구현 목표와 설계 배경

기획팀으로부터 전달받은 12종의 스킬은 피해량, 판정 범위, 사거리, 탄수 등 기본 속성을 공유하면서도, 실제 발동 형태와 주사위 눈금(1~6)에 따라 강화되는 스탯 항목이 각기 달랐습니다. 또한 Unity의 `ScriptableObject`를 런타임에 직접 수정하면 원본 에셋 데이터가 오염되는 문제가 있으므로, **원본 불변 데이터와 런타임 가변 데이터를 분리하는 구조**가 필수적이었습니다.

12종의 스킬 명세를 분석한 뒤 모든 공격 판정을 근접(`Hitbox`)과 원거리(`Projectile`) 두 가지 형태로 분류했습니다. 이에 **'데이터 관리 / 쿨타임 및 탄수 제어 / 주사위 재장전 / 피격 판정'은 공통 파이프라인으로 묶고**, 스킬별 고유한 생성 방식과 연출만 추상 메서드(`SkillDataSO.Use()`)로 분리하여 확장성을 확보했습니다.

- **스킬 실행 흐름**: `스킬 입력` → `SkillExecutor` → `현재 주사위 데이터 적용` → `개별 Skill Use()` → `SkillHitbox 또는 SkillProjectile` → `IDamageable 대상 피해 전달`

#### 내가 적용한 방법

- `SkillDataSO`에 피해량 / 판정 크기 / 투사체 속도 / 사거리 / 재장전 시간 등 기본 데이터 정의
- 주사위 1~6 결과에 따라 기본 데이터의 특정 항목을 변경하는 효과 구조(`SetEffect`) 작성
- 원본 `ScriptableObject`를 직접 변경하지 않고, 실행 시점에 `SkillData` 복사본 인스턴스를 생성해 현재 전투 데이터로 사용
- `SkillExecutor`에서 실행 가능 여부 / 사용 횟수 차감 / 주사위 굴림 / 재장전 / 데이터 갱신을 일괄 관리
- 근접 공격은 `SkillHitbox`, 원거리 공격은 `SkillProjectile`로 판정 / 피해 계산 / 이펙트 출력 과정 표준화
- `IDamageable`(`Damageable`) 인터페이스를 통해 개별 몬스터 클래스를 직접 참조하지 않고 피해 전달
- 추상화 기반 구조부터 12종의 개별 스킬까지 전부 직접 제작 (수치 데이터 설정과 이펙트 지정은 기획팀 담당)

#### 핵심 코드: 주사위 결과를 반영한 실행 데이터 생성

```csharp
// 주사위 숫자에 맞춰 새로운 스킬 데이터 객체 반환
public SkillData Get(int dice = 0)
{
    SkillData data = new()
    {
        SkillID = skillID,
        SkillName = skillName,
        Damage = damage,
        DamageRangeX = damageRangeX,
        DamageRangeY = damageRangeY,
        ProjectileSpeed = projectileSpeed,
        Range = range,
        Delay = delay,
        MaxUseCount = maxUseCount,
        Cooldown = cooldown
    };

    SetEffect(data, dice);
    return data;
}

public abstract void Use(SkillExecutor executor);
```

원본 `ScriptableObject`의 기본 데이터를 실행용 객체(`SkillData`)로 복사한 뒤 현재 주사위 눈금의 효과를 적용합니다. 개별 스킬은 이 런타임 데이터를 참조하면서 `Use()`만 각자의 공격 동작에 맞게 정의합니다.

#### 핵심 코드: 스킬 실행과 재장전

```csharp
public SkillExecuteResult TryExecute()
{
    // 스킬이 사용 가능한지 확인
    if (CurrentSkillData == null || SkillDataSO == null)
        return SkillExecuteResult.NotExist;
    if (LastExecutedTime + CurrentSkillData.Delay > Time.time || IsRolling)
        return SkillExecuteResult.OnCooldown;

    SkillDataSO.Use(this);
    CurrentAmmo--;
    LastExecutedTime = Time.time;

    // 재장전이 필요한 경우 진행
    if (CurrentAmmo == 0)
    {
        IsRolling = true;
        _pendingReloadDice = Roll();
        _reloadCooldown = CurrentSkillData.Cooldown;
        return SkillExecuteResult.Reload;
    }

    return SkillExecuteResult.Success;
}

public void Tick(float currentTime)
{
    if (!IsRolling || _pendingReloadDice < 0) return;
    if (currentTime < LastExecutedTime + _reloadCooldown) return;

    RefreshData(_pendingReloadDice);
    _pendingReloadDice = -1;
    IsRolling = false;
    ReloadFinished?.Invoke();
}
```

`SkillExecutor`가 모든 스킬의 발동 조건과 잔여 탄수를 관리합니다. 사용 횟수가 모두 소진되면 새로운 주사위 값을 미리 추첨해 두고, 재장전 대기 시간이 끝난 시점(`Tick`)에 해당 눈금의 데이터로 갱신한 뒤 완료 이벤트를 알립니다.

#### 구현 결과

- 원본 `ScriptableObject` 에셋 오염 없이 런타임 주사위 효과가 반영된 전투 데이터 운용
- 생성 직후 이미 겹쳐 있는 대상을 놓치지 않도록 첫 프레임 판정은 `Collider2D.Overlap`으로 즉시 검증하고, 이후 지속·이동 판정은 `Trigger2D` 이벤트로 처리하여 판정 누락 방지
- `IDamageable` 인터페이스를 통한 몬스터 구현체와의 결합도 분리
- **키워드**: `ScriptableObject` · `Inheritance` · `Physics2D` · `Coroutine`

---

### 3-2. SRP 기반 플레이어 FSM

#### 구현 목표와 설계 배경

플레이어 캐릭터는 대기, 이동, 대시, 공격, 피격, 사망의 6가지 상태를 가지며, 각 상태마다 '대시 중 무적 및 이동 제한', '피격 시 짧은 경직과 입력 차단', '공격 시 스킬 슬롯 버퍼링' 등 까다로운 예외 조건이 맞물려 있었습니다. 이를 단일 클래스의 조건문으로 처리하면 전이 조건이 뒤엉켜 디버깅과 유지보수가 급격히 어려워질 것으로 판단했습니다.

이를 방지하기 위해 **SOLID의 단일 책임 원칙(SRP)**을 적용하여, 각 상태가 자신의 진입(`Enter`), 갱신(`Update`), 종료(`Exit`) 및 허용된 입력 반응만 독립적으로 처리하는 FSM 구조를 설계했습니다. `PlayerFSM`은 전환 순서만 통제하고, 물리 이동이나 무적 코루틴 제어 등 구체적인 동작은 개별 `State` 클래스에 위임하여 책임을 명확히 나눴습니다.

- **입력 전달과 상태 실행 흐름**: `New Input System` → `PlayerInputHandler` → `PlayerFSM` → `현재 State` → (`PlayerController` / `PlayerSkillHandler`)

#### 플레이어 상태별 역할

| 상태 | 역할 |
| --- | --- |
| **Idle** | 이동이나 스킬 입력을 기다리는 기본 대기 상태 |
| **Move** | 이동 입력 방향으로 캐릭터 속도를 적용하고, 입력이 끝나면 정지하는 상태 |
| **Dash** | 입력을 잠시 제한하고 일정 거리를 빠르게 이동하며, 이동 중 무적을 적용하는 상태 |
| **Attack** | 입력된 스킬 슬롯의 스킬을 실행한 뒤 대기 또는 이동으로 복귀하는 상태 |
| **Hit** | 피격 이벤트, 짧은 경직, 입력 차단, 일시적인 무적을 처리하는 상태 |
| **Die** | 사망 이벤트를 실행하고 게임 오버 Scene으로 전환하는 상태 |

#### 내가 적용한 방법

- `PlayerInputHandler`에서 New Input System 입력을 이동 / 대시 / 좌우 스킬 이벤트로 변환
- `PlayerFSM`이 입력 이벤트를 현재 `State`에 전달하고 `Exit() → Enter()` 순서로 상태 전환 관리
- `BaseState`에 `Enter()` / `Update()` / `Exit()`와 입력 반응 가상 메서드를 정의해 공통 계약 구성
- `Idle` / `Move` / `Dash` / `Attack` / `Hit` / `Die`를 독립된 클래스로 분리
- `MoveState`는 이동과 정지, `DashState`는 이동 거리·쿨다운·무적·입력 제한, `AttackState`는 선택한 스킬 실행만 전담
- `HitState`에서 입력 차단·피격 무적·경직 시간을 제어하고, `DieState`에서 사망 연출과 게임 오버 전환 처리
- 내부에서 실행한 `Coroutine`은 상태 종료 시 함께 중단되도록 `BaseState`에서 일괄 관리

#### 핵심 코드: FSM의 입력 전달과 상태 전환

```csharp
// PlayerFSM.cs
private void BindInputCallbacks()
{
    _inputHandler.Moved              += OnMoved;
    _inputHandler.Dashed             += OnDash;
    _inputHandler.LeftSkillPerformed += OnLeftSkill;
    _inputHandler.RightSkillPerformed += OnRightSkill;
}

private void UnbindInputCallbacks()
{
    _inputHandler.Moved              -= OnMoved;
    _inputHandler.Dashed             -= OnDash;
    _inputHandler.LeftSkillPerformed -= OnLeftSkill;
    _inputHandler.RightSkillPerformed -= OnRightSkill;
}

private void OnMoved(Vector2 dir)
{
    MoveInput = dir;
    if (dir != Vector2.zero)
        FacingDir = dir.normalized;
}

private void OnDash()       => _currentState?.OnDashed();
private void OnLeftSkill()  => _currentState?.OnLeftSkill();
private void OnRightSkill() => _currentState?.OnRightSkill();

public void ChangeState(BaseState next)
{
    if (_currentState == next)
        return;

    _currentState?.Exit();
    _currentState = next;
    _currentState.Enter();
}

public void EnterAttack(SkillSlot skillSlot)
{
    BufferedSkillSlot = skillSlot;
    ChangeState(Attack);
}
```

FSM은 입력의 구체적인 처리 방법을 직접 결정하지 않고 현재 활성화된 `State`에 위임합니다. 상태가 바뀔 때는 기존 `State`를 종료(`Exit`)한 뒤 새로운 `State`를 시작(`Enter`)해 생명주기 순서를 일정하게 보장합니다.

#### 핵심 코드: 상태별 책임 분리

```csharp
public abstract class BaseState
{
    protected PlayerFSM FSM { get; }
    protected PlayerInputHandler Input { get; }

    protected BaseState(PlayerFSM fsm, PlayerInputHandler input)
    {
        FSM = fsm;
        Input = input;
    }

    public virtual void Enter() { }
    public virtual void Update() { }
    public virtual void Exit() { }

    public virtual void OnDashed() { }
    public virtual void OnLeftSkill() { }
    public virtual void OnRightSkill() { }

    public virtual void OnDied() => FSM.ChangeState(FSM.Die);
    public virtual void OnHit()  => FSM.ChangeState(FSM.Hit);
}

// 예시: 이동 상태
public class MoveState : BaseState
{
    private readonly Rigidbody2D _rb;

    public MoveState(
        PlayerFSM fsm,
        PlayerInputHandler input,
        Rigidbody2D rb) : base(fsm, input)
    {
        _rb = rb;
    }

    public override void Update()
    {
        if (FSM.MoveInput == Vector2.zero)
        {
            FSM.ChangeState(FSM.Idle);
            return;
        }

        _rb.linearVelocity =
            FSM.MoveInput.normalized * FSM.Controller.Data.MoveSpeed;
    }

    public override void Exit()
    {
        _rb.linearVelocity = Vector2.zero;
    }
}
```

`BaseState`는 모든 상태가 따르는 기본 진입점을 제공하고, 각 하위 클래스는 필요한 동작만 재정의합니다. 예를 들어 `MoveState`는 이동 속도 반영과 종료 시 잔여 속도 초기화만 담당합니다.

#### 구현 결과

- 입력 / 이동 / 공격 / 피격 / 사망 로직이 하나의 거대 클래스에 집중되는 현상 방지
- 대시나 피격처럼 조작 제한과 무적 타이밍이 맞물리는 구간의 시작·종료 시점을 안전하게 제어
- 새로운 동작이나 전이 조건을 추가할 때 다른 상태 코드에 미치는 영향 최소화
- 상태 종료 시 속도·코루틴·무적·입력 제한을 정리하는 뒷정리 과정 일원화
- **키워드**: `State Pattern` · `SRP` · `New Input System` · `C# Event` · `Coroutine`

---

### 3-3. Google Sheets 기반 데이터 반영 자동화

#### 구현 목표와 설계 배경

기획팀이 12종 스킬과 주사위 눈금별 수치, 레벨업 테이블을 밸런싱할 때마다 개발자가 Unity Inspector에서 다수의 `ScriptableObject`를 일일이 수작업으로 수정해야 하는 병목이 발생했습니다. 반복 작업을 줄이고 휴먼 에러(데이터 누락·오타)를 방지하기 위해 Google Sheets의 테이블을 읽어와 에셋을 일괄 갱신하는 Editor 전용 도구를 구축했습니다.

- **데이터 흐름**: `Google Sheets` → `CSV 다운로드 및 파싱` → `ScriptableObject 프로퍼티 갱신` → `Unity 에셋 직렬화 및 저장`

#### 내가 적용한 방법

- Google Sheets 데이터를 CSV 형식으로 가져와 필요한 행과 열을 파싱
- 스킬 ID 규칙(`s-{SkillId}`)을 기반으로 `Addressables`를 통해 대상 `ScriptableObject` 에셋을 비동기 탐색
- `SerializedObject`와 `EditorUtility.SetDirty()`, `AssetDatabase.SaveAssets()`를 연동하여 수정된 프로퍼티를 에셋에 안전하게 직렬화 및 저장
- 짧은 개발 기간(2주) 내에 인게임 런타임 기능에 집중하기 위해, 에디터 툴의 초기 코드는 AI를 활용해 빠르게 생성한 뒤 프로젝트의 데이터 스키마와 Addressables 키 구조에 맞게 파싱 로직을 직접 수정·검증하여 적용

#### 핵심 코드: 데이터 적용

```csharp
foreach (SkillRow row in data)
{
    string key = $"s-{row.SkillId}";
    var handle = Addressables.LoadAssetAsync<SkillDataSO>(key);
    SkillDataSO skill = await handle.Task;

    if (skill == null)
    {
        Addressables.Release(handle);
        continue;
    }

    SerializedObject serialized = new SerializedObject(skill);
    serialized.FindProperty("damage").intValue = row.SkillDamage;
    serialized.FindProperty("cooldown").intValue = row.SkillCoolTime;
    serialized.ApplyModifiedProperties();

    EditorUtility.SetDirty(skill);
    Addressables.Release(handle);
}

AssetDatabase.SaveAssets();
```

#### 구현 결과

- 밸런스 패치 때마다 반복되던 Inspector 수작업 제거 및 데이터 반영 시간 단축
- **키워드**: `EditorWindow` · `Addressables` · `SerializedObject` · `AssetDatabase`

---

### 3-4. 플레이어 성장 데이터 영속성 및 이벤트 기반 HUD

#### 구현 목표와 설계 배경

로그라이크 장르 특성상 방(Scene)을 이동할 때마다 플레이어의 성장 상태(레벨, 스탯, 장착 장비, 보유 스킬)가 초기화되지 않고 유지되어야 했습니다. 또한 전투 중 빈번하게 변하는 HP, 탄수, 주사위 눈금, 쿨다운 정보를 매 프레임 `Update`에서 검사(Polling)하지 않고 효율적으로 UI에 반영할 필요가 있었습니다.

#### 내가 적용한 방법

- **싱글톤 기반 데이터 영속성**: 플레이어 데이터를 전담 관리하는 매니저를 두어 Scene 전환 시에도 스탯, 스킬, 장비 정보를 보존하고, 새 Scene 로드 완료 시 플레이어 객체가 이를 복원하도록 구성
- **기본 스탯과 런타임 스탯 분리**: 캐릭터의 원본 기본 스탯과 레벨업·장비 장착으로 변동되는 보정값을 분리하여, 장비 교체 시 스탯이 중복 가산되거나 오차가 발생하지 않도록 재계산 로직 작성
- **이벤트 기반(Event-Driven) HUD 갱신**: 체력 변동, 경험치·골드 획득, 스킬 사용 및 주사위 재장전 시점에만 C# 이벤트를 발행하여 HUD가 갱신되도록 결합도 감소
- **화면 전환 연출 및 튜토리얼**: Shader Graph 기반의 화면 전환 애니메이션을 제작하고, 비동기 Scene 로드·BGM 페이드·컷신·단계별 조작 튜토리얼을 연결

---

## 4. 프로젝트 결과와 회고

### 최종 결과

기획팀이 작성한 기획서를 기준으로 2주 동안 담당 인게임 시스템을 모두 제작했고, 이후 1주 동안 GitHub Issue로 발견된 버그와 수정 사항을 추적하며 QA를 진행해 완주 가능한 빌드로 프로젝트를 마무리했습니다.

### 배운 점

기획팀과 개발자가 같은 문서를 보고도 세부 동작을 서로 다르게 이해할 수 있다는 점을 직접 체감했습니다. 개발 방식을 설명할 때 코드나 기술 용어를 그대로 사용하는 것보다, **게임 화면에서 어떤 동작으로 보이는지와 어떤 결과가 가능한지**를 기준으로 설명해야 의사소통이 정확해진다는 것을 배웠습니다. 처음에는 기술적인 제약을 쉽게 풀어 설명하는 과정이 낯설었지만, 이번 협업을 통해 상대 직군이 이해할 수 있는 언어로 바꾸어 조율하는 방법을 익혔습니다.

### 아쉬운 점과 개선 방향

#### 1. 변경되는 기획을 고려한 스킬 구조

처음 작성한 스킬 추상화 구조는 초기 기획서의 12종 스킬을 담아내기에 충분했습니다. 하지만 개발 도중 텍스트로 명확히 적혀 있지 않던 의도와 수정된 기획이 추가되면서 기존 공통 구조만으로 표현하기 까다로운 예외 동작이 생겼습니다. 구조 전체를 다시 뜯어고치기에는 일정상 부담이 커 기획팀과 적용 가능한 범위를 논의해 마무리했습니다.

다시 설계한다면 코드를 작성하기 전에 스킬별 예외 기믹과 변경 가능성을 기획팀과 더 구체적으로 확인하고, 공통 파이프라인에 포함할 부분과 개별 스킬 클래스에 맡길 부분의 경계를 한층 유연하게 나누고 싶습니다.

#### 2. Unity 프로젝트와 Git 저장소 설정

Unity 프로젝트가 Git 저장소 내부의 하위 폴더에 위치한 것 자체는 문제가 아니었지만, `.gitignore`의 경로 규칙이 실제 프로젝트 하위 폴더 위치와 맞지 않는 부분이 있었습니다. 그 결과 제외되어야 할 일부 임시 파일이 커밋되는 등 저장소를 관리할 때 불편을 겪었습니다.

다음 협업에서는 프로젝트 초기 세팅 단계에 저장소 Root 경로, Unity 프로젝트 폴더 위치, `.gitignore` 적용 범위를 직접 대조하고 불필요한 파일이 추적되지 않는지 먼저 테스트한 뒤 개발을 시작할 것입니다.
