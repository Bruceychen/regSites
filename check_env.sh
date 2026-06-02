#!/usr/bin/env bash
# WP0 — 環境前置檢查
# 用法：bash check_env.sh
# 必需：node、python3、git；選用（部署）：gh、clasp
set -u

echo "── 2026 研蘋果工作坊 · 環境檢查 ──"

missing_required=0

check() {  # check <cmd> <required|optional> <用途>
  local cmd="$1" level="$2" note="$3"
  if command -v "$cmd" >/dev/null 2>&1; then
    printf "  ✅ %-8s %s\n" "$cmd" "$($cmd --version 2>/dev/null | head -1)"
  else
    if [ "$level" = "required" ]; then
      printf "  ❌ %-8s 缺少（必需）— %s\n" "$cmd" "$note"
      missing_required=1
    else
      printf "  ⚠️  %-8s 缺少（選用）— %s\n" "$cmd" "$note"
    fi
  fi
}

echo "[必需]"
check python3 required "本地預覽伺服器"
check git     required "版本控制"
check node    required "前端工具鏈（選配）"

echo "[部署用，選用]"
check gh    optional "GitHub Pages 自動化（否則改用網頁建 repo）"
check clasp optional "Apps Script CLI 部署（否則改用網頁 Apps Script 編輯器）"

echo "────────────────────────────"
if [ "$missing_required" -eq 0 ]; then
  echo "結果：必需工具齊全 ✅（部署步驟仍需人工 OAuth，見 01_spec.md §9）"
  exit 0
else
  echo "結果：缺少必需工具 ❌（請先安裝再繼續）"
  exit 1
fi
