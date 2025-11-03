# Feature Specification: 摩斯密碼解碼器

**Feature Branch**: `001-morse-decoder`  
**Created**: 2025-11-03  
**Status**: Draft  
**Input**: User description: "輸入摩斯密碼然後顯示內容"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - 使用單一按鈕輸入摩斯密碼 (Priority: P1)

用戶通過單一按鈕進行交互：快速點擊產生「點」，按住產生「線」，釋放按鈕分隔字符。系統實時顯示摩斯密碼序列和對應字符。

**Why this priority**: 簡單直觀的單按鈕界面是整個系統的核心。

**Independent Test**: 快速點擊一次按鈕、按住按鈕、快速點擊，釋放後系統顯示 "·— " 和 "A"。

**Acceptance Scenarios**:

1. **Given** 頁面已載入，**When** 用戶快速點擊按鈕一次、按住、快速點擊，**Then** 系統顯示摩斯序列 "·— " 和字符 "A"
2. **Given** 頁面已載入，**When** 用戶釋放按鈕，**Then** 系統立即分隔字符並清空摩斯序列顯示，準備輸入下一個
3. **Given** 用戶停頓超過 1 秒，**When** 釋放後再按，**Then** 系統自動在訊息中插入空格分隔單詞

---

### User Story 2 - 編譯完整訊息 (Priority: P2)

用戶通過連續快速點擊和按住產生點線組合，系統編譯成完整訊息。

**Why this priority**: 單個字符很有用，但用戶通常想輸入完整訊息。這大幅增加實用性。

**Independent Test**: 快速點擊、按住、快速點擊、釋放、快速點擊多次，系統顯示 "AB0"。

**Acceptance Scenarios**:

1. **Given** 用戶輸入多個字符（每次釋放分隔），**When** 完成，**Then** 系統顯示完整訊息
2. **Given** 用戶輸入包含數字的摩斯密碼，**When** 釋放，**Then** 顯示對應的數字

---

### User Story 3 - 編輯和清除 (Priority: P3)

用戶可以撤銷最後一個輸入、清除整個訊息或查看幫助提示。

**Why this priority**: 改善使用者體驗，讓用戶能輕鬆糾正輸入錯誤。

**Independent Test**: 有撤銷按鈕移除最後輸入；有清除按鈕清空整個訊息；有幫助提示說明按鈕用法。

**Acceptance Scenarios**:

1. **Given** 用戶已輸入部分摩斯密碼，**When** 點擊「撤銷」，**Then** 最後一個點或線被移除
2. **Given** 用戶已輸入訊息，**When** 點擊「清除」，**Then** 整個訊息被清空，系統準備新輸入
3. **Given** 頁面已載入，**When** 用戶看到頁面，**Then** 能看到按鈕使用說明（快速點擊＝點，按住＝線，釋放＝分隔）

### Edge Cases

- 用戶快速連續按「點」或「線」時系統如何反應？
- 用戶輸入無效的摩斯密碼序列（如 "······"）時，系統顯示「?」或「*」占位符
- 過長的輸入（超過 1000 個字符）如何處理？
- 用戶釋放按鈕後立即按下（< 100ms）的情況？
- 用戶停頓時間接近 1 秒邊界時（如 950ms vs 1050ms）如何判定？

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: 系統 MUST 提供單一按鈕讓用戶輸入摩斯密碼（快速點擊＝點，按住＝線，釋放＝分隔字符）
- **FR-002**: 系統 MUST 支援國際摩斯密碼標準（ITU 標準）
- **FR-003**: 系統 MUST 區分「點」（快速按 <500ms）和「線」（按住 ≥500ms）基於按鈕按下持續時間
- **FR-004**: 系統 MUST 實時同時顯示當前輸入的摩斯密碼序列和對應的文字字符（如 "·— " 顯示為 "A"）
- **FR-005**: 系統 MUST 在用戶釋放按鈕時立即將摩斯密碼轉換為對應字符
- **FR-006**: 系統 MUST 檢測用戶停頓超過 1 秒後，自動在訊息中插入空格分隔單詞
- **FR-007**: 系統 MUST 當摩斯密碼序列無法識別時，顯示「?」或「*」作為占位符，允許用戶繼續輸入
- **FR-008**: 系統 MUST 提供「撤銷」功能移除最後輸入的點或線
- **FR-009**: 系統 MUST 提供「清除」功能清空整個訊息
- **FR-010**: 系統 MUST 支援英文字母（A-Z）、數字（0-9）和基本標點符號
- **FR-011**: 系統 MUST 在頁面上清楚顯示按鈕使用方式（快速點擊＝點，按住＝線，釋放＝分隔）和摩斯密碼對照表

### Key Entities *(include if feature involves data)*

- **摩斯密碼字符對應表**: 將每個摩斯密碼序列對應到一個字符（字母、數字或標點）
- **輸入字符串**: 用戶輸入的摩斯密碼序列
- **輸出訊息**: 解碼後的文字訊息

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 用戶能在 5 秒內解碼一個 10 字符的摩斯密碼訊息
- **SC-002**: 系統正確解碼 100% 的標準摩斯密碼輸入
- **SC-003**: 用戶在第一次使用時能夠無困難地理解如何使用該工具（透過簡單的 UI 和格式提示）
- **SC-004**: 頁面在標準網路連接下加載時間不超過 2 秒

## Clarifications

### Session 2025-11-03

- Q: 輸入摩斯密碼的方式是什麼？ → A: 使用單一按鈕輸入，按住產生線，快速點擊產生點，釋放分隔字符
- Q: 頁面應如何顯示摩斯密碼解碼過程？ → A: 同時顯示摩斯密碼序列和文字結果（如 "·— —···" = "AB"）
- Q: 用戶應如何分隔單詞？ → A: 按鈕釋放後短暫停頓（1+ 秒）自動分隔單詞
- Q: 當輸入無法識別的摩斯密碼序列時，系統應如何反應？ → A: 顯示「?」或「*」作為未知字符占位符，允許用戶繼續輸入

## Assumptions

- 用戶熟悉摩斯密碼基礎知識（什麼是點和線）
- 摩斯密碼輸入使用標準國際摩斯密碼表
- 支援英文字母、0-9 數字和基本標點符號
- 系統通過按鈕按下的持續時間區分點（< 500ms）和線（>= 500ms），具體閾值可在計劃階段調整
- 釋放按鈕後立即分隔字符，用戶可連續按鈕輸入下一個字符
- 同時顯示摩斯密碼序列（如 "·— "）和對應文字字符（如 "A"）
- 用戶停頓超過 1 秒（上次按鈕釋放到下次按下）自動在訊息中插入空格分隔單詞
- 無法識別的摩斯密碼序列顯示為「?」或「*」占位符，不中斷輸入流程
