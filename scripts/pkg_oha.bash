set -e
SCRIPT_DIR="$(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}"))"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
TMP_DIR="$ROOT_DIR/tmp"
PATH="$SCRIPT_DIR/platform:$PATH"

PACKAGE="oha"
REPO="hatoo/oha"
VERSION=$(gh release view --json tagName --repo $REPO | jq -r '.tagName')

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries
rm -rf $ROOT_DIR/binaries/$PACKAGE-$VERSION

if [ $(gh-release-exists alshdavid/xpkg "${PACKAGE}-${VERSION}") = "true" ]; then
  echo Already Up To Date
  exit 0
fi

echo "FETCHING"
mkdir -p $TMP_DIR/binaries        
mkdir -p $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-amd64
mkdir -p $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-arm64
mkdir -p $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-amd64
mkdir -p $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64
mkdir -p $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-amd64

wget -q -O $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-amd64/oha        https://github.com/$REPO/releases/download/v$VERSION/oha-linux-amd64
wget -q -O $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-arm64/oha        https://github.com/$REPO/releases/download/v$VERSION/oha-linux-arm64
wget -q -O $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-amd64/oha        https://github.com/$REPO/releases/download/v$VERSION/oha-macos-amd64
wget -q -O $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64/oha        https://github.com/$REPO/releases/download/v$VERSION/oha-macos-arm64
wget -q -O $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-amd64/oha.exe  https://github.com/$REPO/releases/download/v$VERSION/oha-windows-amd64.exe

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

echo "{\"package\":\"$PACKAGE\",\"version\":\"${VERSION}\"}" > $ROOT_DIR/binaries/$PACKAGE-$VERSION/meta.json

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries