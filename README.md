# Package Mirrors & Install Scripts

### [https://sh.davidalsh.com](https://sh.davidalsh.com)

This repo contains mirrors for commonly used applications. Applications are repackaged into multiple archive formats with names and package directory structures normalized.

Applications are published as Github releases on this repo, with a normalized naming convention;

```
{package-name}-{semver}
{package-name}-latest
```

A Github action runs routinely to scan projects for updates, automatically publishing a [Github release](https://github.com/alshdavid/xpkg/releases) when updates are detected.


## Instructions

### Install a Binary

```bash
# Download the latest GH Cli to the current directory
curl -L https://github.com/alshdavid/xpkg/releases/download/gh-latest/gh-linux-amd64.tar.gz | tar -xzf - -C .
./gh --version

curl -L https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-linux-amd64.tar.gz | tar -xzf - -C .
./bin/node --version
```

### Supported Platforms

Binary support depends on the project but most projects have.

- Linux AMD64
- Linux ARM64
- MacOS ARM64
- Windows AMD64

Some, but not all projects have.

- MacOS AMD64
- Windows ARM64

Where possible, projects are recompiled to add support for these targets.

```
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-linux-amd64.tar.gz
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-linux-amd64.tar.gz
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-macos-amd64.tar.gz
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-macos-amd64.tar.gz
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-windows-amd64.tar.gz
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-windows-amd64.tar.gz
```

### Archive Formats

To maximize compatibility, applications are repackaged and the contents flattened (if required) as:

- `.zip`
  - Maximum compatibility
  - Worst compression
  - Worst tooling
- `.tar.gz`
  - Supported on Windows 10+, MacOS, Linux
  - Moderate compression
  - Supports streamed decompression (one line download/extract)
- `.tar.xz`
  - Supported on Linux and MacOS
  - Best compressions
  - Supports streamed decompression (one line download/extract)

```
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-linux-amd64.tar.gz
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-linux-amd64.tar.xz
https://github.com/alshdavid/xpkg/releases/download/nodejs-latest/nodejs-linux-amd64.zip
```
