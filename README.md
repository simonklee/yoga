# Yoga bindings

Fast Bun FFI bindings for Facebook's [Yoga](https://yogalayout.dev/) layout
engine, providing a `yoga-layout` compatible API built on Zig.

## Supported Platforms

Pre-built binaries are included in the npm package for:

| Platform | Architecture          | Binary          |
| -------- | --------------------- | --------------- |
| macOS    | ARM64 (Apple Silicon) | `libyoga.dylib` |
| macOS    | x64 (Intel)           | `libyoga.dylib` |
| Linux    | x64                   | `libyoga.so`    |
| Linux    | ARM64                 | `libyoga.so`    |
| Windows  | x64                   | `yoga.dll`      |

The correct binary is automatically loaded at runtime based on your platform.

## Installation

```bash
bun add @simonklee/yoga
```

## Usage

```typescript
import Yoga, { Node, Config, Edge, FlexDirection } from "@simonklee/yoga";

const config = Config.create();
const root = Node.create(config);

root.setFlexDirection(FlexDirection.Column);
root.setWidth(100);
root.setHeight(100);

const child = Node.create(config);
child.setFlexGrow(1);
root.insertChild(child, 0);

root.calculateLayout(100, 100);
console.log(root.getComputedLayout());
// { left: 0, top: 0, right: 0, bottom: 0, width: 100, height: 100 }

root.freeRecursive();
config.free();
```

## API

The API mirrors [yoga-layout](https://www.npmjs.com/package/yoga-layout). All enums, constants, and methods are compatible.

## Building from source

Requirements: Bun and Zig 0.15.1+.

```bash
# Build the native library (debug)
zig build

# Build the native library (release)
zig build -Doptimize=ReleaseFast

# Build TypeScript to dist/
bun run build

# Tests
zig build test
bun test
```

## Benchmarks

```bash
bun run bench
```

## Development notes

- `src/yoga_ffi.zig` exposes Yoga's C API via Zig `export fn`.
- `src/index.ts` uses `bun:ffi` and prefers a local `zig-out` library when present,
  falling back to the platform-specific binary in `dist/`.

## License

MIT
