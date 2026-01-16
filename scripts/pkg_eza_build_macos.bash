set -e
SCRIPT_DIR="$(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}"))"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
TMP_DIR="$ROOT_DIR/tmp"
PATH="$SCRIPT_DIR/platform:$PATH"

PACKAGE="eza"
REPO="eza-community/eza"
VERSION=$(gh release view --json tagName --repo $REPO | jq -r '.tagName | ltrimstr("v")')

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/source
rm -rf $ROOT_DIR/binaries/$PACKAGE-$VERSION

if [ $(gh-release-exists alshdavid/xpkg "${PACKAGE}-${VERSION}") = "true" ]; then
  echo Already Up To Date
  exit 0
fi

echo "FETCHING"
mkdir -p $TMP_DIR/download
wget -q -O $TMP_DIR/download/source.zip   https://github.com/eza-community/eza/archive/refs/tags/v$VERSION.zip

echo "EXTRACTING"
mkdir $TMP_DIR/source        
8zip extract --strip-components 1 --output $TMP_DIR/source   $TMP_DIR/download/source.*

echo "BUILDING"
cd $TMP_DIR/source
cargo build --release

mkdir -p $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64
cp $TMP_DIR/source/target/release/eza $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64/eza

echo "REPACKING"
mkdir -p "$ROOT_DIR/binaries/$PACKAGE-$VERSION"
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.gz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.xz"  --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.zip"     --cwd $TMP_DIR/binaries/$PACKAGE-$VERSION-macos-arm64 .

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries