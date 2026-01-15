set -e
SCRIPT_DIR="$(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}"))"
ROOT_DIR="$(dirname $SCRIPT_DIR)"
TMP_DIR="$ROOT_DIR/tmp"
PATH="$SCRIPT_DIR/platform:$PATH"

PACKAGE="gh"
VERSION=$(gh release view --json tagName --repo cli/cli | jq -r '.tagName | ltrimstr("v")')

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries
rm -rf $ROOT_DIR/binaries/$PACKAGE-$VERSION

if [ $(gh-release-exists alshdavid/xpkg "${PACKAGE}-${VERSION}") = "true" ]; then
  echo Already Up To Date
  exit 0
fi

mkdir $TMP_DIR/download          
wget -P $TMP_DIR/download https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_linux_amd64.tar.gz    
wget -P $TMP_DIR/download https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_linux_arm64.tar.gz    
wget -P $TMP_DIR/download https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_macOS_amd64.zip
wget -P $TMP_DIR/download https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_macOS_arm64.zip
wget -P $TMP_DIR/download https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_windows_amd64.zip
wget -P $TMP_DIR/download https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_windows_arm64.zip

mkdir $TMP_DIR/binaries        
8zip extract --strip-components 2 --output $TMP_DIR/binaries/gh-${VERSION}-linux-amd64   --path gh      $TMP_DIR/download/gh_${VERSION}_linux_amd64.tar.gz
8zip extract --strip-components 2 --output $TMP_DIR/binaries/gh-${VERSION}-linux-arm64   --path gh      $TMP_DIR/download/gh_${VERSION}_linux_arm64.tar.gz
8zip extract --strip-components 2 --output $TMP_DIR/binaries/gh-${VERSION}-macos-amd64   --path gh      $TMP_DIR/download/gh_${VERSION}_macOS_amd64.zip
8zip extract --strip-components 2 --output $TMP_DIR/binaries/gh-${VERSION}-macos-arm64   --path gh      $TMP_DIR/download/gh_${VERSION}_macOS_arm64.zip
8zip extract --strip-components 1 --output $TMP_DIR/binaries/gh-${VERSION}-windows-amd64 --path gh.exe  $TMP_DIR/download/gh_${VERSION}_windows_amd64.zip
8zip extract --strip-components 1 --output $TMP_DIR/binaries/gh-${VERSION}-windows-arm64 --path gh.exe  $TMP_DIR/download/gh_${VERSION}_windows_arm64.zip

mkdir -p "$ROOT_DIR/binaries/$PACKAGE-$VERSION"
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.tar.gz"  --cwd $TMP_DIR/binaries/gh-$VERSION-linux-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.tar.xz"  --cwd $TMP_DIR/binaries/gh-$VERSION-linux-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-amd64.zip"     --cwd $TMP_DIR/binaries/gh-$VERSION-linux-amd64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.tar.gz"  --cwd $TMP_DIR/binaries/gh-$VERSION-linux-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.tar.xz"  --cwd $TMP_DIR/binaries/gh-$VERSION-linux-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-linux-arm64.zip"     --cwd $TMP_DIR/binaries/gh-$VERSION-linux-arm64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.gz"  --cwd $TMP_DIR/binaries/gh-$VERSION-macos-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.tar.xz"  --cwd $TMP_DIR/binaries/gh-$VERSION-macos-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-amd64.zip"     --cwd $TMP_DIR/binaries/gh-$VERSION-macos-amd64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.tar.gz"  --cwd $TMP_DIR/binaries/gh-$VERSION-macos-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.tar.xz"  --cwd $TMP_DIR/binaries/gh-$VERSION-macos-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-macos-arm64.zip"     --cwd $TMP_DIR/binaries/gh-$VERSION-macos-arm64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.tar.gz"  --cwd $TMP_DIR/binaries/gh-$VERSION-windows-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.tar.xz"  --cwd $TMP_DIR/binaries/gh-$VERSION-windows-amd64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-amd64.zip"     --cwd $TMP_DIR/binaries/gh-$VERSION-windows-amd64 .

8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.tar.gz"  --cwd $TMP_DIR/binaries/gh-$VERSION-windows-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.tar.xz"  --cwd $TMP_DIR/binaries/gh-$VERSION-windows-arm64 .
8zip compress --output "$ROOT_DIR/binaries/$PACKAGE-$VERSION/$PACKAGE-$VERSION-windows-arm64.zip"     --cwd $TMP_DIR/binaries/gh-$VERSION-windows-arm64 .

echo "{\"package\":\"$PACKAGE\",\"version\":\"${VERSION}\"}" > $ROOT_DIR/binaries/$PACKAGE-$VERSION/meta.json

rm -rf $TMP_DIR/download
rm -rf $TMP_DIR/extracted
rm -rf $TMP_DIR/binaries