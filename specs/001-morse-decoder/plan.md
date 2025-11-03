# Implementation Plan: 摩斯密碼解碼器

**Branch**: `001-morse-decoder` | **Date**: 2025-11-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-morse-decoder/spec.md`

## Summary

前端靜態網站摩斯密碼解碼器。用戶通過單一按鈕（快速點擊＝點，按住＝線，釋放＝分隔）輸入摩斯密碼，系統實時顯示摩斯序列和對應文字。支援自動單詞分隔（停頓 >1秒）和無效序列占位符處理。技術方案：純前端靜態網站（HTML5/CSS3/Vanilla JS），使用 Vite 建構，可部署至 GitHub Pages。

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+)  
**Primary Dependencies**: Vite (建構工具), 無伺服器端依賴  
**Storage**: 無（純前端，無狀態）  
**Testing**: Vitest 或 Jest（單元和集成測試）  
**Target Platform**: 靜態網站 - GitHub Pages  
**Project Type**: 前端靜態單頁應用 (SPA)  
**Performance Goals**: 初始載入 <2 秒，按鈕響應 <100ms  
**Constraints**: 無伺服器端依賴，相容 GitHub Pages，WCAG 2.1 AA 無障礙標準  
**Scale/Scope**: 單機應用，支援摩斯密碼完整字符集

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

根據 Vibec 專案憲法檢查：

✅ **I. 前端靜態網站優先** - 符合。純靜態網站架構。
✅ **II. GitHub Pages 相容性** - 符合。使用相對路徑，無伺服器功能依賴。
✅ **III. 無伺服器架構** - 符合。完全前端實現，無後端運行時。
✅ **IV. 無障礙性和包容設計** - 規格已要求 WCAG 2.1 AA 標準。
✅ **V. 不要過度設計** - 符合。MVP 功能集中，無複雜架構。
✅ **VI. 工具謹慎使用** - 符合。Vite 建構工具配置明確，原始檔案備份。

**門檐通過**：無違規項目。

## Project Structure

### Documentation (this feature)

```text
specs/001-morse-decoder/
├── plan.md                  # 實現計劃 (本檔案)
├── spec.md                  # 功能規格書
├── research.md              # 技術研究 (需求分析階段)
├── data-model.md            # 資料模型設計
├── quickstart.md            # 快速開始指南
├── contracts/               # API/介面契約
│   └── morse-codec.json     # 摩斯密碼編解碼契約
└── checklists/
    └── requirements.md      # 品質檢查清單
```

### Source Code (repository root)

```text
src/
├── index.html               # 主頁面
├── styles/
│   └── main.css            # 樣式 (含無障礙設計)
├── scripts/
│   ├── main.js             # 應用程式入點
│   ├── morse-codec.js      # 摩斯密碼編解碼核心
│   ├── button-handler.js   # 按鈕事件處理
│   ├── ui.js               # UI 更新邏輯
│   └── constants.js        # 摩斯密碼對應表
└── assets/
    └── favicon.ico         # 網站圖示

tests/
├── unit/
│   ├── morse-codec.test.js
│   ├── button-handler.test.js
│   └── ui.test.js
└── integration/
    └── end-to-end.test.js

.github/
├── workflows/
│   └── deploy.yml          # GitHub Pages 自動部署

vite.config.js              # Vite 建構配置
package.json
```

**Structure Decision**: 採用前端靜態單頁應用結構。由於無伺服器端，採用 Option 1 簡化配置。Vite 用於開發和建構。

## Complexity Tracking

> **無複雜性違規**。所有設計決策符合憲法要求，無需正當化。

## Phase 0: Research & Clarifications

**目標**: 解決所有技術不確定性，生成 research.md

**已完成的澄清**:
- ✅ 輸入方法：單一按鈕（快速點擊/按住/釋放）
- ✅ 顯示方式：同時顯示摩斯序列和文字結果
- ✅ 單詞分隔：自動停頓 >1 秒分隔
- ✅ 無效序列：顯示「?」或「*」占位符

**待研究項目**:
1. 點（<500ms）vs 線（≥500ms）的最佳時間閾值
2. 停頓檢測的確切計時邏輯（1 秒邊界精度）
3. 摩斯密碼對應表的完整字符集定義
4. Vite 開發環境配置最佳實踐
5. 無障礙性實現細節（ARIA 標籤、鍵盤導航）

**交付物**: `research.md`

## Phase 1: Design & Data Model

**目標**: 定義資料結構、UI 設計、介面契約

### 1.1 資料模型

**摩斯密碼對應表**:
```
{
  "morse": "·",      // 點符號
  "character": "E",  // 英文字母
  "type": "letter"   // 類型：letter/digit/punctuation
}
```

**應用狀態**:
```
{
  currentSequence: "·—",     // 當前摩斯序列
  outputMessage: "AB",        // 已解碼的文字
  lastReleaseTime: 1699010000,// 上次按鈕釋放時間戳
  history: ["·", "—", "·—"]   // 輸入歷史（用於撤銷）
}
```

### 1.2 UI 設計

**頁面布局**:
- 主要按鈕（大、易按）
- 摩斯序列顯示區（實時更新）
- 文字結果顯示區
- 撤銷/清除按鈕
- 幫助提示
- 摩斯密碼對照表參考

**無障礙性**:
- 語義化 HTML（<button>, <output>）
- ARIA 標籤和提示
- 鍵盤快捷鍵支援（可選：空格鍵控制按鈕）
- 色彩對比度 ≥ 4.5:1

### 1.3 API 契約

檔案: `contracts/morse-codec.json`

```json
{
  "encoding": {
    "input": "character",
    "output": "morse_sequence",
    "example": "A" → "·—"
  },
  "decoding": {
    "input": "morse_sequence",
    "output": "character",
    "example": "·—" → "A"
  },
  "validation": {
    "invalid_sequence": "?",
    "empty_input": ""
  }
}
```

**交付物**: `data-model.md`, `contracts/morse-codec.json`, `quickstart.md`

## Phase 2: Implementation Tasks

**目標**: 分解成具體開發任務

**優先級順序 (按規格 P1/P2/P3)**:

### P1 - 核心功能
- [ ] 實現摩斯密碼編解碼核心 (morse-codec.js)
- [ ] 實現按鈕事件處理（點/線/分隔檢測）
- [ ] 實現實時 UI 更新（摩斯序列 + 文字結果）
- [ ] 配置 Vite 開發環境

### P2 - 完整訊息處理
- [ ] 實現自動單詞分隔（>1秒停頓檢測）
- [ ] 實現無效序列占位符顯示
- [ ] 撤銷功能
- [ ] 清除功能

### P3 - 改善和部署
- [ ] 幫助提示和按鈕說明
- [ ] 摩斯密碼對照表參考
- [ ] 無障礙性檢查和改善
- [ ] 單元測試和集成測試
- [ ] GitHub Pages 自動部署配置

**交付物**: `tasks.md` (由 `/speckit.tasks` 生成)

## Success Metrics

基於規格的成功標準：

- **SC-001**: 用戶能在 5 秒內解碼 10 字符訊息 ← 測試：摩斯輸入 + 測時
- **SC-002**: 100% 正確解碼率 ← 測試：所有標準摩斯序列對應
- **SC-003**: 新用戶無困難使用 ← 測試：用戶測試 + UI 友善度評估
- **SC-004**: 頁面加載 <2 秒 ← 測試：Lighthouse 效能審計

## Next Steps

1. **Phase 0 執行**: 生成 research.md（解決待研究項目）
2. **Phase 1 執行**: 生成 data-model.md 和 contracts/
3. **Phase 2 執行**: 執行 `/speckit.tasks` 生成詳細任務清單
4. **實現**: 按優先級開始開發

**計劃準備完成**。建議下一步執行 `/speckit.tasks` 生成任務細節。
