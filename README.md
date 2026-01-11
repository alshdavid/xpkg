# Package Mirrors & Install Scripts

This repo contains mirrors for commonly used applications. Applications are repackaged into multiple archive formats with names and package directory structures normalized.

Applications are published as Github releases on this repo, with a normalized naming convention;

```
{package-name}-{semver}
```

A Github action runs routinely to scan projects for updates, automatically publishing a [Github release](https://github.com/alshdavid/xpkg/releases) when updates are detected.

[https://sh.davidalsh.com](https://sh.davidalsh.com)

## Instructions

### Install a Binary

```bash
# Download the latest GH Cli to the current directory
curl -L $(curl https://sh.davidalsh.com/packages/gh/latest_linux_amd64_tar_xz) | tar -xJf - -C .

export PATH="$PWD:$PATH"
gh --version
```

### Install a Binary (Verbose)

```bash
# Download the latest Zenith to the current directory (broken down)
ZENITH_LATEST_VERSION="$(curl https://sh.davidalsh.com/packages/zenith/latest_linux_amd64_tar_xz)"
wget $ZENITH_LATEST_VERSION -o ./zenith.tar.xz
tar -xJf ./zenith.tar.xz -C .

export PATH="$PWD:$PATH"
zenith --version
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
https://sh.davidalsh.com/packages/gh/latest_linux_amd64_tar_xz.txt
https://sh.davidalsh.com/packages/gh/latest_linux_arm64_tar_xz.txt
https://sh.davidalsh.com/packages/gh/latest_macos_amd64_tar_xz.txt
https://sh.davidalsh.com/packages/gh/latest_macos_arm64_tar_xz.txt
https://sh.davidalsh.com/packages/gh/latest_windows_amd64_tar_xz.txt
https://sh.davidalsh.com/packages/gh/latest_windows_arm64_tar_xz.txt
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
https://sh.davidalsh.com/packages/gh/latest_linux_amd64_zip.txt
https://sh.davidalsh.com/packages/gh/latest_linux_amd64_tar_gz.txt
https://sh.davidalsh.com/packages/gh/latest_linux_amd64_tar_xz.txt
```

## Adding a Package

If you'd like to add a package to the 