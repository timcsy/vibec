# Tasks: 摩斯密碼解碼器

**Input**: Design documents from `/specs/001-morse-decoder/`  
**Prerequisites**: plan.md ✓, spec.md ✓

**組織方式**: 按用戶故事分組，支援獨立實現和測試

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行執行（不同檔案、無依賴）
- **[Story]**: 用戶故事標籤 (US1, US2, US3)
- 包含確切檔案路徑

## Path Conventions

```
src/
├── index.html
├── styles/main.css
├── scripts/
│   ├── main.js
│   ├── morse-codec.js
│   ├── button-handler.js
│   ├── ui.js
│   └── constants.js
tests/
├── unit/
└── integration/
```

---

## Phase 1: Setup (共用基礎設施)

**目的**: 專案初始化和基本結構

- [ ] T001 根據計劃建立專案目錄結構 (src/, tests/, .github/)
- [ ] T002 初始化 package.json 和 Vite 配置 (vite.config.js)
- [ ] T003 [P] 配置開發伺服器和建構流程 (npm scripts)
- [ ] T004 [P] 建立 GitHub Actions 工作流程用於部署 (.github/workflows/deploy.yml)
- [ ] T005 建立 .gitignore 和專案基本檔案 (README.md, LICENSE)

**檢查點**: 專案結構完成，可執行 `npm run dev`

---

## Phase 2: 基礎設施 (阻斷先決條件)

**目的**: 所有用戶故事都依賴的核心模組

**⚠️ 關鍵**: 此階段完成後，用戶故事實現可平行進行

- [ ] T006 實現摩斯密碼對應表常數 (src/scripts/constants.js - 26 字母 + 10 數字 + 標點)
- [ ] T007 [P] 建立 HTML 基本結構和無障礙標籤 (src/index.html - 按鈕、顯示區、幫助)
- [ ] T008 [P] 建立基礎樣式 (src/styles/main.css - 布局、色彩對比 WCAG AA)
- [ ] T009 實現摩斯密碼編解碼核心函數 (src/scripts/morse-codec.js)
  - 函數: `morseToCharacter(sequence)` - 將 "·—" 轉換為 "A"
  - 函數: `characterToMorse(char)` - 將 "A" 轉換為 "·—"
  - 函數: `isValidMorse(sequence)` - 驗證摩斯序列是否有效
- [ ] T010 [P] 設定 UI 狀態管理 (src/scripts/main.js - currentSequence, outputMessage, history)

**檢查點**: 基礎設施完成，morse-codec 可獨立測試

---

## Phase 3: User Story 1 - 使用單一按鈕輸入摩斯密碼 (Priority: P1) 🎯 MVP

**目標**: 用戶透過單一按鈕（快速點擊＝點，按住＝線，釋放＝分隔）輸入並看到實時摩斯序列和文字結果

**獨立測試**: 
1. 按鈕快速點擊、按住、快速點擊，釋放後頁面同時顯示 "·— " 和 "A"
2. 連續輸入產生多個字符，每個釋放後分隔並顯示對應字符

### User Story 1 的單元測試 ⚠️

- [ ] T011 [P] [US1] 單元測試: morse-codec 正確編解碼 (tests/unit/morse-codec.test.js)
  - 測試: `morseToCharacter("·—")` → `"A"`
  - 測試: `characterToMorse("A")` → `"·—"`
  - 測試: 所有 26 字母正確對應
  - 測試: 所有 10 數字正確對應
  - 測試: 無效序列返回 null

### User Story 1 的實現

- [ ] T012 [US1] 實現按鈕事件處理器 (src/scripts/button-handler.js)
  - 偵測按鈕按下時間
  - <500ms 記錄為「點」(·)
  - ≥500ms 記錄為「線」(—)
  - 釋放按鈕觸發字符分隔
  - 維護按下時的時間戳用於停頓檢測

- [ ] T013 [US1] 實現 UI 更新模組 (src/scripts/ui.js)
  - 函數: `updateMorseDisplay(sequence)` - 更新摩斯序列顯示區
  - 函數: `updateCharacterDisplay(character)` - 更新文字結果顯示區
  - 函數: `displayError(message)` - 顯示無效序列錯誤（占位符「?」或「*」）

- [ ] T014 [US1] 連接按鈕事件到摩斯編解碼 (src/scripts/main.js)
  - 按鈕點擊時: 呼叫 `recordDotOrDash()`
  - 按鈕釋放時: 呼叫 `finalizeCharacter()`
  - 更新 UI 顯示

- [ ] T015 [P] [US1] 實現動態按鈕提示文本 (src/scripts/ui.js 擴展)
  - 按鈕上方顯示「快速點擊 = 點 (·) | 按住 = 線 (—) | 釋放 = 分隔」

- [ ] T016 [US1] 集成測試: 摩斯密碼輸入流程 (tests/integration/user-story-1.test.js)
  - 模擬按鈕快速點擊
  - 模擬按鈕按住
  - 驗證 UI 實時更新
  - 驗證正確的字符轉換

**檢查點**: User Story 1 完成 - 單按鈕摩斯輸入可用，實時顯示序列和文字

---

## Phase 4: User Story 2 - 編譯完整訊息 (Priority: P2)

**目標**: 支援輸入多個字符組成完整訊息，自動分隔單詞（停頓 >1 秒）

**獨立測試**: 
1. 連續輸入 3 個字符，訊息顯示 "ABC"
2. 輸入字符後停頓 1.5 秒，下一個字符前自動插入空格

### User Story 2 的單元測試 ⚠️

- [ ] T017 [P] [US2] 單元測試: 停頓檢測邏輯 (tests/unit/pause-detection.test.js)
  - 測試: <1 秒停頓不分隔單詞
  - 測試: ≥1 秒停頓自動分隔單詞
  - 測試: 時間戳精確性

### User Story 2 的實現

- [ ] T018 [US2] 擴展按鈕處理器支援停頓檢測 (src/scripts/button-handler.js 擴展)
  - 記錄上次按鈕釋放的時間戳
  - 計算下次按下時的停頓時間
  - 若停頓 >1 秒，觸發單詞分隔

- [ ] T019 [US2] 擴展 UI 更新支援單詞分隔 (src/scripts/ui.js 擴展)
  - 函數: `addSpaceToMessage()` - 在訊息中插入空格
  - 在訊息顯示區顯示更新

- [ ] T020 [P] [US2] 實現訊息歷史管理 (src/scripts/main.js 擴展)
  - 維護字符序列陣列
  - 支援單詞分隔時插入空格標記

- [ ] T021 [US2] 集成測試: 多字符訊息輸入 (tests/integration/user-story-2.test.js)
  - 模擬連續輸入 5+ 個字符
  - 驗證訊息正確顯示
  - 模擬停頓檢測自動分隔

**檢查點**: User Story 2 完成 - 完整訊息和自動單詞分隔工作

---

## Phase 5: User Story 3 - 編輯和清除 (Priority: P3)

**目標**: 支援撤銷、清除和幫助提示功能

**獨立測試**: 
1. 按撤銷按鈕，最後輸入的點或線被移除
2. 按清除按鈕，整個訊息清空
3. 幫助提示可見且清楚說明按鈕用法

### User Story 3 的實現

- [ ] T022 [P] [US3] 實現撤銷功能 (src/scripts/main.js 擴展)
  - 函數: `undoLastInput()` - 從歷史記錄移除最後一個點或線
  - 更新摩斯序列和訊息顯示

- [ ] T023 [P] [US3] 實現清除功能 (src/scripts/main.js 擴展)
  - 函數: `clearAll()` - 清空所有狀態
  - 重設 currentSequence, outputMessage, history

- [ ] T024 [US3] 新增撤銷和清除按鈕 (src/index.html 擴展)
  - 在 HTML 中新增「撤銷」和「清除」按鈕
  - 設置無障礙標籤（aria-label）

- [ ] T025 [P] [US3] 實現按鈕樣式和互動 (src/styles/main.css 擴展)
  - 撤銷/清除按鈕樣式
  - 懸停和焦點狀態

- [ ] T026 [US3] 新增幫助提示區塊 (src/index.html 擴展 + src/styles/main.css 擴展)
  - 顯示按鈕用法說明
  - 顯示摩斯密碼對照表 (A-Z 範例)

- [ ] T027 [P] [US3] 集成撤銷和清除到 UI (src/scripts/ui.js 擴展)
  - 撤銷/清除按鈕點擊事件處理

- [ ] T028 [US3] 集成測試: 編輯操作 (tests/integration/user-story-3.test.js)
  - 模擬撤銷多次操作
  - 模擬清除
  - 驗證訊息狀態正確

**檢查點**: User Story 3 完成 - 撤銷、清除、幫助提示功能工作

---

## Phase 6: 無障礙性和最佳化

**目的**: WCAG 2.1 AA 無障礙標準和效能最佳化

- [ ] T029 [P] 無障礙性稽核和修正 (src/)
  - 驗證所有互動元素可鍵盤導航
  - 確認色彩對比度 ≥ 4.5:1
  - 新增螢幕閱讀器支援 (aria-live, role)
  - 測試工具: Axe DevTools

- [ ] T030 [P] 效能最佳化 (src/scripts/)
  - 最小化 CSS 和 JavaScript
  - 測試初始載入時間 <2 秒
  - Lighthouse 審計 ≥90 分

- [ ] T031 CSS 和 JavaScript 最小化 (透過 Vite)
  - 確認生產建構自動最小化

**檢查點**: 無障礙性和效能標準達成

---

## Phase 7: 測試完整化和部署

**目的**: 最終測試和 GitHub Pages 部署

- [ ] T032 [P] 功能測試覆蓋: 所有用戶故事場景
  - 執行所有集成測試
  - 手動測試完整工作流程

- [ ] T033 跨瀏覽器測試
  - Chrome/Edge/Firefox
  - 行動裝置瀏覽器

- [ ] T034 [P] 建立部署工作流程測試 (.github/workflows/deploy.yml)
  - 推送到 main 時自動建構和部署
  - 驗證 GitHub Pages 上線

- [ ] T035 最終 README 更新 (README.md)
  - 使用說明
  - 開發指南
  - 部署說明

**檢查點**: 所有測試通過，部署工作流程驗證

---

## Phase 8: 品質檢查和交付

**目的**: 最終驗證規格完成度

- [ ] T036 驗證所有成功標準達成
  - SC-001: 5 秒內解碼 10 字符 ✓
  - SC-002: 100% 正確解碼率 ✓
  - SC-003: 新用戶無困難使用 ✓
  - SC-004: 頁面加載 <2 秒 ✓

- [ ] T037 更新規格清單 (specs/001-morse-decoder/checklists/requirements.md)
  - 標記所有項目為完成

- [ ] T038 生成 release notes 和文件

**檢查點**: 專案交付完成 ✓

---

## 依賴圖和並行執行機會

### 依賴順序

```
Phase 1 (Setup)
    ↓
Phase 2 (基礎設施)
    ↓
Phase 3, 4, 5 (用戶故事 - 可部分平行)
    ├─ US1 (T012-T016) 
    ├─ US2 (T017-T021) - 可在 US1 完成後開始
    └─ US3 (T022-T028) - 可在 US1 完成後開始
    ↓
Phase 6 (無障礙性/效能)
    ↓
Phase 7-8 (測試和部署)
```

### 平行執行例子

**第一天** (Setup + 基礎設施):
- 一人: T001-T005
- 另一人: T006-T010

**第二天** (User Story 1):
- 一人: T012 (按鈕處理)
- 另一人: T013-T014 (UI 更新和連接)

**第三天** (User Story 2-3):
- 一人: T017-T020 (停頓檢測)
- 另一人: T022-T028 (撤銷/清除)

---

## 實現策略

**MVP 範圍** (第一個可交付版本):
- Phase 1-3 完成 ✓
- User Story 1 完全功能
- 基本無障礙性支援

**增量交付**:
1. **MVP Release**: US1 完成
2. **V1.1**: + US2 (多字符、單詞分隔)
3. **V1.2**: + US3 (撤銷/清除)
4. **V1.3**: + 無障礙性和最佳化

**總任務數**: 38 項
**平行度**: ~40% 可平行執行
**估計週期**: 3-5 天 (單人) 或 1-2 天 (雙人)

---

## 檢查清單

執行前確認:
- [ ] 已查看 src/ 目錄結構
- [ ] 已安裝 Node.js 和 npm
- [ ] 已執行 `npm install` 初始化 Vite
- [ ] 已可執行 `npm run dev` 啟動開發伺服器

開發時:
- [ ] 每完成一個任務，執行相應測試驗證
- [ ] 每完成一個用戶故事，進行集成測試
- [ ] 定期檢查 Lighthouse 分數

交付前:
- [ ] 所有測試通過
- [ ] Lighthouse ≥90 分
- [ ] 無障礙性稽核通過 (Axe 0 重大違規)
- [ ] GitHub Pages 部署成功
