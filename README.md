# Install Scripts

## Instructions

More at: [https://sh.davidalsh.com](https://sh.davidalsh.com)

### Install a binary with

```bash
# Download the latest GH Cli to the current directory
curl -L $(curl https://sh.davidalsh.com/packages/gh/latest_linux_amd64_tar_xz.txt) | tar -xJf - -C .
curl -L $(curl https://sh.davidalsh.com/packages/zenith/latest_linux_amd64_tar_xz.txt) | tar -xJf - -C .
```

### Linux and MacOS

```bash
eval $(curl -sSf sh.davidalsh.com/ping.sh | sh)
```

### Windows

```powershell
iex ((New-Object System.Net.WebClient).DownloadString('https://sh.davidalsh.com/ping.ps1'))
```
