# 00 — 原始提示詞（intent，版控起點）

> Bruce 2026-06-02 原始需求，逐字保留。後續所有規格／工作包／實作都從這份展開；若實作中發現與此意圖衝突，回頭修 `01_spec.md`（spec 是 source of truth），不默默改 code。

---

設計一個活動報名網站，存放於 下載/regSites/ 底下，本地 git init 即可。可直接自由 branch 跟 commit。

內容如下：

- 活動名稱為 2026 研蘋果工作坊，單一頁面，簡約明亮風格，不需登入
- 報名表需要填寫 姓名、email、電話、組織、職稱
- 表單送出後資料需儲存到 Google Sheet，自行撰寫 Apps Script 並部署
- 本地端測試正確後將網站部署到 GitHub，並啟用 Pages
- 可使用電腦連到需要的網頁進行授權或確認系統運作是否正常

---

**衍生指示（2026-06-02）：** 以 `rookie` 分支保留「一句提示詞快速產出」的 ad-hoc 版本；於 `optimized` 分支從零，依 spec-driven 流程（prompt → spec → tasks(含測試) → 逐包實作＋註解）重做，作為流程對照。
