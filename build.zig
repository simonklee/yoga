const std = @import("std");

const CXXFLAGS = .{
    "--std=c++20",
    "-Wall",
    "-Wextra",
    "-Werror",
};

const yoga_files = .{
    "YGConfig.cpp",
    "YGEnums.cpp",
    "YGNode.cpp",
    "YGNodeLayout.cpp",
    "YGNodeStyle.cpp",
    "YGPixelGrid.cpp",
    "YGValue.cpp",
    "algorithm/AbsoluteLayout.cpp",
    "algorithm/Baseline.cpp",
    "algorithm/Cache.cpp",
    "algorithm/CalculateLayout.cpp",
    "algorithm/FlexLine.cpp",
    "algorithm/PixelGrid.cpp",
    "config/Config.cpp",
    "debug/AssertFatal.cpp",
    "debug/Log.cpp",
    "event/event.cpp",
    "node/LayoutResults.cpp",
    "node/Node.cpp",
};

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // Get yoga dependency from Facebook
    const yoga_dep = b.dependency("yoga", .{
        .target = target,
        .optimize = optimize,
    });

    // ========================================================================
    // FFI Library (for Bun FFI)
    // ========================================================================

    const ffi_mod = b.addModule("bun-yoga", .{
        .root_source_file = b.path("src/yoga_ffi.zig"),
        .target = target,
        .optimize = optimize,
        .link_libcpp = true,
    });

    const ffi_lib = b.addLibrary(.{
        .name = "yoga",
        .linkage = .dynamic,
        .root_module = ffi_mod,
    });

    // Compile yoga C++ source files
    ffi_lib.addCSourceFiles(.{
        .root = yoga_dep.path("yoga"),
        .files = &yoga_files,
        .flags = &CXXFLAGS,
    });

    // Install headers for @cImport
    ffi_lib.installHeadersDirectory(yoga_dep.path("yoga"), "yoga", .{
        .include_extensions = &.{".h"},
    });

    // Add include path for yoga headers
    ffi_lib.addIncludePath(yoga_dep.path(""));

    // Build and install
    b.installArtifact(ffi_lib);

    // ========================================================================
    // Tests
    // ========================================================================

    const test_mod = b.addModule("bun-yoga-test", .{
        .root_source_file = b.path("src/yoga_ffi.zig"),
        .target = target,
        .optimize = optimize,
        .link_libcpp = true,
    });

    const lib_unit_tests = b.addTest(.{
        .root_module = test_mod,
    });

    // Add yoga source files for tests too
    lib_unit_tests.addCSourceFiles(.{
        .root = yoga_dep.path("yoga"),
        .files = &yoga_files,
        .flags = &CXXFLAGS,
    });
    lib_unit_tests.addIncludePath(yoga_dep.path(""));

    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);
}
