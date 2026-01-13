#!/usr/bin/env bun
/**
 * Copies the native library from zig-out to dist/<platform>-<arch> for bundling.
 *
 * This enables `bun build --compile` to work locally by satisfying the static
 * file imports (`with { type: "file" }`).
 *
 * Also creates placeholder files for other platforms so the bundler can resolve
 * all imports (only the current platform's library will actually be used).
 *
 * Usage: bun run scripts/copy-native-to-dist.ts
 */

import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = join(import.meta.dir, "..");
const platform = process.platform;
const arch = process.arch;

// All supported platforms
const platforms = [
  { dir: "darwin-arm64", lib: "libyoga.dylib" },
  { dir: "darwin-x64", lib: "libyoga.dylib" },
  { dir: "linux-x64", lib: "libyoga.so" },
  { dir: "linux-arm64", lib: "libyoga.so" },
  { dir: "windows-x64", lib: "yoga.dll" },
];

// Determine current platform's library name and source path
const isWindows = platform === "win32";
const libName = isWindows ? "yoga.dll" : platform === "darwin" ? "libyoga.dylib" : "libyoga.so";
const srcDir = isWindows ? "bin" : "lib";
const srcPath = join(rootDir, "zig-out", srcDir, libName);

// Determine current platform's target directory
const targetPlatform = platform === "win32" ? "windows" : platform;
const currentPlatformDir = `${targetPlatform}-${arch}`;

if (!existsSync(srcPath)) {
  console.error(`Native library not found at ${srcPath}`);
  console.error("Run 'zig build' first to build the native library.");
  process.exit(1);
}

// Create directories and files for all platforms
for (const { dir, lib } of platforms) {
  const targetDir = join(rootDir, "dist", dir);
  const targetPath = join(targetDir, lib);

  mkdirSync(targetDir, { recursive: true });

  if (dir === currentPlatformDir) {
    // Copy actual library for current platform
    copyFileSync(srcPath, targetPath);
    console.log(`Copied ${lib} to dist/${dir}`);
  } else if (!existsSync(targetPath)) {
    // Create placeholder for other platforms
    writeFileSync(targetPath, "");
    console.log(`Created placeholder dist/${dir}/${lib}`);
  }
}
