# 01 — 規格與設計（Spec）

> 由 [[00_prompt.md]] 展開。**這份是 source of truth。** 通過 Bruce 審核 gate 後，才展開 `02_tasks.md` 與實作。
> 狀態：**🚦 待審核（GATE）** — 2026-06-02

---

## 1. 目標 / 背景
為「2026 研蘋果工作坊」提供一個對外、零登入、可公開分享連結的線上報名頁，報名資料即時落進主辦方的 Google Sheet。技術上走「純靜態前端 + Apps Script 後端」零伺服器架構，部署在 GitHub Pages。

## 2. 範圍（In Scope）
- 單一頁面（single page）報名表
- 5 欄位：姓名、Email、電話、組織、職稱（全必填）
- 前端即時驗證 + 後端二次驗證
- 送出 → 寫入 Google Sheet 一列
- 簡約明亮風格、RWD（手機/桌機）、基本無障礙（label、aria-live）
- 部署：GitHub Pages（前端）+ Apps Script Web App（後端）

## 3. 不做（Non-goals）
- 不做登入 / 會員 / 後台管理
- 不做名額計數、付款、寄送確認信（列為未來）
- 不做多語系（先繁中）
- 不自建資料庫 / 伺服器

## 4. 功能需求（FR）
- **FR1** 頁面顯示活動名稱、簡述、報名表。
- **FR2** 五欄位皆必填；Email 須符合基本 email 格式。
- **FR3** 驗證未過：標紅、聚焦第一個錯誤欄、顯示提示，不送出。
- **FR4** 驗證通過：POST 至 Apps Script，成功則收合表單顯示成功訊息；失敗顯示錯誤且可重試。
- **FR5** 後端對 5 欄位 + Email 格式做二次驗證；通過才 append 至 Sheet。
- **FR6** 後端 append 欄序：時間戳記、姓名、Email、電話、組織、職稱；首列為粗體凍結標題。
- **FR7** 後端提供健康檢查（GET → `{"status":"alive"}`）。

## 5. 非功能需求（NFR）
- **NFR1** 簡約明亮（蘋果綠 accent、白底、卡片置中）。
- **NFR2** RWD：≤460px 卡片自適應。
- **NFR3** 無第三方前端框架（純 HTML/CSS/JS，可直接 Pages 託管）。
- **NFR4** 前端不得內嵌任何私密金鑰。

## 6. 介面契約（Interface Contract）★ 前後端接縫，先講死
前端 → 後端，POST body 為 JSON 字串：
```json
{ "name": "...", "email": "...", "phone": "...", "org": "...", "title": "..." }
```
後端回應：
```json
{ "result": "ok" }                          // 成功
{ "result": "error", "message": "<原因>" }  // 失敗
```
> 任一方改動此形狀，必須同步本節 + 雙方實作。

## 7. 架構決策（ADR / Decisions）
- **ADR-1：純靜態 + Apps Script 後端。** 理由：零成本、零維運、可 Pages 託管、Sheet 即資料庫，符合「不需登入的小型活動頁」。
- **ADR-2：POST 用 `text/plain` 送 JSON 字串，不用 `application/json`。** 理由：避開瀏覽器對 Apps Script 的 **CORS preflight**（`application/json` 會觸發 OPTIONS preflight，Apps Script 處理麻煩）；`text/plain` 屬 simple request 不觸發 preflight。**⚠️ 勿改回 application/json，否則前端送出會被 CORS 擋。**
- **ADR-3：Apps Script 用容器綁定式（bound to Sheet）。** 理由：`getActiveSpreadsheet()` 直接取得目標 Sheet，免存 Sheet ID。

## 8. 驗收標準（Acceptance — 可跑的檢查）
- **AC1** 本地 `python3 -m http.server` 後，index.html / style.css / script.js 皆回 **200**。
- **AC2** 五欄留空送出 → 不送出、顯示錯誤、聚焦第一空欄。
- **AC3** Email 填 `abc`（非法）送出 → 被擋。
- **AC4** 全部合法送出（已接後端）→ Google Sheet「報名資料」分頁**新增一列**且欄序正確。
- **AC5** 瀏覽器直開 `/exec` → 見 `{"status":"alive"}`。
- **AC6** 頁面在 375px 寬不破版。

## 9. 部署目標 & 已知人工關卡（Human-gated）
- **前端** → GitHub Pages。⚠️ 本機未裝 `gh`：需 `brew install gh` + `gh auth login`（OAuth，須人工），或網頁建 repo。
- **後端** → Apps Script Web App。⚠️ 部署需 Google 帳號 OAuth 授權（須人工，agent 無瀏覽器代點）。
- 這兩步在 `02_tasks.md` 會標為 `[human]`，不計入 agent 可自動完成範圍。

## 10. 未來（Backlog）
名額上限與計數、報名確認信、活動資訊區塊、QR 報到、匯出報名表。
