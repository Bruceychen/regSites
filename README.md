# 2026 研蘋果工作坊 — 報名網站（optimized 分支）

單頁活動報名站。純靜態前端 + Google Apps Script 後端（資料寫進 Google Sheet），部署於 GitHub Pages。

本分支 (`optimized`) 以 **spec-driven 流程**重建，與 `rookie`（一句 prompt 的 ad-hoc 版）對照。

## 流程文件
```
00_prompt.md   原始意圖（version-controlled intent）
01_spec.md     規格：範圍 / 介面契約 / ADR 決策 / 可跑驗收 / 人工關卡  ← source of truth
02_tasks.md    工作包：步驟 + 測試 + 相依 + 狀態勾選
check_env.sh   環境前置檢查（WP0）
```

## 實作檔
```
index.html            報名頁（5 欄表單）
style.css             簡約明亮（蘋果綠）+ RWD
script.js             驗證 + 送出（需填 APPS_SCRIPT_URL；留空＝本地預覽）
apps_script/Code.gs   Apps Script 後端（doPost 寫 Sheet + 二次驗證 + 健康檢查）
```

## 快速開始
```bash
bash check_env.sh                 # 環境檢查
python3 -m http.server 8000       # 本地預覽 → http://localhost:8000
```

## 部署（兩個 `[human]` OAuth 關卡，見 01_spec.md §9 / 02_tasks WP7-8）

### A. Google Sheet + Apps Script（WP7）
1. 開一份 Google Sheet → 擴充功能 → Apps Script
2. 貼 `apps_script/Code.gs`，存檔
3. 部署 → 網頁應用程式（執行身分＝我、存取＝任何人）→ 授權（Google OAuth）
4. 複製 `/exec` 網址 → 貼進 `script.js` 的 `APPS_SCRIPT_URL`
5. 驗收：填表送出 → Sheet「報名資料」分頁多一列；瀏覽器開 `/exec` → `{"status":"alive"}`

### B. GitHub Pages（WP8）
> 本機未裝 `gh`，二擇一：
- **網頁**：github 建 repo → `git remote add origin … && git push -u origin <branch>` → Settings/Pages 啟用
- **gh CLI**：`brew install gh && gh auth login`（人工授權）後，`gh repo create … --push` + `gh api` 啟用 Pages

## 注意
- 前端不含任何私密金鑰；`/exec` 網址可公開（只接受 append）。
- **ADR-2：POST 用 `text/plain` 送 JSON 避 CORS preflight；勿改回 `application/json`。**
