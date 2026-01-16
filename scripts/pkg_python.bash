set -e
SCRIPT_DIR="$(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}"))"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
TMP_DIR="$ROOT_DIR/tmp"
PATH="$SCRIPT_DIR/platform:$PATH"

PACKAGE="python"
REPO="astral-sh/python-build-standalone"
VERSION=$(gh release view --json tagName --repo $REPO | jq -r '.tagName | ltrimstr("v")')

VERSIONS=$(deno -A $SCRIPT_DIR/platform/get-python-versions.mts)
VERSIONS_LEN=$(echo $VERSIONS | jq 'length')
for ((i=0; i<VERSIONS_LEN; i++)); do
  VERSION=$(echo $VERSIONS | jq -r ".[$i][0]")

  if [ $(gh-release-exists alshdavid/xpkg "$PACKAGE-$VERSION") = "true" ]; then
    echo Already Up To Date
    continue
  fi

  rm -rf $ROOT_DIR/binaries/$PACKAGE-$VERSION
  echo $PACKAGE $VERSION

  URLS_LEN=$(echo $VERSIONS | jq ".[$i][1] | length")
  for ((j=0; j<URLS_LEN; j++)); do
    rm -rf $TMP_DIR/download
    rm -rf $TMP_DIR/extracted
    rm -rf $TMP_DIR/binaries

    OS_ARCH=$(echo $VERSIONS | jq -r ".[$i][1][$j].os_arch")
    URL=$(echo $VERSIONS | jq -r ".[$i][1][$j].url")
    BASENAME=$(basename $URL)

    echo "FETCHING"
    mkdir -p $TMP_DIR/download          
    wget -q -O $TMP_DIR/download/$BASENAME $URL

    echo "EXTRACTING"
    mkdir $TMP_DIR/binaries        
    8zip extract --strip-components 1 --output $TMP_DIR/binaries/$PACKAGE-$VERSION-$OS_ARCH $TMP_DIR/download/$BASENAME

    echo "REPACKING"
    mkdir -p "$ROOT_DIR/binaries/$PACKAGE-$VERSION"
    8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-$OS_ARCH.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-$OS_ARCH .
    8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-$OS_ARCH.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-$OS_ARCH .
    8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-$OS_ARCH.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-$OS_ARCH .
  done

  echo "{\"package\":\"$PACKAGE\",\"version\":\"${VERSION}\"}" > $ROOT_DIR/binaries/$PACKAGE-$VERSION/meta.json
done