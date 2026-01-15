set -e
SCRIPT_DIR="$(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}"))"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
TMP_DIR="$ROOT_DIR/tmp"
PATH="$SCRIPT_DIR/platform:$PATH"

PACKAGE="deno"
VERSION=$(gh release view --json tagName --repo denoland/deno | jq -r '.tagName | ltrimstr("v")')

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries
rm -rf $ROOT_DIR/binaries/$PACKAGE-$VERSION

# if [ $(gh-release-exists alshdavid/xpkg "${PACKAGE}-${VERSION}") = "true" ]; then
#   echo Already Up To Date
#   exit 0
# fi

mkdir -p $TMP_DIR/download          
wget -P $TMP_DIR/download https://github.com/denoland/deno/releases/download/v${VERSION}/deno-x86_64-unknown-linux-gnu.zip
wget -P $TMP_DIR/download https://github.com/denoland/deno/releases/download/v${VERSION}/deno-aarch64-unknown-linux-gnu.zip
wget -P $TMP_DIR/download https://github.com/denoland/deno/releases/download/v${VERSION}/deno-x86_64-apple-darwin.zip
wget -P $TMP_DIR/download https://github.com/denoland/deno/releases/download/v${VERSION}/deno-aarch64-apple-darwin.zip
wget -P $TMP_DIR/download https://github.com/denoland/deno/releases/download/v${VERSION}/deno-x86_64-pc-windows-msvc.zip
# wget -P $TMP_DIR/download https://github.com/denoland/deno/releases/download/v${VERSION}/deno-aarch64-pc-windows-msvc.zip

mkdir $TMP_DIR/binaries        
8zip extract --output $TMP_DIR/binaries/deno-${VERSION}-linux-amd64   $TMP_DIR/download/deno-x86_64-unknown-linux-gnu.zip
8zip extract --output $TMP_DIR/binaries/deno-${VERSION}-linux-arm64   $TMP_DIR/download/deno-aarch64-unknown-linux-gnu.zip
8zip extract --output $TMP_DIR/binaries/deno-${VERSION}-macos-amd64   $TMP_DIR/download/deno-x86_64-apple-darwin.zip
8zip extract --output $TMP_DIR/binaries/deno-${VERSION}-macos-arm64   $TMP_DIR/download/deno-aarch64-apple-darwin.zip
8zip extract --output $TMP_DIR/binaries/deno-${VERSION}-windows-amd64 $TMP_DIR/download/deno-x86_64-pc-windows-msvc.zip
# 8zip extract --output $TMP_DIR/binaries/deno-${VERSION}-windows-arm64 $TMP_DIR/download/deno-aarch64-pc-windows-msvc.zip

mkdir -p "$ROOT_DIR/binaries/$PACKAGE-$VERSION"
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.tar.gz"  --cwd $TMP_DIR/binaries/deno-$VERSION-linux-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.tar.xz"  --cwd $TMP_DIR/binaries/deno-$VERSION-linux-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.zip"     --cwd $TMP_DIR/binaries/deno-$VERSION-linux-amd64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.tar.gz"  --cwd $TMP_DIR/binaries/deno-$VERSION-linux-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.tar.xz"  --cwd $TMP_DIR/binaries/deno-$VERSION-linux-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.zip"     --cwd $TMP_DIR/binaries/deno-$VERSION-linux-arm64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.gz"  --cwd $TMP_DIR/binaries/deno-$VERSION-macos-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.xz"  --cwd $TMP_DIR/binaries/deno-$VERSION-macos-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.zip"     --cwd $TMP_DIR/binaries/deno-$VERSION-macos-amd64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.tar.gz"  --cwd $TMP_DIR/binaries/deno-$VERSION-macos-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.tar.xz"  --cwd $TMP_DIR/binaries/deno-$VERSION-macos-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.zip"     --cwd $TMP_DIR/binaries/deno-$VERSION-macos-arm64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.tar.gz"  --cwd $TMP_DIR/binaries/deno-$VERSION-windows-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.tar.xz"  --cwd $TMP_DIR/binaries/deno-$VERSION-windows-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.zip"     --cwd $TMP_DIR/binaries/deno-$VERSION-windows-amd64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.tar.gz"  --cwd $TMP_DIR/binaries/deno-$VERSION-windows-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.tar.xz"  --cwd $TMP_DIR/binaries/deno-$VERSION-windows-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.zip"     --cwd $TMP_DIR/binaries/deno-$VERSION-windows-arm64 .

echo "{\"package\":\"$PACKAGE\",\"version\":\"${VERSION}\"}" > $ROOT_DIR/binaries/$PACKAGE-$VERSION/meta.json

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries