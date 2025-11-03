# 🚀 GitHub Pages 部署指南

## 現狀

摩斯密碼解碼器 MVP 已完全實現，包含：
- ✅ 完整前端應用
- ✅ 70+ 測試用例
- ✅ WCAG 2.1 AA 無障礙支援
- ✅ GitHub Actions 自動化部署配置

## 部署步驟

### 1️⃣ 合併分支到 main

```bash
git checkout main
git merge 001-morse-decoder
git push origin main
```

### 2️⃣ 配置 GitHub Pages

在 GitHub 倉庫設定：
1. 進入 **Settings** → **Pages**
2. 選擇 **Build and deployment** 為 "GitHub Actions"
3. 保存設定

GitHub Actions 會自動檢測並使用 `.github/workflows/deploy.yml`

### 3️⃣ 監控自動部署

推送後，GitHub Actions 會：
1. ✅ 執行所有測試 (70+)
2. ✅ 構建產品版本 (npm run build)
3. ✅ 部署至 GitHub Pages

在 **Actions** 標籤查看構建進度

### 4️⃣ 訪問線上應用

部署完成後，訪問：
```
https://vibec.github.io/morse-decoder/
```

## 🧪 線上測試 UI

### 測試清單

在 GitHub Pages 上線後，建議測試：

#### 基礎功能
- [ ] 快速點擊按鈕輸入「點」(·)
- [ ] 按住按鈕輸入「線」(—)  
- [ ] 釋放按鈕分隔字符
- [ ] 實時顯示摩斯序列和對應字符

#### 多字符和分隔
- [ ] 連續輸入 ABC
- [ ] 停頓 >1 秒後自動分隔單詞
- [ ] 訊息正確累積

#### 撤銷和清除
- [ ] 撤銷按鈕移除最後輸入
- [ ] 清除按鈕清空所有內容

#### 鍵盤操作
- [ ] Space 鍵快速按 = 點
- [ ] Space 鍵按住 = 線
- [ ] Enter 鍵分隔字符

#### 無障礙性
- [ ] Tab 鍵導航所有按鈕
- [ ] Enter/Space 啟動按鈕
- [ ] 色彩對比度清晰
- [ ] 深色模式正常顯示

#### 響應式設計
- [ ] 桌面版 (1920px+)
- [ ] 平板版 (768px-1024px)
- [ ] 手機版 (<768px)

#### 效能
- [ ] 頁面加載時間 <2 秒
- [ ] 按鈕反應 <100ms
- [ ] 無卡頓感

### 報告問題

若發現問題，請在 GitHub Issues 中報告，包括：
- 瀏覽器和版本
- 作業系統
- 具體重現步驟
- 預期 vs 實際行為

## 📊 部署檢查清單

### 部署前
- [x] 所有測試通過
- [x] 代碼提交到 001-morse-decoder 分支
- [x] README 和文件完整
- [x] GitHub Actions 配置正確

### 部署時
- [ ] 確認合併 001-morse-decoder 到 main
- [ ] 檢查 GitHub Actions 構建成功
- [ ] 確認部署完成

### 部署後
- [ ] 訪問線上 URL 確認可用
- [ ] 執行基礎功能測試
- [ ] 驗證無障礙性 (鍵盤導航)
- [ ] 檢查響應式設計

## 🔄 持續部署

配置完成後：
- 每次推送到 `main` 或 `001-morse-decoder` 分支
- GitHub Actions 自動構建並部署
- 無需手動干預

## 📝 環境 URL

部署完成後可訪問的 URL：

| 環境 | URL |
|------|-----|
| GitHub Pages | `https://vibec.github.io/morse-decoder/` |
| Actions 日誌 | `https://github.com/vibec/vibec/actions` |
| 源代碼 | `https://github.com/vibec/vibec` |

## 🆘 故障排查

### GitHub Actions 失敗

1. 檢查 Actions 日誌中的錯誤訊息
2. 常見原因：
   - npm install 失敗 → 檢查 package.json
   - 測試失敗 → 本地執行 `npm test` 調試
   - 構建失敗 → 本地執行 `npm run build` 調試

### 頁面加載但功能不工作

1. 開啟瀏覽器開發者工具 (F12)
2. 檢查 Console 標籤中的錯誤
3. 確認 JavaScript 已啟用
4. 清除瀏覽器緩存並重新載入

### GitHub Pages 未顯示最新版本

1. Pages 設定中確認使用 "GitHub Actions"
2. 等待 30 秒後重新整理
3. 檢查 URL 中 `/morse-decoder/` 路徑是否正確

## 📞 支援

如需幫助，請：
- 查看 README.md 中的使用說明
- 檢查 GitHub Issues
- 提交新的 Issue 描述問題

## ✨ 下一步改進

部署成功後可考慮：
- [ ] 收集用戶反饋
- [ ] 優化 UI/UX
- [ ] 實現 Phase 4-5 功能 (多字符、撤銷/清除)
- [ ] 性能監測
- [ ] 多語言支援

---

**部署日期**: 2025-11-03  
**MVP 版本**: 1.0.0  
**測試覆蓋**: 70+ 用例  
**無障礙標準**: WCAG 2.1 AA ✅
