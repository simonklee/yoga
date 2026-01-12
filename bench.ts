/**
 * @simonklee/yoda Benchmark
 *
 * Compares our FFI implementation with yoga-layout (WASM)
 */

import Yoga, { Node, Config, Edge, FlexDirection, Justify, Align, Direction } from "./src/index";
import OfficialYoga from "yoga-layout";

interface BenchResult {
  name: string;
  times: number[];
  total: number;
  avg: number;
  min: number;
  max: number;
}

function runBenchmark(
  name: string,
  fn: () => void,
  iterations: number = 1000
): BenchResult {
  // Warmup
  for (let i = 0; i < 10; i++) {
    fn();
  }

  // Collect times
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }

  const total = times.reduce((a, b) => a + b, 0);
  return {
    name,
    times,
    total,
    avg: total / iterations,
    min: Math.min(...times),
    max: Math.max(...times),
  };
}

function printResult(result: BenchResult) {
  console.log(`\n${result.name}`);
  console.log(`  Iterations: ${result.times.length}`);
  console.log(`  Total:      ${result.total.toFixed(2)}ms`);
  console.log(`  Avg:        ${result.avg.toFixed(4)}ms`);
  console.log(`  Min:        ${result.min.toFixed(4)}ms`);
  console.log(`  Max:        ${result.max.toFixed(4)}ms`);
}

function printComparison(local: BenchResult, official: BenchResult) {
  const speedup = official.avg / local.avg;
  const faster = speedup > 1 ? "Local FFI" : "yoga-layout";
  const ratio = speedup > 1 ? speedup : 1 / speedup;
  console.log(`  --> ${faster} is ${ratio.toFixed(2)}x faster`);
}

// ============================================================================
// Local FFI Benchmarks
// ============================================================================

function simpleLayout_Local() {
  const config = Config.create();
  const root = Node.create(config);

  root.setWidth(100);
  root.setHeight(200);
  root.setPadding(Edge.All, 10);
  root.setMargin(Edge.All, 5);

  root.calculateLayout(undefined, undefined, Direction.LTR);
  root.getComputedLayout();

  root.free();
  config.free();
}

function nestedLayout_Local(depth: number, childrenPerLevel: number) {
  const config = Config.create();

  const createLevel = (level: number): Node => {
    const node = Node.create(config);
    node.setFlexDirection(level % 2 === 0 ? FlexDirection.Column : FlexDirection.Row);
    node.setFlexGrow(1);
    node.setPadding(Edge.All, 5);

    if (level < depth) {
      for (let i = 0; i < childrenPerLevel; i++) {
        const child = createLevel(level + 1);
        node.insertChild(child, i);
      }
    } else {
      node.setWidth(50);
      node.setHeight(50);
    }

    return node;
  };

  const root = createLevel(0);
  root.setWidth(1000);
  root.setHeight(1000);

  root.calculateLayout(1000, 1000, Direction.LTR);
  root.freeRecursive();
  config.free();
}

function columnWithBoxes_Local(numBoxes: number) {
  const config = Config.create();
  const root = Node.create(config);

  root.setFlexDirection(FlexDirection.Column);
  root.setWidth(1000);
  root.setHeight(1000);
  root.setJustifyContent(Justify.FlexStart);
  root.setAlignItems(Align.Stretch);
  root.setPadding(Edge.All, 10);

  for (let i = 0; i < numBoxes; i++) {
    const child = Node.create(config);
    child.setHeight(50);
    child.setMargin(Edge.All, 5);
    child.setPadding(Edge.All, 10);
    root.insertChild(child, i);
  }

  root.calculateLayout(1000, 1000, Direction.LTR);

  // Read computed values
  for (let i = 0; i < numBoxes; i++) {
    const child = root.getChild(i);
    if (child) {
      child.getComputedLeft();
      child.getComputedTop();
      child.getComputedWidth();
      child.getComputedHeight();
    }
  }

  root.freeRecursive();
  config.free();
}

// ============================================================================
// Official yoga-layout Benchmarks
// ============================================================================

function simpleLayout_Official() {
  const root = OfficialYoga.Node.create();

  root.setWidth(100);
  root.setHeight(200);
  root.setPadding(OfficialYoga.EDGE_ALL, 10);
  root.setMargin(OfficialYoga.EDGE_ALL, 5);

  root.calculateLayout(undefined, undefined);
  root.getComputedLayout();

  root.free();
}

function nestedLayout_Official(depth: number, childrenPerLevel: number) {
  const createLevel = (level: number): any => {
    const node = OfficialYoga.Node.create();
    node.setFlexDirection(
      level % 2 === 0
        ? OfficialYoga.FLEX_DIRECTION_COLUMN
        : OfficialYoga.FLEX_DIRECTION_ROW
    );
    node.setFlexGrow(1);
    node.setPadding(OfficialYoga.EDGE_ALL, 5);

    if (level < depth) {
      for (let i = 0; i < childrenPerLevel; i++) {
        const child = createLevel(level + 1);
        node.insertChild(child, i);
      }
    } else {
      node.setWidth(50);
      node.setHeight(50);
    }

    return node;
  };

  const root = createLevel(0);
  root.setWidth(1000);
  root.setHeight(1000);

  root.calculateLayout(1000, 1000);
  root.freeRecursive();
}

function columnWithBoxes_Official(numBoxes: number) {
  const root = OfficialYoga.Node.create();

  root.setFlexDirection(OfficialYoga.FLEX_DIRECTION_COLUMN);
  root.setWidth(1000);
  root.setHeight(1000);
  root.setJustifyContent(OfficialYoga.JUSTIFY_FLEX_START);
  root.setAlignItems(OfficialYoga.ALIGN_STRETCH);
  root.setPadding(OfficialYoga.EDGE_ALL, 10);

  for (let i = 0; i < numBoxes; i++) {
    const child = OfficialYoga.Node.create();
    child.setHeight(50);
    child.setMargin(OfficialYoga.EDGE_ALL, 5);
    child.setPadding(OfficialYoga.EDGE_ALL, 10);
    root.insertChild(child, i);
  }

  root.calculateLayout(1000, 1000);

  // Read computed values
  for (let i = 0; i < numBoxes; i++) {
    const child = root.getChild(i);
    child.getComputedLeft();
    child.getComputedTop();
    child.getComputedWidth();
    child.getComputedHeight();
  }

  root.freeRecursive();
}

// ============================================================================
// Main
// ============================================================================

console.log("=".repeat(70));
console.log("@simonklee/yoda Benchmark: FFI vs yoga-layout (WASM)");
console.log("=".repeat(70));

// Simple layout
console.log("\n--- Simple Layout ---");
const simpleLocal = runBenchmark("Local FFI", simpleLayout_Local, 5000);
const simpleOfficial = runBenchmark("yoga-layout", simpleLayout_Official, 5000);
printResult(simpleLocal);
printResult(simpleOfficial);
printComparison(simpleLocal, simpleOfficial);

// Column with boxes
console.log("\n--- Column with 100 boxes ---");
const col100Local = runBenchmark("Local FFI", () => columnWithBoxes_Local(100), 500);
const col100Official = runBenchmark("yoga-layout", () => columnWithBoxes_Official(100), 500);
printResult(col100Local);
printResult(col100Official);
printComparison(col100Local, col100Official);

console.log("\n--- Column with 500 boxes ---");
const col500Local = runBenchmark("Local FFI", () => columnWithBoxes_Local(500), 100);
const col500Official = runBenchmark("yoga-layout", () => columnWithBoxes_Official(500), 100);
printResult(col500Local);
printResult(col500Official);
printComparison(col500Local, col500Official);

// Nested layouts
console.log("\n--- Nested 4x3 (81 leaf nodes) ---");
const nested43Local = runBenchmark("Local FFI", () => nestedLayout_Local(4, 3), 500);
const nested43Official = runBenchmark("yoga-layout", () => nestedLayout_Official(4, 3), 500);
printResult(nested43Local);
printResult(nested43Official);
printComparison(nested43Local, nested43Official);

console.log("\n--- Nested 4x4 (256 leaf nodes) ---");
const nested44Local = runBenchmark("Local FFI", () => nestedLayout_Local(4, 4), 100);
const nested44Official = runBenchmark("yoga-layout", () => nestedLayout_Official(4, 4), 100);
printResult(nested44Local);
printResult(nested44Official);
printComparison(nested44Local, nested44Official);

// Summary
console.log("\n" + "=".repeat(70));
console.log("SUMMARY");
console.log("=".repeat(70));

const results = [
  { name: "Simple Layout", local: simpleLocal, official: simpleOfficial },
  { name: "Column 100", local: col100Local, official: col100Official },
  { name: "Column 500", local: col500Local, official: col500Official },
  { name: "Nested 4x3", local: nested43Local, official: nested43Official },
  { name: "Nested 4x4", local: nested44Local, official: nested44Official },
];

let totalSpeedup = 0;
for (const { name, local, official } of results) {
  const speedup = official.avg / local.avg;
  const faster = speedup > 1 ? "FFI" : "WASM";
  const ratio = speedup > 1 ? speedup : 1 / speedup;
  console.log(`  ${name.padEnd(15)} ${faster} ${ratio.toFixed(2)}x faster`);
  totalSpeedup += speedup;
}

const avgSpeedup = totalSpeedup / results.length;
const overallFaster = avgSpeedup > 1 ? "Local FFI" : "yoga-layout";
const overallRatio = avgSpeedup > 1 ? avgSpeedup : 1 / avgSpeedup;
console.log(`\nOverall: ${overallFaster} is ${overallRatio.toFixed(2)}x faster on average`);

console.log("\n" + "=".repeat(70));
