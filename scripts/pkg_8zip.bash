set -e
SCRIPT_DIR="$(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}"))"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
TMP_DIR="$ROOT_DIR/tmp"
PATH="$SCRIPT_DIR/platform:$PATH"

PACKAGE="8zip"
REPO="alshdavid/8zip"
VERSION=$(gh release view --json tagName --repo $REPO | jq -r '.tagName')

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries
rm -rf $ROOT_DIR/binaries/$PACKAGE-$VERSION

# if [ $(gh-release-exists alshdavid/xpkg "${PACKAGE}-${VERSION}") = "true" ]; then
#   echo Already Up To Date
#   exit 0
# fi

echo "FETCHING"
mkdir -p $TMP_DIR/download          
wget -q -P $TMP_DIR/download https://github.com/$REPO/releases/download/${VERSION}/$PACKAGE-linux-amd64.tar.xz
wget -q -P $TMP_DIR/download https://github.com/$REPO/releases/download/${VERSION}/$PACKAGE-linux-arm64.tar.xz
wget -q -P $TMP_DIR/download https://github.com/$REPO/releases/download/${VERSION}/$PACKAGE-macos-amd64.tar.xz
wget -q -P $TMP_DIR/download https://github.com/$REPO/releases/download/${VERSION}/$PACKAGE-macos-arm64.tar.xz
wget -q -P $TMP_DIR/download https://github.com/$REPO/releases/download/${VERSION}/$PACKAGE-windows-amd64.tar.xz
wget -q -P $TMP_DIR/download https://github.com/$REPO/releases/download/${VERSION}/$PACKAGE-windows-arm64.tar.xz

echo "EXTRACTING"
mkdir $TMP_DIR/binaries        
8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-amd64   $TMP_DIR/download/$PACKAGE-linux-amd64.tar.xz
8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-linux-arm64   $TMP_DIR/download/$PACKAGE-linux-arm64.tar.xz
8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-amd64   $TMP_DIR/download/$PACKAGE-macos-amd64.tar.xz
8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64   $TMP_DIR/download/$PACKAGE-macos-arm64.tar.xz
8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-amd64 $TMP_DIR/download/$PACKAGE-windows-amd64.tar.xz
8zip extract --output $TMP_DIR/binaries/$PACKAGE-$VERSION-windows-arm64 $TMP_DIR/download/$PACKAGE-windows-arm64.tar.xz

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