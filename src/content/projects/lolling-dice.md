---
title: 'Lolling Dice'
description: '플레이어의 입력·전투·스킬을 구현하고, 이벤트 기반 UI와 스킬 데이터 연동 도구를 제작했습니다.'
period: '2026.04'
team: '13인 팀 · 기획 8명 / 프로그래밍 5명'
role: '플레이어 입력·FSM·스킬·HUD·Scene 전환·튜토리얼'
stack: ['Unity', 'C#', 'New Input System', 'Addressables', 'Shader Graph']
order: 1
badge: '2주 개발 · 1주 QA'
links:
  - label: '게임 플레이'
    url: 'https://devel-rocket.itch.io/smart04-lolling-dicemaster'
  - label: '소개 영상'
    url: 'https://www.youtube.com/watch?v=4j5FVpfi5hc'
  - label: 'Notion 상세 기록'
    url: 'https://app.notion.com/p/3dd20568b61a80af909cf1983edbca57'
---

주사위 속 세계에 갇힌 외계인 비비가 탈출하는 **2D 탑뷰 로그라이크 액션 게임**입니다. 스킬의 사용 횟수를 모두 소진하면 주사위가 자동으로 굴러가고, 눈금에 따라 스킬의 추가 효과가 바뀝니다. 플레이어는 전투로 경험치와 골드를 얻고, 레벨업과 상점에서 성장하며 방을 돌파합니다.

디벨로켓 팀 프로젝트에서 기획자 8명, 프로그래머 5명이 함께 개발했습니다. 저는 플레이어 상태와 조작, 12종의 스킬, HUD, Scene 전환과 튜토리얼을 담당했습니다. 스킬 수치와 이펙트 지정은 기획팀이 맡았습니다.

## 주사위 결과를 반영하는 12종의 스킬

스킬들은 피해량·사거리·탄수 같은 공통 속성을 가지면서도, 발동 형태와 주사위 눈금별 강화 항목이 달랐습니다. 공통 제어와 개별 동작을 구분하고, 원본 에셋과 전투 중 바뀌는 데이터를 분리할 필요가 있었습니다.

`SkillDataSO`에 정적 데이터를 정의하고, 실행 시 `SkillData` 복사본에 현재 주사위 결과를 적용했습니다. 원본 `ScriptableObject`를 직접 수정하지 않아 런타임 변화가 에셋에 남지 않도록 했습니다. 개별 스킬은 추상 메서드 `Use()`를 구현하고, 실행 조건·탄수·주사위 굴림·재장전은 `SkillExecutor`가 공통으로 처리합니다.

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

재장전이 시작되면 다음 주사위 값을 미리 정하고, 재장전 시간이 지난 뒤 해당 눈금의 데이터로 갱신합니다. 근접 공격은 `SkillHitbox`, 원거리 공격은 `SkillProjectile`로 판정과 피해 전달 흐름을 공통화했습니다. 생성 직후 이미 겹쳐 있는 대상은 `Collider2D.Overlap`으로 검사하고, 이후 판정은 `Trigger2D` 이벤트로 처리했습니다. 피해는 인터페이스를 통해 전달해 개별 몬스터 클래스에 대한 직접 참조를 줄였습니다.

## 상태별 책임을 나눈 플레이어 FSM

플레이어는 대기·이동·대시·공격·피격·사망의 여섯 상태를 가집니다. 대시 중 무적, 피격 시 입력 차단, 공격할 스킬 슬롯의 보관처럼 상태마다 다른 조건이 있어 하나의 클래스에 조건문을 쌓으면 전환 흐름을 추적하기 어려웠습니다.

`PlayerInputHandler`가 New Input System의 입력을 이벤트로 바꾸고, `PlayerFSM`이 현재 상태에 전달하도록 구성했습니다. 각 상태는 `Enter()`·`Update()`·`Exit()`와 허용된 입력 반응을 담당합니다. FSM은 전환 순서를 관리하고, 이동이나 무적 같은 구체적인 동작은 상태 클래스에 두었습니다.

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

이동 상태는 종료 시 속도를 정리하고, 대시와 피격 상태는 입력 제한·무적·경직의 시작과 종료를 관리합니다. 상태에서 실행한 코루틴도 종료 시 함께 정리하도록 공통화해 이전 상태의 동작이 남지 않도록 했습니다.

## Scene을 넘어 유지되는 성장 데이터와 HUD

방을 이동해도 레벨·스탯·장비·스킬이 유지되도록 플레이어 데이터를 전담하는 매니저에 상태를 보존하고, 새 Scene의 플레이어가 복원하도록 구현했습니다. 기본 스탯과 장비·레벨업 보정값을 분리해 장비 교체 시 중복 가산 대신 재계산하도록 구성했습니다.

체력·경험치·골드·탄수·재장전 정보는 상태가 변할 때 C# 이벤트를 발행하고 HUD가 구독하도록 했습니다. UI가 매 프레임 모든 값을 확인하는 대신, 실제 변경 시점에 화면을 갱신합니다. Shader Graph 기반 화면 전환 애니메이션을 구현하고, 비동기 Scene 로드·BGM 페이드·컷신·단계형 이동 및 대시·스킬 튜토리얼을 연결했습니다.

## Google Sheets의 기획 데이터를 Unity 에셋으로

기획팀의 밸런스 수정 때마다 여러 `ScriptableObject`를 Inspector에서 수작업으로 바꾸는 반복 작업이 있었습니다. Google Sheets를 CSV로 읽어 스킬 ID에 대응하는 Addressables 에셋을 찾고, `SerializedObject`로 값을 적용한 뒤 저장하는 에디터 도구를 제작했습니다.

초기 코드는 AI로 생성한 뒤, 프로젝트의 데이터 스키마와 `s-{SkillId}` 키 규칙에 맞게 파싱과 에셋 적용 로직을 직접 수정·검증했습니다. `EditorUtility.SetDirty()`와 `AssetDatabase.SaveAssets()`를 연결해 변경값을 에셋에 반영하면서 기획 수정에 따른 수작업을 줄였습니다.

## 결과와 회고

2주 동안 담당 기능을 구현하고, 이후 1주간 GitHub Issue로 버그와 수정 이력을 관리하며 QA를 진행했습니다. 발견된 오류와 변경된 기획을 반영해 플레이 가능한 빌드로 마무리했습니다.

협업에서는 기술 용어보다 **게임에서 어떤 동작으로 보이고 어떤 결과가 가능한지**를 기준으로 설명하는 편이 기획 의도를 맞추는 데 효과적임을 배웠습니다. 초기 12종 명세에 맞춘 스킬 구조는 일부 추가 동작을 표현하기 어려웠고, 일정 안에서 기획팀과 구현 범위를 조율했습니다. 다음에는 예외 동작과 변경 가능성을 먼저 확인해 공통 구조와 개별 구현의 경계를 정하려고 합니다.

저장소의 `.gitignore`와 실제 Unity 프로젝트 경로가 맞지 않아 불필요한 파일이 추적되는 문제도 경험했습니다. 이후 프로젝트에서는 협업 전에 저장소 루트·프로젝트 위치·무시 규칙의 적용 범위를 직접 확인하려고 합니다.
