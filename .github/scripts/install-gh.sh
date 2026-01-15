#!/usr/bin/sh
set -e

ARCH=""
case "$(uname -m)" in
  x86_64 | x86-64 | x64 | amd64) ARCH="amd64";;
  aarch64 | arm64) ARCH="arm64";;
  *) ARCH="";;
esac

OS=""
case "$(uname -s)" in
  Darwin) OS="macos";;
  Linux) OS="linux";;
  MINGW64_NT* | Windows_NT | MSYS_NT*) OS="windows";;
  *) OS="";;
esac

>&2 echo ARCH: $ARCH
>&2 echo OS: $OS

export OS_ARCH="${OS}-${ARCH}"
echo "export OS_ARCH=\"${OS_ARCH}\""

if ! [ "$GITHUB_ENV" = "" ]; then
  echo "OS_ARCH=${OS_ARCH}" >> $GITHUB_ENV
fi

VERSION=$(curl --silent "https://api.github.com/repos/cli/cli/releases/latest" | jq -r '.tag_name' | sed 's/^v//')

URL=""
case "$OS-$ARCH" in
  linux-amd64)    URL="https://github.com/cli/cli/releases/latest/download/gh_${VERSION}_linux_amd64.tar.gz";;
  linux-arm64)    URL="https://github.com/cli/cli/releases/latest/download/gh_${VERSION}_linux_arm64.tar.gz";;
  macos-amd64)    URL="";;
  macos-arm64)    URL="";;
  windows-amd64)  URL="";;
  windows-arm64)  URL="";;
esac

if [ "$URL" = "" ]; then
  >&2 echo "Cannot find installer for GH"
  exit 1
fi

>&2 echo URL: $URL
>&2 echo

case "$OS-$ARCH" in
  linux-amd64)    mkdir -p /usr/local/gh; curl -L $URL | tar -xzf - --strip-components=1 -C /usr/local/gh && echo "/usr/local/gh/bin" >> $GITHUB_PATH;;
  linux-arm64)    mkdir -p /usr/local/gh; curl -L $URL | tar -xzf - --strip-components=1 -C /usr/local/gh && echo "/usr/local/gh/bin" >> $GITHUB_PATH;;
esac