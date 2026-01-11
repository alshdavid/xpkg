/**
 * Sources:
 * https://github.com/eza-community/eza/releases
 */

import * as fs from "node:fs";
import { Paths } from "../platform/paths.mts";
import type { DownloadManifest } from "../repackage-versions.mts";
import { untarGz } from "../utils/compression.mts";
import * as githubApi from "../utils/github.mts";
import { sh } from "../utils/sh.mts";
import { wget } from "../utils/wget.mts";

const PROJECT = "eza";
const REPO = "eza-community/eza"
const BASE = "https://github.com/eza-community/eza/releases/download"

export default async function eza(
  manifest: DownloadManifest,
): Promise<void> {
  const resp = await githubApi.getRelease(REPO);
  const version = resp.tag_name.replace("v", "");

  // prettier-ignore
  manifest[`${PROJECT}-${version}`] = [
    // { project: PROJECT, version, os: 'linux',    arch:  'amd64',    format: 'bin', url: buildLinuxAmd64(version)   },
    { project: PROJECT, version, os: 'linux',    arch:  'amd64',    format: 'tar.gz', url: `${BASE}/v${version}/eza_x86_64-unknown-linux-musl.tar.gz`   },
    { project: PROJECT, version, os: 'linux',    arch:  'arm64',    format: 'zip',    url: `${BASE}/v${version}/eza_aarch64-unknown-linux-gnu.zip`   },
    { project: PROJECT, version, os: 'windows',  arch:  'amd64',    format: 'zip',    url: `${BASE}/v${version}/eza.exe_x86_64-pc-windows-gnu.zip` },
    { project: PROJECT, version, os: 'macos',    arch:  'arm64',    format: 'bin',    url: buildMacOsArm64(version)  },
  ]
}

function buildMacOsArm64(version:string) {
  return async function() {
    if (process.arch !== 'arm64') {
      return
    }
    try {
      await wget(`https://github.com/eza-community/eza/archive/refs/tags/v${version}.tar.gz`, Paths["~/tmp/downloads/"]('eza-source', 'source.tar.gz'))
      await untarGz(Paths["~/tmp/downloads/"]('eza-source', 'source.tar.gz'), Paths["~/tmp/downloads/"]('eza-source'), 1)
      await fs.promises.rm(Paths["~/tmp/downloads/"]('eza-source', 'rust-toolchain.toml'))
      await sh('cargo', ['build', '--release'], { cwd: Paths["~/tmp/downloads/"]('eza-source') })
      await fs.promises.rename(Paths["~/tmp/downloads/"]('eza-source', 'target', 'release', 'eza'), Paths["~/build/"]('eza'))
      await fs.promises.rm(Paths["~/tmp/downloads/"]('eza-source'), { recursive: true, force: true })
      return `file://${Paths["~/build/"]('eza')}`
    } catch (error) {
      console.error('BUILD FAILURE', error)
      // Continue
    }
  }
}

function buildLinuxAmd64(version:string) {
  return async function() {
    if (process.arch !== 'x64') {
      return
    }
    try {
      await wget(`https://github.com/eza-community/eza/archive/refs/tags/v${version}.tar.gz`, Paths["~/tmp/downloads/"]('eza-source', 'source.tar.gz'))
      await untarGz(Paths["~/tmp/downloads/"]('eza-source', 'source.tar.gz'), Paths["~/tmp/downloads/"]('eza-source'), 1)
      await fs.promises.rm(Paths["~/tmp/downloads/"]('eza-source', 'rust-toolchain.toml'))
      await sh('cargo', ['build'], { cwd: Paths["~/tmp/downloads/"]('eza-source') })
      await fs.promises.rename(Paths["~/tmp/downloads/"]('eza-source', 'target', 'debug', 'eza'), Paths["~/build/"]('eza'))
      await fs.promises.rm(Paths["~/tmp/downloads/"]('eza-source'), { recursive: true, force: true })
      return `file://${Paths["~/build/"]('eza')}`
    } catch {
      // Continue
    }
  }
}