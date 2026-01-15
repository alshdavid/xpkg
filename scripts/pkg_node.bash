set -e
SCRIPT_DIR="$(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}"))"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
TMP_DIR="$ROOT_DIR/tmp"
PATH="$SCRIPT_DIR/platform:$PATH"

PACKAGE="nodejs"

declare -a nodejs_versions=($(deno -A $SCRIPT_DIR/platform/get-nodejs-versions.mts))

for VERSION in "${nodejs_versions[@]}"; do
  echo "CHECKING: $VERSION"

  rm -rf $TMP_DIR/download
  rm -rf $TMP_DIR/extracted
  rm -rf $TMP_DIR/binaries
  rm -rf $ROOT_DIR/binaries/$PACKAGE-$VERSION

  if [ $(gh-release-exists alshdavid/xpkg "${PACKAGE}-${VERSION}") = "true" ]; then
    continue
  fi

  echo "FETCHING"
  mkdir -p $TMP_DIR/download          
  wget -q -O $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz https://nodejs.org/download/release/v$VERSION/node-v$VERSION-linux-x64.tar.gz
  wget -q -O $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz https://nodejs.org/download/release/v$VERSION/node-v$VERSION-linux-arm64.tar.gz
  wget -q -O $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz https://nodejs.org/download/release/v$VERSION/node-v$VERSION-darwin-x64.tar.gz
  wget -q -O $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz https://nodejs.org/download/release/v$VERSION/node-v$VERSION-darwin-arm64.tar.gz
  wget -q -O $TMP_DIR/download/$PACKAGE-$VERSION.zip    https://nodejs.org/download/release/v$VERSION/node-v$VERSION-win-x64.zip
  wget -q -O $TMP_DIR/download/$PACKAGE-$VERSION.zip    https://nodejs.org/download/release/v$VERSION/node-v$VERSION-win-arm64.zip

  echo "EXTRACTING"
  mkdir $TMP_DIR/binaries        
  8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-amd64   $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz
  8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-arm64   $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz
  8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-amd64   $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz
  8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64   $TMP_DIR/download/$PACKAGE-$VERSION.tar.gz
  8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-amd64 $TMP_DIR/download/$PACKAGE-$VERSION.zip
  8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-arm64 $TMP_DIR/download/$PACKAGE-$VERSION.zip

  echo "REPACKING"
  mkdir -p "$ROOT_DIR/binaries/$PACKAGE-$VERSION"
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-amd64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-amd64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-amd64 .

  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-arm64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-arm64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-arm64 .

  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-amd64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-amd64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-amd64 .

  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64 .

  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-amd64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-amd64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-amd64 .

  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-arm64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-arm64 .
  8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-arm64 .

  echo "{\"package\":\"$PACKAGE\",\"version\":\"${VERSION}\"}" > $ROOT_DIR/binaries/$PACKAGE-$VERSION/meta.json

  rm -rf $TMP_DIR/download
  rm -rf $TMP_DIR/extracted
  rm -rf $TMP_DIR/binaries
done
