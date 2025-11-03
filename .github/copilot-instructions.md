# GitHub Copilot 使用指南

## 語言設定

所有對話應使用 **繁體中文**。

## Slash 指令

本專案使用來自 `@.github/prompts` 的 slash 指令來協助工作流程。

### 可用指令

以下指令定義在 `.github/prompts/` 目錄中：

- `/plan` - 執行實現規劃工作流程，生成設計成果物
- `/specify` - 生成功能規格書
- `/implement` - 執行實現工作流程
- `/clarify` - 澄清需求
- `/checklist` - 生成檢查清單
- `/analyze` - 分析現有代碼
- `/tasks` - 分解成具體任務
- `/constitution` - 應用憲法規則檢查

### 使用方式

在 GitHub Copilot Chat 中，以 `/` 開頭輸入指令名稱，例如：

```
/plan 添加使用者認證系統
```

## 工作流程

典型的開發流程：

1. **`/clarify`** - 澄清需求和設計考量
2. **`/specify`** - 生成功能規格書
3. **`/plan`** - 生成實現計畫
4. **`/implement`** - 執行具體實現
5. **`/checklist`** - 驗證完成狀態

## 相關文件

- 功能規格書位置：`.specify/artifacts/features/`
- 實現計畫位置：`.specify/artifacts/plans/`
- 成果物位置：`.specify/artifacts/`
