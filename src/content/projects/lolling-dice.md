---
title: 'Lolling Dice'
description: '주사위 눈금에 따라 달라지는 12종의 스킬과 플레이어 조작, 이벤트 기반 HUD, 기획 데이터 연동 도구를 제작했습니다.'
period: '2026.04'
team: '13인 팀 · 기획 8명 / 프로그래밍 5명'
role: '플레이어 입력·FSM·스킬·HUD·Scene 전환·튜토리얼'
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
  - label: 'GitHub 저장소'
    url: 'https://github.com/Kyungil-smart/08-firstcollabproject-Nahyunsusu'
  - label: '게임 플레이'
    url: 'https://devel-rocket.itch.io/smart04-lolling-dicemaster'
  - label: '소개 영상'
    url: 'https://www.youtube.com/watch?v=4j5FVpfi5hc'
  - label: 'Notion 상세 기록'
    url: 'https://app.notion.com/p/3dd20568b61a80af909cf1983edbca57'
---

주사위 속 세계에 갇힌 외계인 비비가 탈출하는 **2D 탑뷰 로그라이크 액션 게임**입니다. 탄약을 모두 소진하면 주사위가 자동으로 굴러가고, 나온 눈금에 따라 다음 공격의 부가 효과가 달라집니다. 플레이어는 전투로 경험치와 골드를 모아 레벨업과 상점 구매를 거치며 방을 돌파합니다.

디벨로켓 팀 프로젝트에서 기획자 8명, 프로그래머 5명이 함께 개발했습니다. 저는 캐릭터 조작과 상태 머신(FSM), 12종의 스킬, HUD, Scene 전환 연출과 튜토리얼을 맡았으며, 밸런스 수치와 이펙트 지정은 기획팀이 담당했습니다.

## 주사위 눈금을 반영하는 12종의 스킬

각 스킬은 피해량·사거리·탄수 같은 기본 속성을 공유하면서도, 발동 형태와 눈금별 강화 방식이 서로 달랐습니다. 따라서 발사 가능 여부를 제어하는 부분과 실제 공격 동작을 나누고, 원본 에셋과 전투 중 실시간으로 변하는 수치를 분리해야 했습니다.

`SkillDataSO`에는 기획 원본 데이터를 두고, 전투 중에는 복사본인 `SkillData`에 주사위 결과를 덮어쓰도록 설계했습니다. 원본 `ScriptableObject`를 직접 건드리지 않으므로 런타임 변화가 에셋에 남지 않습니다. 개별 공격 동작은 추상 메서드 `Use()`로 위임하고, 쿨타임·탄약 차감·주사위 굴림·재장전 판정은 `SkillExecutor`에서 일괄 관리합니다.

```csharp
public SkillExecuteResult TryExecute()
{
    if (CurrentSkillData == null || SkillDataSO == null)
        return SkillExecuteResult.NotExist;
    if (LastExecutedTime + CurrentSkillData.Delay > Time.time || IsRolling)
        return SkillExecuteResult.OnCooldown;

    SkillDataSO.Use(this);
    CurrentAmmo--;
    LastExecutedTime = Time.time;

    if (CurrentAmmo == 0)
    {
        IsRolling = true;
        _pendingReloadDice = Roll();
        _reloadCooldown = CurrentSkillData.Cooldown;
        return SkillExecuteResult.Reload;
    }

    return SkillExecuteResult.Success;
}
```

탄약을 모두 쓰면 다음 눈금을 미리 추첨해 두고, 재장전 시간이 끝나는 시점에 해당 눈금의 수치로 갱신합니다. 타격 판정은 근접용 `SkillHitbox`와 투사체용 `SkillProjectile` 두 가지로 나누어 처리했습니다. 생성 직후 이미 겹쳐 있는 적은 `Collider2D.Overlap`으로 먼저 잡아내고, 이후 충돌은 `Trigger2D` 이벤트로 감지합니다. 피해량은 인터페이스를 거쳐 전달해 특정 몬스터 클래스에 직접 의존하지 않게 했습니다.

## 역할과 책임을 분리한 플레이어 FSM

캐릭터는 대기·이동·대시·공격·피격·사망의 여섯 가지 동작 단계를 가집니다. 대시 중 무적 판정, 피격 시 조작 차단, 사용 중인 스킬 슬롯 기억처럼 단계마다 제약 조건이 달라, 단일 클래스에 분기문을 쌓으면 전이 과정을 추적하기 어려웠습니다.

이를 해결하기 위해 `PlayerInputHandler`가 New Input System의 입력을 이벤트로 변환하면, `PlayerFSM`이 현재 활성화된 클래스로 입력을 넘기도록 구조를 잡았습니다. 각 클래스는 `Enter()`·`Update()`·`Exit()` 생명주기와 해당 단계에서 허용된 입력만 처리합니다. FSM은 전이 순서만 통제하고, 실제 이동이나 무적 처리 같은 세부 로직은 개별 클래스 내부에 캡슐화했습니다.

```csharp
public void ChangeState(BaseState next)
{
    if (_currentState == next)
        return;

    _currentState?.Exit();
    _currentState = next;
    _currentState.Enter();
}
```

이동이 끝날 때는 잔여 속도를 초기화하고, 대시나 피격을 빠져나올 때는 조작 제한·무적·경직 효과를 해제합니다. 실행 중이던 코루틴도 종료 시점에 일괄 중단시켜 이전 단계의 잔여 동작이 뒤늦게 실행되는 문제를 막았습니다.

## Scene을 넘어 유지되는 성장 데이터와 HUD

방을 옮겨도 레벨·스탯·장비·보유 스킬이 이어지도록 전용 데이터 매니저에 성장 정보를 보관하고, 새 Scene에 진입하면 캐릭터가 이를 읽어오게 만들었습니다. 기본 능력치와 장비·레벨업 보정치는 별도로 저장해, 장비를 교체할 때 값이 중복으로 더해지지 않고 매번 정확히 재계산됩니다.

체력·경험치·골드·탄수·재장전 진행도는 값이 바뀔 때만 C# 이벤트를 발행해 HUD가 반응하게 했습니다. 매 프레임 UI가 데이터를 감시하는 대신 변화가 생긴 시점에만 화면을 다시 그립니다. 이 밖에 Shader Graph를 활용한 화면 전환 연출을 제작하고, 비동기 Scene 로드·배경음 페이드·컷신·단계별 조작 튜토리얼을 자연스럽게 이어 붙였습니다.

## Google Sheets의 기획 데이터를 Unity 에셋으로

기획팀이 밸런스를 조정할 때마다 여러 `ScriptableObject` 수치를 Inspector에서 일일이 고치는 번거로움이 있었습니다. 이를 줄이기 위해 Google Sheets의 CSV 데이터를 읽어 스킬 ID에 맞는 Addressables 에셋을 찾고, `SerializedObject`로 필드를 갱신한 뒤 저장하는 에디터 전용 도구를 제작했습니다.

초안 코드는 AI로 빠르게 작성한 뒤, 프로젝트의 데이터 스키마와 `s-{SkillId}` 키 규칙에 맞춰 파싱 및 에셋 반영 로직을 직접 다듬고 검증했습니다. `EditorUtility.SetDirty()`와 `AssetDatabase.SaveAssets()`까지 자동화해 반복적인 수작업 시간을 크게 덜었습니다.

## 결과와 회고

2주간 담당 기능을 개발하고, 이어진 1주 동안 GitHub Issue로 버그와 수정 이력을 관리하며 QA를 진행했습니다. 확인된 오류와 막바지 기획 변경 사항까지 반영해 무사히 플레이 가능한 빌드를 완성했습니다.

이번 협업에서는 기술 용어보다 **화면에서 어떤 동작으로 보이고 어떤 결과가 나는지**를 중심으로 대화할 때 기획 의도를 훨씬 정확히 맞출 수 있음을 배웠습니다. 다만 초기 12종 명세에 맞춘 구조만으로는 후반에 추가된 예외적인 스킬 기믹을 담기 까다로워 일정 안에서 기획팀과 범위를 조율해야 했습니다. 다음에는 기획 단계에서 예외 규칙과 확장 가능성을 먼저 확인한 뒤 기반 인터페이스의 경계를 잡을 계획입니다.

또한 저장소의 `.gitignore` 위치와 실제 Unity 프로젝트 폴더 경로가 어긋나 불필요한 임시 파일이 추적되는 시행착오도 겪었습니다. 이후 팀 작업을 시작할 때는 초기 세팅 단계에서 저장소 루트와 무시 규칙이 정상 작동하는지부터 점검하고 있습니다.
