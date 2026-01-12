# bun-yoga

A fast FFI wrapper for Facebook's [Yoga](https://yogalayout.dev/) layout
engine, providing a `yoga-layout` compatible API for Bun.

## Why FFI over NAPI?

Benchmarks showed FFI is faster than NAPI for this use case.

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
bun add bun-yoga
```

## Usage

```typescript
import Yoga, { Node, Config, Edge, FlexDirection } from "bun-yoga";

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

Requires Zig 0.15+:

```bash
zig build -Doptimize=ReleaseFast
```

## License

MIT
