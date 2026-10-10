#!/bin/bash
# Deploy executado NO servidor pelo cPanel (Git Version Control / .cpanel.yml).
# O destino é escolhido pela branch do clone: hml -> preview, main -> produção.
set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
case "$BRANCH" in
  hml)  TARGET="$HOME/public_html/preview.serinelec.cl" ;;
  main) TARGET="$HOME/public_html" ;;
  *) echo "Branch '$BRANCH' sem destino de deploy; nada a fazer."; exit 0 ;;
esac

[ -d "$TARGET" ] || { echo "Destino inexistente: $TARGET" >&2; exit 1; }
echo "Deploy da branch $BRANCH -> $TARGET"

# Recursos primeiro, páginas depois, index por último.
for d in assets css js api pt-br en; do
  [ -d "$d" ] || continue
  mkdir -p "$TARGET/$d"
  /bin/cp -Rf "$d/." "$TARGET/$d/"
done

for f in *.html; do
  [ "$f" = "index.html" ] && continue
  /bin/cp -f "$f" "$TARGET/"
done
[ -f favicon.ico ] && /bin/cp -f favicon.ico "$TARGET/"
/bin/cp -f index.html "$TARGET/"

echo "Deploy finalizado."
