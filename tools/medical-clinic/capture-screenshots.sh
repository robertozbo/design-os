#!/bin/zsh
# Captura os screenshots das telas do medical-clinic (light + dark) e os grava em
# product-medical-clinic/sections/<id>/.
#
# Playwright MCP não está disponível nesta máquina, então dirigimos o Chrome por CDP numa instância
# isolada (o perfil padrão do Chrome 136+ ignora --remote-debugging-port).
#
# Uso:  tools/medical-clinic/capture-screenshots.sh                 # todas as telas
#       tools/medical-clinic/capture-screenshots.sh '[{"section":"agenda","design":"Agenda","file":"agenda"}]'
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
RAIZ="$(cd "$AQUI/../.." && pwd)"
cd "$RAIZ"
PERFIL="${TMPDIR:-/tmp}/design-os-chrome-shots"
ALVOS="$1"

echo "▸ subindo dev server…"
npm run dev > /tmp/design-os-vite.log 2>&1 &
VITE=$!
echo "▸ subindo Chrome isolado…"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 --user-data-dir="$PERFIL" --no-first-run --headless=new \
  about:blank > /tmp/design-os-chrome.log 2>&1 &

limpar() { pkill -f "user-data-dir=$PERFIL" 2>/dev/null || true; kill $VITE 2>/dev/null || true; }
trap limpar EXIT

for i in {1..20}; do
  curl -sf -o /dev/null http://localhost:3000/ && curl -sf -o /dev/null http://127.0.0.1:9222/json/version && break
  sleep 1
done

node "$AQUI/scripts/shot.mjs" "$ALVOS" light
node "$AQUI/scripts/shot.mjs" "$ALVOS" dark
echo "✓ screenshots em product-medical-clinic/sections/"
