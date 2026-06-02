// ===== 設定 =====
// 部署 Apps Script Web App 後，把 /exec 結尾的網址貼到這裡。
// 部署前留空字串，表單會走「本地預覽模式」(不送出、只驗證 UI)。
const APPS_SCRIPT_URL = "";
// =================

const form = document.getElementById("reg-form");
const btn = document.getElementById("submit-btn");
const statusMsg = document.getElementById("status-msg");
const card = document.querySelector(".card");

const fields = ["name", "email", "phone", "org", "title"];

function setStatus(text, kind) {
  statusMsg.textContent = text;
  statusMsg.className = "status" + (kind ? " " + kind : "");
}

function validate() {
  let ok = true;
  for (const id of fields) {
    const el = document.getElementById(id);
    const valid = el.checkValidity() && el.value.trim() !== "";
    el.classList.toggle("invalid", !valid);
    if (!valid && ok) el.focus();
    ok = ok && valid;
  }
  return ok;
}

// 即時清除錯誤樣式
fields.forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => {
    if (el.value.trim() !== "" && el.checkValidity()) el.classList.remove("invalid");
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("", "");

  if (!validate()) {
    setStatus("請完整填寫所有必填欄位（Email 需為有效格式）。", "err");
    return;
  }

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    org: document.getElementById("org").value.trim(),
    title: document.getElementById("title").value.trim(),
  };

  // 本地預覽模式：尚未設定後端網址
  if (!APPS_SCRIPT_URL) {
    console.log("[本地預覽] 將送出的資料：", payload);
    showDone("（本地預覽模式）資料已通過驗證，但尚未設定後端網址，未實際送出。");
    return;
  }

  btn.disabled = true;
  btn.textContent = "送出中…";
  setStatus("資料傳送中，請稍候…", "");

  try {
    // 用 text/plain 送 JSON，避開 CORS preflight（Apps Script 友善寫法）
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.result === "ok") {
      showDone("報名成功！我們已收到你的資料，期待工作坊見。🍎");
    } else {
      throw new Error(data.message || "伺服器回傳未知狀態");
    }
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.textContent = "送出報名";
    setStatus("送出失敗：" + err.message + "。請稍後再試或聯絡主辦單位。", "err");
  }
});

function showDone(msg) {
  card.classList.add("done");
  setStatus(msg, "ok");
}
