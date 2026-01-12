import { readFileSync } from "fs";

const buildZon = readFileSync("build.zig.zon", "utf-8");
const commitMatch = buildZon.match(/github\.com\/facebook\/yoga#([a-f0-9]+)/);

if (!commitMatch) {
  console.error("Could not find Yoga commit hash in build.zig.zon");
  process.exit(1);
}

const commitHash = commitMatch[1];

async function fetchHeader(path: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/facebook/yoga/${commitHash}/yoga/${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  return response.text();
}

export function extractFunctions(content: string): string[] {
  const regex = /YG_EXPORT\s+[^\(]*?\s+(YG\w+)\s*\(/g;
  const functions: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    functions.push(match[1]);
  }
  return functions;
}

export function extractEnumToString(content: string): string[] {
  const regex = /YG_ENUM_DECL\(\s*(YG\w+)\s*,/g;
  const functions: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    functions.push(`${match[1]}ToString`);
  }
  return functions;
}

export function extractIncludes(content: string): string[] {
  const regex = /#include <yoga\/(YG\w+\.h)>/g;
  const headers: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    headers.push(match[1]);
  }
  return headers;
}

export function getZigExports(): Set<string> {
  const content = readFileSync("src/yoga_ffi.zig", "utf-8");
  const regex = /pub\s+export\s+fn\s+(\w+)\s*\(/g;
  const exports = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    const zigName = match[1];
    // ygNodeNew -> YGNodeNew
    const cName = zigName.startsWith("yg") ? "YG" + zigName.slice(2) : zigName;
    exports.add(cName);
  }
  return exports;
}

export function diff(official: string[], local: Set<string>): string[] {
  return official.filter((f) => !local.has(f));
}

async function main(): Promise<void> {
  const yogaH = await fetchHeader("Yoga.h");
  const headers = extractIncludes(yogaH);

  const cFunctions = new Set<string>();
  for (const header of headers) {
    const content = await fetchHeader(header);
    extractFunctions(content).forEach((name) => cFunctions.add(name));
    extractEnumToString(content).forEach((name) => cFunctions.add(name));
  }

  const zigExports = getZigExports();
  const missing = diff(Array.from(cFunctions), zigExports);

  let ok = true;

  if (missing.length > 0) {
    console.log("Missing native functions:");
    missing.sort().forEach((f) => console.log(`  ${f}`));
    ok = false;
  }

  if (ok) {
    console.log("Complete");
  } else {
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
