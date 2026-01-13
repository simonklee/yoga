/**
 * @simonklee/yoga Benchmark
 *
 * Compares our FFI implementation with yoga-layout (WASM)
 */

import { Node, Edge, FlexDirection, Justify, Align } from "./src/index";
import OfficialYoga from "yoga-layout";

interface BenchResult {
  name: string;
  times: number[];
  total: number;
  avg: number;
  min: number;
  max: number;
}

type BenchMode = "full" | "layout";

function getBenchMode(): BenchMode {
  const args = process.argv.slice(2);
  const modeArg = args.find((arg) => arg.startsWith("--mode="));
  if (modeArg) {
    const value = modeArg.split("=")[1];
    if (value === "layout" || value === "layout-only") {
      return "layout";
    }
    if (value === "full") {
      return "full";
    }
  }
  if (args.includes("--layout-only")) {
    return "layout";
  }
  if (args.includes("--full")) {
    return "full";
  }
  return "full";
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

interface CaseResult {
  name: string;
  local: BenchResult;
  official: BenchResult;
}

function runCase(
  name: string,
  iterations: number,
  local: () => void,
  official: () => void
): CaseResult {
  console.log(`\n--- ${name} ---`);
  const localResult = runBenchmark("Local FFI", local, iterations);
  const officialResult = runBenchmark("yoga-layout", official, iterations);
  printResult(localResult);
  printResult(officialResult);
  printComparison(localResult, officialResult);
  return { name, local: localResult, official: officialResult };
}

function printSummary(results: CaseResult[]) {
  console.log("\n" + "=".repeat(70));
  console.log("SUMMARY");
  console.log("=".repeat(70));

  const nameWidth = results.reduce((max, result) => Math.max(max, result.name.length), 0);
  let totalSpeedup = 0;
  for (const { name, local, official } of results) {
    const speedup = official.avg / local.avg;
    const faster = speedup > 1 ? "FFI" : "WASM";
    const ratio = speedup > 1 ? speedup : 1 / speedup;
    console.log(`  ${name.padEnd(nameWidth)} ${faster} ${ratio.toFixed(2)}x faster`);
    totalSpeedup += speedup;
  }

  const avgSpeedup = totalSpeedup / results.length;
  const overallFaster = avgSpeedup > 1 ? "Local FFI" : "yoga-layout";
  const overallRatio = avgSpeedup > 1 ? avgSpeedup : 1 / avgSpeedup;
  console.log(`\nOverall: ${overallFaster} is ${overallRatio.toFixed(2)}x faster on average`);
  console.log("\n" + "=".repeat(70));
}

// ============================================================================
// Local FFI Benchmarks
// ============================================================================

function simpleLayout_Local() {
  const root = Node.create();

  root.setWidth(100);
  root.setHeight(200);
  root.setPadding(Edge.All, 10);
  root.setMargin(Edge.All, 5);

  root.calculateLayout(undefined, undefined);
  root.getComputedLayout();

  root.free();
}

function nestedLayout_Local(depth: number, childrenPerLevel: number) {
  const createLevel = (level: number): Node => {
    const node = Node.create();
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

  root.calculateLayout(1000, 1000);
  root.freeRecursive();
}

function columnWithBoxes_Local(numBoxes: number) {
  const root = Node.create();

  root.setFlexDirection(FlexDirection.Column);
  root.setWidth(1000);
  root.setHeight(1000);
  root.setJustifyContent(Justify.FlexStart);
  root.setAlignItems(Align.Stretch);
  root.setPadding(Edge.All, 10);

  const children: Node[] = [];
  for (let i = 0; i < numBoxes; i++) {
    const child = Node.create();
    child.setHeight(50);
    child.setMargin(Edge.All, 5);
    child.setPadding(Edge.All, 10);
    root.insertChild(child, i);
    children.push(child);
  }

  root.calculateLayout(1000, 1000);

  // Read computed values
  for (const child of children) {
    child.getComputedLeft();
    child.getComputedTop();
    child.getComputedWidth();
    child.getComputedHeight();
  }

  root.freeRecursive();
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

  const children: any[] = [];
  for (let i = 0; i < numBoxes; i++) {
    const child = OfficialYoga.Node.create();
    child.setHeight(50);
    child.setMargin(OfficialYoga.EDGE_ALL, 5);
    child.setPadding(OfficialYoga.EDGE_ALL, 10);
    root.insertChild(child, i);
    children.push(child);
  }

  root.calculateLayout(1000, 1000);

  // Read computed values
  for (const child of children) {
    child.getComputedLeft();
    child.getComputedTop();
    child.getComputedWidth();
    child.getComputedHeight();
  }

  root.freeRecursive();
}

// ============================================================================
// Layout-only Benchmarks (build once, measure layout)
// ============================================================================

interface LayoutBench {
  run: () => void;
  cleanup: () => void;
}

function simpleLayout_Local_LayoutOnly(): LayoutBench {
  const root = Node.create();

  root.setWidth(100);
  root.setHeight(200);
  root.setPadding(Edge.All, 10);
  root.setMargin(Edge.All, 5);

  let toggle = false;
  return {
    run: () => {
      toggle = !toggle;
      root.setWidth(toggle ? 100 : 101);
      root.calculateLayout(undefined, undefined);
      root.getComputedLayout();
    },
    cleanup: () => root.free(),
  };
}

function simpleLayout_Official_LayoutOnly(): LayoutBench {
  const root = OfficialYoga.Node.create();

  root.setWidth(100);
  root.setHeight(200);
  root.setPadding(OfficialYoga.EDGE_ALL, 10);
  root.setMargin(OfficialYoga.EDGE_ALL, 5);

  let toggle = false;
  return {
    run: () => {
      toggle = !toggle;
      root.setWidth(toggle ? 100 : 101);
      root.calculateLayout(undefined, undefined);
      root.getComputedLayout();
    },
    cleanup: () => root.free(),
  };
}

function columnWithBoxes_Local_LayoutOnly(numBoxes: number): LayoutBench {
  const root = Node.create();

  root.setFlexDirection(FlexDirection.Column);
  root.setWidth(1000);
  root.setHeight(1000);
  root.setJustifyContent(Justify.FlexStart);
  root.setAlignItems(Align.Stretch);
  root.setPadding(Edge.All, 10);

  const children: Node[] = [];
  for (let i = 0; i < numBoxes; i++) {
    const child = Node.create();
    child.setHeight(50);
    child.setMargin(Edge.All, 5);
    child.setPadding(Edge.All, 10);
    root.insertChild(child, i);
    children.push(child);
  }

  const target = children[0];
  if (!target) throw new Error("No child nodes created");

  let toggle = false;
  return {
    run: () => {
      toggle = !toggle;
      target.setHeight(toggle ? 50 : 51);
      root.calculateLayout(1000, 1000);
      target.getComputedHeight();
    },
    cleanup: () => root.freeRecursive(),
  };
}

function columnWithBoxes_Official_LayoutOnly(numBoxes: number): LayoutBench {
  const root = OfficialYoga.Node.create();

  root.setFlexDirection(OfficialYoga.FLEX_DIRECTION_COLUMN);
  root.setWidth(1000);
  root.setHeight(1000);
  root.setJustifyContent(OfficialYoga.JUSTIFY_FLEX_START);
  root.setAlignItems(OfficialYoga.ALIGN_STRETCH);
  root.setPadding(OfficialYoga.EDGE_ALL, 10);

  const children: any[] = [];
  for (let i = 0; i < numBoxes; i++) {
    const child = OfficialYoga.Node.create();
    child.setHeight(50);
    child.setMargin(OfficialYoga.EDGE_ALL, 5);
    child.setPadding(OfficialYoga.EDGE_ALL, 10);
    root.insertChild(child, i);
    children.push(child);
  }

  const target = children[0];
  if (!target) throw new Error("No child nodes created");

  let toggle = false;
  return {
    run: () => {
      toggle = !toggle;
      target.setHeight(toggle ? 50 : 51);
      root.calculateLayout(1000, 1000);
      target.getComputedHeight();
    },
    cleanup: () => root.freeRecursive(),
  };
}

function nestedLayout_Local_LayoutOnly(depth: number, childrenPerLevel: number): LayoutBench {
  let leaf: Node | null = null;

  const createLevel = (level: number): Node => {
    const node = Node.create();
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
      if (!leaf) {
        leaf = node;
      }
    }

    return node;
  };

  const root = createLevel(0);
  if (!leaf) throw new Error("No leaf node created");
  const target = leaf;
  root.setWidth(1000);
  root.setHeight(1000);

  let toggle = false;
  return {
    run: () => {
      toggle = !toggle;
      target.setWidth(toggle ? 50 : 51);
      root.calculateLayout(1000, 1000);
      target.getComputedWidth();
    },
    cleanup: () => root.freeRecursive(),
  };
}

function nestedLayout_Official_LayoutOnly(depth: number, childrenPerLevel: number): LayoutBench {
  let leaf: any = null;

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
      if (!leaf) {
        leaf = node;
      }
    }

    return node;
  };

  const root = createLevel(0);
  if (!leaf) throw new Error("No leaf node created");
  const target = leaf;
  root.setWidth(1000);
  root.setHeight(1000);

  let toggle = false;
  return {
    run: () => {
      toggle = !toggle;
      target.setWidth(toggle ? 50 : 51);
      root.calculateLayout(1000, 1000);
      target.getComputedWidth();
    },
    cleanup: () => root.freeRecursive(),
  };
}

// ============================================================================
// Main
// ============================================================================

const mode = getBenchMode();

console.log("=".repeat(70));
console.log("@simonklee/yoga Benchmark: FFI vs yoga-layout (WASM)");
console.log("=".repeat(70));
console.log(`Mode: ${mode === "layout" ? "Layout Only" : "Full (build + layout)"}`);

const results: CaseResult[] = [];

if (mode === "layout") {
  const simpleLocal = simpleLayout_Local_LayoutOnly();
  const simpleOfficial = simpleLayout_Official_LayoutOnly();
  results.push(
    runCase("Simple Layout", 5000, simpleLocal.run, simpleOfficial.run)
  );
  simpleLocal.cleanup();
  simpleOfficial.cleanup();

  const col100Local = columnWithBoxes_Local_LayoutOnly(100);
  const col100Official = columnWithBoxes_Official_LayoutOnly(100);
  results.push(
    runCase("Column with 100 boxes", 500, col100Local.run, col100Official.run)
  );
  col100Local.cleanup();
  col100Official.cleanup();

  const col500Local = columnWithBoxes_Local_LayoutOnly(500);
  const col500Official = columnWithBoxes_Official_LayoutOnly(500);
  results.push(
    runCase("Column with 500 boxes", 100, col500Local.run, col500Official.run)
  );
  col500Local.cleanup();
  col500Official.cleanup();

  const nested43Local = nestedLayout_Local_LayoutOnly(4, 3);
  const nested43Official = nestedLayout_Official_LayoutOnly(4, 3);
  results.push(
    runCase("Nested 4x3 (81 leaf nodes)", 500, nested43Local.run, nested43Official.run)
  );
  nested43Local.cleanup();
  nested43Official.cleanup();

  const nested44Local = nestedLayout_Local_LayoutOnly(4, 4);
  const nested44Official = nestedLayout_Official_LayoutOnly(4, 4);
  results.push(
    runCase("Nested 4x4 (256 leaf nodes)", 100, nested44Local.run, nested44Official.run)
  );
  nested44Local.cleanup();
  nested44Official.cleanup();
} else {
  results.push(runCase("Simple Layout", 5000, simpleLayout_Local, simpleLayout_Official));
  results.push(
    runCase(
      "Column with 100 boxes",
      500,
      () => columnWithBoxes_Local(100),
      () => columnWithBoxes_Official(100)
    )
  );
  results.push(
    runCase(
      "Column with 500 boxes",
      100,
      () => columnWithBoxes_Local(500),
      () => columnWithBoxes_Official(500)
    )
  );
  results.push(
    runCase(
      "Nested 4x3 (81 leaf nodes)",
      500,
      () => nestedLayout_Local(4, 3),
      () => nestedLayout_Official(4, 3)
    )
  );
  results.push(
    runCase(
      "Nested 4x4 (256 leaf nodes)",
      100,
      () => nestedLayout_Local(4, 4),
      () => nestedLayout_Official(4, 4)
    )
  );
}

printSummary(results);
