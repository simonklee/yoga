## Project Overview

`@simonklee/yoga` is a Bun FFI wrapper around Facebook's Yoga layout engine. Zig builds a
dynamic library from Yoga's C/C++ sources, and `src/index.ts` loads it via
`bun:ffi` to expose a `yoga-layout` compatible API (`Node`, `Config`, enums).

## Key Paths

- `src/yoga_ffi.zig`: Zig FFI exports (C ABI) + tests.
- `src/index.ts`: TypeScript bindings, runtime loader, Node/Config classes.
- `build.zig` / `build.zig.zon`: Zig build and Yoga dependency.
- `scripts/`: API completeness checks and compile helpers.
- `progress.md`: project decisions and progress notes.
- `CHANGELOG.md` + `package.json`: versioning and release notes.

## Commands

Native build:

```bash
zig build                       # Debug build (required at start of work)
zig build -Doptimize=ReleaseFast # Release build
bun run build:zig                # Release build via package.json
bun run build:zig:dev            # Debug build via package.json
```

TypeScript build:

```bash
bun run build                    # tsc -> dist/
```

Tests:

```bash
zig build test                   # Zig tests
bun test                         # Bun tests (includes .test.ts in scripts/)
```

Bench:

```bash
bun run bench
bun run bench.ts                 # Direct file execution (optional)
```

Manual helpers (not wired to npm scripts):

```bash
bun run scripts/check-completeness.ts
bun run scripts/check-native-completeness.ts
bun run scripts/test-compile.ts
```

## Workflow Requirements

- Always start by running `zig build` to ensure no stale binaries.
- Reproduce every bug with a `zig build test` or `bun test` before fixing it.
- After meaningful changes: update `CHANGELOG.md` and bump `package.json` version.

## GitHub File Lookup

Use `curl gitchamber.com` to list, read, and search GitHub files when needed.

## Publishing (Do Not Do Locally)

NEVER run `npm publish` locally. CI handles publishing on push to main. Local
publishing causes issues because:

- The `dist/` folder may have outdated or missing binaries for other platforms
- CI builds fresh binaries for all platforms (darwin-arm64, darwin-x64, linux-arm64, linux-x64)
- Publishing locally with stale binaries breaks the package for users

When you make a change:

1. Bump the package.json version
2. Update CHANGELOG.md
3. Commit and push to main
4. CI will build and publish automatically
