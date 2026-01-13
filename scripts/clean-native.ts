#!/usr/bin/env bun
/**
 * Remove native build outputs so build scripts start from a clean slate.
 */

import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const rootDir = join(import.meta.dir, "..");
const targets = ["dist", "zig-out"];

let removedAny = false;
for (const target of targets) {
  const targetPath = join(rootDir, target);
  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true });
    console.log(`Removed ${target}/`);
    removedAny = true;
  }
}

if (!removedAny) {
  console.log("Nothing to clean.");
}
