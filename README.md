# 2026 研蘋果工作坊 — 報名網站

單一頁面活動報名網站。前端純靜態（HTML/CSS/JS），後端用 Google Apps Script 把報名資料寫進 Google Sheet。可部署到 GitHub Pages。

## 檔案
```
regSites/
├── index.html          # 報名頁
├── style.css           # 簡約明亮樣式（蘋果綠）
├── script.js           # 表單驗證 + 送出（需填 APPS_SCRIPT_URL）
├── apps_script/Code.gs # Google Apps Script 後端（貼到 Sheet 的 Apps Script）
└── README.md
```

## 本地預覽
```bash
cd ~/Downloads/regSites
python3 -m http.server 8000
# 瀏覽器開 http://localhost:8000
```
> `APPS_SCRIPT_URL` 留空時為「本地預覽模式」：只驗證 UI、不實際送出（送出後會在 console 印出 payload）。

---

## 部署步驟（兩個 OAuth 步驟需要你的帳號）

### A. Google Sheet + Apps Script 後端
1. 開一份新的 **Google Sheet**（這份就是報名資料庫）。
2. **擴充功能 → Apps Script**。
3. 把 `apps_script/Code.gs` 整段貼進去，存檔。
4. **部署 → 新增部署作業 → 網頁應用程式**：
   - 執行身分：**我**
   - 存取權：**任何人**
5. **授權**（會跳 Google OAuth，要你點同意）。
6. 複製結尾 `/exec` 的網址。
7. 把網址貼進 `script.js` 第一行的 `APPS_SCRIPT_URL = "...";`。
8. 重新本地測試：填表送出 → 回 Google Sheet 看「報名資料」分頁有沒有新增一列。
   - 健康檢查：瀏覽器直接打開那個 `/exec` 網址，應看到 `{"status":"alive"}`。

### B. GitHub Pages
> 本機目前沒裝 `gh` CLI；兩種做法擇一。

**做法 1（網頁，最省事）**
1. 到 github.com 新增一個 repo（例如 `apple-workshop-2026`，public）。
2. 本機推上去：
   ```bash
   cd ~/Downloads/regSites
   git remote add origin https://github.com/<你的帳號>/apple-workshop-2026.git
   git branch -M main
   git push -u origin main
   ```
3. repo → **Settings → Pages** → Source 選 `main` / `root` → Save。
4. 等一兩分鐘，網址會是 `https://<你的帳號>.github.io/apple-workshop-2026/`。

**做法 2（裝 gh，我可代跑大部分）**
```bash
brew install gh
gh auth login        # 這步要你在瀏覽器/裝置授權
```
之後我可以用 `gh repo create ... --push` 和 `gh api` 開啟 Pages。

---

## 注意
- `script.js` 裡的 `APPS_SCRIPT_URL` 會被 push 到 public repo —— 這個 `/exec` 網址本身可公開（它只接受 append，不外洩試算表內容），但別把任何私密金鑰寫進前端。
- Apps Script 後端已做欄位必填 + Email 格式的二次驗證。
