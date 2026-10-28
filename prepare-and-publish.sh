#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v gh >/dev/null || { echo 'غياب GitHub CLI (gh): توقف.' >&2; exit 1; }
command -v python3 >/dev/null || { echo 'غياب python3: توقف.' >&2; exit 1; }
command -v git >/dev/null || { echo 'غياب git: توقف.' >&2; exit 1; }
# Fetch exact approved assets from existing owned GitHub projects without editing those repositories.
fetch_asset() {
  local repository="$1" source="$2" target="$3"
  mkdir -p "$(dirname "$target")"
  gh api "repos/Kakramah/${repository}/contents/${source}" -H 'Accept: application/vnd.github+json' | python3 -c 'import sys,json,base64; j=json.load(sys.stdin); sys.stdout.buffer.write(base64.b64decode(j["content"]))' > "$target"
  test -s "$target" || { echo "فشل استرجاع $source" >&2; exit 1; }
}
fetch_asset Kakramah.github.io images/eagle-emblem-metal.svg images/eagle-emblem-metal.svg
fetch_asset middle-east-power-trap fonts/IBMPlexSansArabic-Regular.woff2 fonts/IBMPlexSansArabic-Regular.woff2
fetch_asset cosmic-mind fonts/Amiri-Regular.woff2 fonts/Amiri-Regular.woff2
# The actual official local gate must be present. Never fabricate a pass.
GATE="$HOME/khaldoun-projects/khaldoun-web-starter/scripts/بوابة-الويب.sh"
test -f "$GATE" || { echo "بوابة الويب الرسمية مفقودة: $GATE" >&2; exit 1; }
bash "$GATE"
# Publish only after the gate succeeds and the desired repository name is confirmed.
if gh repo view Kakramah/hidden-biological-threat >/dev/null 2>&1; then
  echo 'المستودع موجود. لا تكتب فوقه من هذا السكربت؛ راجع الفرع الحالي وافتح PR.' >&2
  exit 1
fi
git init -b main
git add .
git commit -m 'أنشئ: السلاح الذي لا يُرى'
gh repo create Kakramah/hidden-biological-threat --public --source=. --push
gh api -X POST repos/Kakramah/hidden-biological-threat/pages -f 'source[branch]=main' -f 'source[path]=/'
echo 'طلب تفعيل Pages أُرسل؛ تحقق من الرابط العام والصور قبل اعتماد النشر: https://kakramah.github.io/hidden-biological-threat/'
