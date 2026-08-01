#!/bin/zsh
# Monta product-plan-medical-clinic/ do zero, de forma reprodutível.
#
# O pacote é descartável e gitignored — ESTE diretório é a fonte. Os documentos que ninguém deriva
# (product-overview, prompts, design-system, READMEs do shell e do data-shapes) ficam em
# handwritten/; o resto é gerado a partir de product-medical-clinic/ e src/sections-medical-clinic/.
#
# Uso:  tools/medical-clinic/build-export.sh
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
RAIZ="$(cd "$AQUI/../.." && pwd)"
cd "$RAIZ"
OUT=product-plan-medical-clinic

rm -rf $OUT $OUT.zip
mkdir -p $OUT/{prompts,instructions/incremental,design-system,data-shapes,shell/components,sections/financeiro/components}

# 1. sections: componentes com imports reescritos, types, sample-data, screenshots, README, tests
node "$AQUI/scripts/export.mjs"

# 2. shell + tokens
cp src/shell-medical-clinic/components/*.tsx src/shell-medical-clinic/components/index.ts $OUT/shell/components/
cp product-medical-clinic/design-system/*.json $OUT/design-system/

# 3. módulo financeiro (compartilhado por contas-receber/pagar, não tem spec própria)
python3 - <<'PY'
import re, pathlib, shutil
rw = lambda c, s: re.sub(r"@/\.\./product-medical-clinic/sections/([^/']+)/types",
        lambda m: '../types' if m.group(1)==s else f"../../{m.group(1)}/types", c)
src=pathlib.Path('src/sections-medical-clinic/financeiro/components')
dst=pathlib.Path('product-plan-medical-clinic/sections/financeiro/components')
for f in src.iterdir(): dst.joinpath(f.name).write_text(rw(f.read_text(),'financeiro'))
shutil.copy('product-medical-clinic/sections/financeiro/types.ts',
            'product-plan-medical-clinic/sections/financeiro/types.ts')
PY

# 4. docs escritos à mão
cp "$AQUI/handwritten/product-overview.md"           $OUT/
cp "$AQUI/handwritten/prompts/"*.md                  $OUT/prompts/
cp "$AQUI/handwritten/design-system/"*               $OUT/design-system/
cp "$AQUI/handwritten/data-shapes/README.md"         $OUT/data-shapes/
cp "$AQUI/handwritten/shell/README.md"               $OUT/shell/
cp "$AQUI/handwritten/sections-financeiro/README.md" $OUT/sections/financeiro/

# 5. derivados que dependem dos anteriores
node "$AQUI/scripts/shapes.mjs"   # overview.ts + divergencias.md
node "$AQUI/scripts/instr.mjs"    # 27 milestones + one-shot

# 6. README do pacote (usa a tabela de milestones gerada pelo export)
python3 "$AQUI/scripts/readme.py"

rm -f $OUT/_resumo.json
zip -qr $OUT.zip $OUT/
echo "pacote: $(find $OUT -type f | wc -l | tr -d ' ') arquivos | zip: $(du -h $OUT.zip | cut -f1)"
