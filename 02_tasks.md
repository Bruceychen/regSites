# 02 — 工作包與測試（Tasks）

> 由 [[01_spec.md]]（已過 gate 2026-06-02）展開。每包：步驟＋**可跑測試**＋done 勾選＋相依。`[human]` = OAuth 人工關卡，不計入 agent 可自動完成範圍。
> 規則：實作中若與 spec 衝突 → 回去改 `01_spec.md`，不默默改 code。**可用的程式碼不重寫**（WP1–4 沿用 rookie 已驗證實作）。

狀態圖例：`[ ]` 待辦 ／ `[x]` 完成 ／ `[~]` 進行中 ／ `[human]` 需人工

---

## WP0 — 環境前置檢查（無相依）
- [x] 寫 `check_env.sh`：檢查 node/python3（必需）、git；回報 gh/clasp 是否缺（部署用）。
- **測試**：`bash check_env.sh` 結束碼 0 且印出工具清單。
- **done @ commit**：見下方提交。

## WP1 — 前端骨架（相依：spec §4 §6）
- [x] `index.html`：單頁、活動標題、5 欄表單（name/email/phone/org/title）、提交鈕、狀態列。
- **測試（AC1/AC2 前置）**：本地 server `curl /` 回 200；HTML 含 5 個 `name=` 欄位。
- 實作：沿用 rookie 已驗證版本。

## WP2 — 樣式（相依：WP1）
- [x] `style.css`：簡約明亮、蘋果綠 accent、卡片置中、RWD、focus/invalid/done 狀態。
- **測試**：`curl /style.css` 回 200；視覺由 Bruce 目視（AC6 375px 不破版）。
- 實作：沿用 rookie 版本。

## WP3 — 前端邏輯（相依：WP1 + spec §6 契約）
- [x] `script.js`：即時驗證、提交走 `text/plain` POST 契約 body、成功收合/失敗可重試、`APPS_SCRIPT_URL` 留空＝本地預覽模式。
- **測試**：`curl /script.js` 回 200；檔內含契約 5 欄 + `text/plain` 寫法（ADR-2）。
- 實作：沿用 rookie 版本。

## WP4 — 後端 Apps Script（相依：spec §6 契約；可與 WP1–3 平行）
- [x] `apps_script/Code.gs`：`doPost` 解析契約 JSON → 二次驗證（5 欄+email）→ append Sheet；`doGet` 健康檢查；首列粗體凍結。
- **測試**：code 對照契約形狀；實際寫入屬 WP7 `[human]` 部署後驗。
- 實作：沿用 rookie 版本。

## WP5 — 本地整合測試（相依：WP1–4）
- [x] 起 `python3 -m http.server`，驗 AC1：index/style/script 皆 200。
- **測試**：三資源 curl 全 200（見提交時的測試輸出）。

## WP6 — 文件（相依：WP1–5）
- [x] `README.md`：檔案結構、本地預覽、部署 runbook（指向 spec §9 人工關卡）。
- ADR 已在 `01_spec.md` §7（不另開會發霉的問題總表）。
- **測試**：README 存在且含 A/B 部署步驟。

## WP7 — Google Sheet + Apps Script 部署 `[human]`（相依：WP4）
- [ ] `[human]` 開 Sheet → 貼 Code.gs → 部署 Web App（執行=我、存取=任何人）→ OAuth 授權 → 取 `/exec`。
- [ ] 把 `/exec` 貼進 `script.js` 的 `APPS_SCRIPT_URL`。
- **驗收**：AC4（送出 Sheet 多一列）、AC5（/exec 回 alive）。

## WP8 — GitHub Pages 部署 `[human]`（相依：WP5）
- [ ] `[human]` 裝 `gh`+`gh auth login`（或網頁建 repo）→ push → Settings/Pages 啟用。
- **驗收**：Pages 網址可開、表單可送出（接 WP7 後端後）。

---

### 完成度
- **Agent 可自動完成**：WP0–WP6 ✅（本回合全數完成）
- **人工關卡**：WP7、WP8（等 Bruce OAuth）
