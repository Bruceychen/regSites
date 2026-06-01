/**
 * 2026 研蘋果工作坊 — 報名表後端 (Google Apps Script)
 *
 * 部署方式：容器綁定式 (container-bound)
 *  1. 開一份新的 Google Sheet
 *  2. 擴充功能 (Extensions) → Apps Script
 *  3. 把本檔內容整段貼進 Code.gs，存檔
 *  4. 部署 (Deploy) → 新增部署作業 → 類型「網頁應用程式 (Web app)」
 *       - 執行身分 (Execute as)：我 (your account)
 *       - 具有存取權的使用者 (Who has access)：任何人 (Anyone)
 *  5. 授權 (Authorize) → 複製結尾為 /exec 的網址
 *  6. 把該網址貼到網站的 script.js 的 APPS_SCRIPT_URL
 */

const SHEET_NAME = "報名資料";
const HEADERS = ["時間戳記", "姓名", "Email", "電話", "組織", "職稱"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ result: "error", message: "no payload" });
    }
    const d = JSON.parse(e.postData.contents);

    // 基本後端驗證
    const required = ["name", "email", "phone", "org", "title"];
    for (const k of required) {
      if (!d[k] || String(d[k]).trim() === "") {
        return json_({ result: "error", message: "缺少欄位：" + k });
      }
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(d.email).trim())) {
      return json_({ result: "error", message: "Email 格式不正確" });
    }

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      String(d.name).trim(),
      String(d.email).trim(),
      String(d.phone).trim(),
      String(d.org).trim(),
      String(d.title).trim(),
    ]);

    return json_({ result: "ok" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  }
}

// 健康檢查：瀏覽器直接打開 /exec 會看到 {"status":"alive"}
function doGet() {
  return json_({ status: "alive", sheet: SHEET_NAME });
}
