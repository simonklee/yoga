# Bun-Yoga Progress

## Project Goal
Create a Bun FFI wrapper for Facebook's Yoga layout engine with a yoga-layout compatible API.

## Technology Stack
- **Zig 0.15** - Build system and native code
- **Facebook Yoga** - Layout engine (direct dependency via build.zig.zon)
- **Bun FFI** - JavaScript to native bridge
- **TypeScript** - API layer

## Completed

### Part 1 & 2 - Initial Setup (NAPI approach)
- Created initial project structure
- Tried using yoga-zig wrapper (had limitations)
- Implemented basic NAPI bindings with napigen

### Part 3 - FFI vs NAPI Benchmark
- Created FFI version alongside NAPI
- Benchmarked both approaches
- **Result: FFI was ~5% faster on average**
- **Decision: Switch to pure FFI approach**

### Part 4 - Pure FFI Implementation (CURRENT)
- Removed NAPI code and napigen dependency
- Added Facebook Yoga directly as dependency (like yoga-zig does)
- Created complete FFI bindings using @cImport
- Created TypeScript API layer with Node and Config classes
- Updated benchmark to compare with yoga-layout (WASM)

## Files

### Source Files
- `src/yoga_ffi.zig` - Zig FFI exports with C ABI
- `src/index.ts` - TypeScript FFI bindings and API

### Build Files
- `build.zig` - Build configuration (compiles Yoga C++ directly)
- `build.zig.zon` - Dependencies (Facebook Yoga)

### Config Files
- `package.json` - npm package config
- `tsconfig.json` - TypeScript config

### Test/Bench Files
- `bench.ts` - Benchmark comparing FFI vs yoga-layout (WASM)

## API Implementation

### Config
- [x] `Config.create()`
- [x] `Config.free()`
- [x] `setUseWebDefaults()` / `useWebDefaults()`
- [x] `setPointScaleFactor()` / `getPointScaleFactor()`

### Node Creation/Destruction
- [x] `Node.create()` / `Node.createWithConfig()`
- [x] `free()` / `freeRecursive()`
- [x] `reset()` / `clone()`

### Child Management
- [x] `insertChild()` / `removeChild()` / `removeAllChildren()`
- [x] `getChild()` / `getChildCount()` / `getParent()`

### Layout
- [x] `calculateLayout()`
- [x] `hasNewLayout()` / `markLayoutSeen()`
- [x] `markDirty()` / `isDirty()`

### Computed Layout
- [x] `getComputedLayout()`
- [x] `getComputedLeft/Top/Right/Bottom/Width/Height()`
- [x] `getComputedBorder/Margin/Padding()`

### Style Setters
- [x] `setDirection()` / `setFlexDirection()`
- [x] `setJustifyContent()` / `setAlignContent()` / `setAlignItems()` / `setAlignSelf()`
- [x] `setPositionType()` / `setFlexWrap()` / `setOverflow()` / `setDisplay()`
- [x] `setFlex()` / `getFlex()` / `setFlexGrow()` / `setFlexShrink()`
- [x] `setFlexBasis()` / `setFlexBasisPercent()` / `setFlexBasisAuto()`
- [x] `setPosition()` / `setPositionPercent()` / `setPositionAuto()`
- [x] `setMargin()` / `setMarginPercent()` / `setMarginAuto()`
- [x] `setPadding()` / `setPaddingPercent()`
- [x] `setBorder()` / `getBorder()`
- [x] `setGap()` / `setGapPercent()`
- [x] `setWidth/Height()` + Percent/Auto variants
- [x] `setMin/MaxWidth/Height()` + Percent variants
- [x] `setAspectRatio()` / `getAspectRatio()`

### Style Getters
- [x] `getDirection()` / `getFlexDirection()`
- [x] `getJustifyContent()` / `getAlignContent()` / `getAlignItems()` / `getAlignSelf()`
- [x] `getPositionType()` / `getFlexWrap()` / `getOverflow()` / `getDisplay()`
- [x] `getFlexGrow()` / `getFlexShrink()`

### Enums/Constants
- [x] All Direction, FlexDirection, Justify, Align values
- [x] All Edge, Wrap, Overflow, Display, PositionType values
- [x] All Gutter, Unit, MeasureMode values

## Completed Features

All yoga-layout API features are now implemented:
- [x] `setMeasureFunc()` - Uses trampoline pattern for ARM64 ABI compatibility
- [x] `setBaselineFunc()` - Uses trampoline pattern for ARM64 ABI compatibility  
- [x] `setDirtiedFunc()` - Standard JSCallback implementation
- [x] Style value getters returning `{unit, value}` - Uses packed u64 for FFI struct returns

## OpenTUI Compatibility

Full compatibility with [sst/opentui](https://github.com/sst/opentui) - all methods used by OpenTUI are implemented including `setMeasureFunc()` for text measurement.

| Feature | Status |
|---------|--------|
| Basic layout | ✅ Ready |
| Child management | ✅ Ready |
| Layout calculation | ✅ Ready |
| Text measurement | ✅ Ready |

## Build Commands
```bash
zig build                        # Debug build
zig build -Doptimize=ReleaseFast # Release build
zig build test                   # Run Zig tests
bun run bench.ts                 # Run benchmark
```

## Output
- `zig-out/lib/libyoga.dylib` - Dynamic library for FFI
