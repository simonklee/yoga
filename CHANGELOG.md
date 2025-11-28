# Changelog

## 0.1.2

- Added Windows x64 support
- Added Bun tests to CI for all platforms (Linux, macOS, Windows)

## 0.1.1

- Fixed ARM64 ABI compatibility for callback functions (`setMeasureFunc`, `setBaselineFunc`)
- Implemented trampoline pattern for measure/baseline callbacks to work around Bun FFI limitations on ARM64
- Added `setDirtiedFunc` callback support
- Added callback context management to support multiple callbacks per node
- Fixed tests to account for Yoga's default flex stretch behavior
- Added baseline function test

## 0.1.0

- Initial release with yoga-layout compatible API
- Bun FFI wrapper for Facebook's Yoga layout engine
- Core layout functionality (flex, padding, margin, border, gap)
- Node and Config classes
