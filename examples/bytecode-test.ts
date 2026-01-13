#!/usr/bin/env bun
/**
 * Simple end-to-end test for bytecode compilation.
 *
 * Prerequisites:
 *   bun run build:native  # Build zig and copy native libs to dist/
 *
 * Usage:
 *   # Run directly
 *   bun run examples/bytecode-test.ts
 *
 *   # Compile with bytecode (for faster startup)
 *   bun build --compile --bytecode examples/bytecode-test.ts --outfile bytecode-test
 *   ./bytecode-test
 *
 *   # Compare startup times
 *   time bun run examples/bytecode-test.ts
 *   time ./bytecode-test
 */

import { Node, FlexDirection, Justify, Align, Edge } from "../src/index.ts";

// Create a simple flex container with children
const root = Node.create();
root.setFlexDirection(FlexDirection.Row);
root.setJustifyContent(Justify.SpaceBetween);
root.setAlignItems(Align.Center);
root.setWidth(400);
root.setHeight(200);
root.setPadding(Edge.All, 10);

// Add three children
for (let i = 0; i < 3; i++) {
  const child = Node.create();
  child.setWidth(100);
  child.setHeight(80);
  child.setMargin(Edge.Horizontal, 5);
  root.insertChild(child, i);
}

// Calculate layout
root.calculateLayout();

// Print results
console.log("Bytecode compilation test - Layout results:");
console.log("Root:", root.getComputedLayout());
for (let i = 0; i < root.getChildCount(); i++) {
  const child = root.getChild(i);
  if (child) {
    console.log(`Child ${i}:`, child.getComputedLayout());
  }
}

// Cleanup
root.freeRecursive();

console.log("\nBytecode test passed!");
