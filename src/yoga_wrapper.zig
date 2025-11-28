const std = @import("std");
const yoga = @import("yoga-zig");

// Re-export yoga types for convenience
pub const Node = yoga.Node;
pub const Config = yoga.Config;
pub const enums = yoga.enums;
pub const Layout = yoga.Layout;
pub const Value = yoga.Value;

// Value struct for JS (with u32 unit for napigen compatibility)
pub const JsValue = struct {
    value: f32,
    unit: u32,
};

// Helper to convert Value to JsValue
fn toJsValue(v: Value) JsValue {
    return JsValue{
        .value = v.value,
        .unit = @intFromEnum(v.unit),
    };
}

// Simple test function to verify NAPI is working
pub fn add(a: i32, b: i32) i32 {
    return a + b;
}

// ============================================================================
// Node Creation/Destruction
// ============================================================================

pub fn nodeCreate() ?*anyopaque {
    const node = Node.new();
    return @ptrCast(node.handle);
}

pub fn nodeFree(ptr: ?*anyopaque) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.free();
    }
}

pub fn nodeFreeRecursive(ptr: ?*anyopaque) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.freeRecursive();
    }
}

pub fn nodeReset(ptr: ?*anyopaque) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.reset();
    }
}

// ============================================================================
// Child Management
// ============================================================================

pub fn nodeInsertChild(parentPtr: ?*anyopaque, childPtr: ?*anyopaque, index: u32) void {
    if (parentPtr) |pp| {
        if (childPtr) |cp| {
            const parent = Node{ .handle = @ptrCast(pp) };
            const child = Node{ .handle = @ptrCast(cp) };
            parent.insertChild(child, index);
        }
    }
}

pub fn nodeRemoveChild(parentPtr: ?*anyopaque, childPtr: ?*anyopaque) void {
    if (parentPtr) |pp| {
        if (childPtr) |cp| {
            const parent = Node{ .handle = @ptrCast(pp) };
            const child = Node{ .handle = @ptrCast(cp) };
            parent.removeChild(child);
        }
    }
}

pub fn nodeGetChildCount(ptr: ?*anyopaque) u32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return @intCast(node.getChildCount());
    }
    return 0;
}

pub fn nodeGetChild(ptr: ?*anyopaque, index: u32) ?*anyopaque {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        const child = node.getChild(index);
        return @ptrCast(child.handle);
    }
    return null;
}

pub fn nodeGetParent(ptr: ?*anyopaque) ?*anyopaque {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        if (node.getParent()) |parent| {
            return @ptrCast(parent.handle);
        }
    }
    return null;
}

// ============================================================================
// Layout Calculation
// ============================================================================

pub fn nodeCalculateLayout(ptr: ?*anyopaque, width: f32, height: f32, direction: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        const w: ?f32 = if (width < 0) null else width;
        const h: ?f32 = if (height < 0) null else height;
        node.calculateLayout(w, h, @enumFromInt(direction));
    }
}

// ============================================================================
// Computed Layout Getters
// ============================================================================

pub fn nodeGetComputedLayout(ptr: ?*anyopaque) Layout {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedLayout();
    }
    return Layout{ .left = 0, .right = 0, .top = 0, .bottom = 0, .width = 0, .height = 0 };
}

pub fn nodeGetComputedWidth(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedWidth();
    }
    return 0;
}

pub fn nodeGetComputedHeight(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedHeight();
    }
    return 0;
}

pub fn nodeGetComputedLeft(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedLeft();
    }
    return 0;
}

pub fn nodeGetComputedTop(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedTop();
    }
    return 0;
}

pub fn nodeGetComputedRight(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedRight();
    }
    return 0;
}

pub fn nodeGetComputedBottom(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedBottom();
    }
    return 0;
}

pub fn nodeGetComputedBorder(ptr: ?*anyopaque, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedBorder(@enumFromInt(edge));
    }
    return 0;
}

pub fn nodeGetComputedMargin(ptr: ?*anyopaque, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedMargin(@enumFromInt(edge));
    }
    return 0;
}

pub fn nodeGetComputedPadding(ptr: ?*anyopaque, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getComputedPadding(@enumFromInt(edge));
    }
    return 0;
}

// ============================================================================
// Dirty State
// ============================================================================

pub fn nodeIsDirty(ptr: ?*anyopaque) bool {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.isDirty();
    }
    return false;
}

pub fn nodeMarkDirty(ptr: ?*anyopaque) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.markDirty();
    }
}

pub fn nodeIsReferenceBaseline(ptr: ?*anyopaque) bool {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.isReferenceBaseline();
    }
    return false;
}

// ============================================================================
// Style Getters
// ============================================================================

pub fn nodeGetFlexGrow(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getFlexGrow();
    }
    return 0;
}

pub fn nodeGetFlexShrink(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getFlexShrink();
    }
    return 0;
}

pub fn nodeGetAspectRatio(ptr: ?*anyopaque) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getAspectRatio();
    }
    return 0;
}

pub fn nodeGetBorder(ptr: ?*anyopaque, edge: u32) f32 {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        return node.getBorder(@enumFromInt(edge));
    }
    return 0;
}

// ============================================================================
// Style Setters
// ============================================================================

pub fn nodeSetDirection(ptr: ?*anyopaque, direction: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setDirection(@enumFromInt(direction));
    }
}

pub fn nodeSetFlexDirection(ptr: ?*anyopaque, direction: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexDirection(@enumFromInt(direction));
    }
}

pub fn nodeSetJustifyContent(ptr: ?*anyopaque, justify: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setJustifyContent(@enumFromInt(justify));
    }
}

pub fn nodeSetAlignContent(ptr: ?*anyopaque, align_content: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAlignContent(@enumFromInt(align_content));
    }
}

pub fn nodeSetAlignItems(ptr: ?*anyopaque, align_items: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAlignItems(@enumFromInt(align_items));
    }
}

pub fn nodeSetAlignSelf(ptr: ?*anyopaque, align_self: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAlignSelf(@enumFromInt(align_self));
    }
}

pub fn nodeSetPositionType(ptr: ?*anyopaque, position_type: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPositionType(@enumFromInt(position_type));
    }
}

pub fn nodeSetFlexWrap(ptr: ?*anyopaque, wrap: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexWrap(@enumFromInt(wrap));
    }
}

pub fn nodeSetOverflow(ptr: ?*anyopaque, overflow: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setOverflow(@enumFromInt(overflow));
    }
}

pub fn nodeSetDisplay(ptr: ?*anyopaque, display: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setDisplay(@enumFromInt(display));
    }
}

pub fn nodeSetBoxSizing(ptr: ?*anyopaque, box_sizing: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setBoxSizing(@enumFromInt(box_sizing));
    }
}

pub fn nodeSetFlex(ptr: ?*anyopaque, flex: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlex(flex);
    }
}

pub fn nodeSetFlexGrow(ptr: ?*anyopaque, grow: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexGrow(grow);
    }
}

pub fn nodeSetFlexShrink(ptr: ?*anyopaque, shrink: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexShrink(shrink);
    }
}

pub fn nodeSetFlexBasisPercent(ptr: ?*anyopaque, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexBasisPercent(percent);
    }
}

pub fn nodeSetFlexBasisAuto(ptr: ?*anyopaque) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setFlexBasisAuto();
    }
}

pub fn nodeSetWidth(ptr: ?*anyopaque, width: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setWidth(width);
    }
}

pub fn nodeSetWidthPercent(ptr: ?*anyopaque, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setWidthPercent(percent);
    }
}

pub fn nodeSetWidthAuto(ptr: ?*anyopaque) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setWidthAuto();
    }
}

pub fn nodeSetHeight(ptr: ?*anyopaque, height: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setHeight(height);
    }
}

pub fn nodeSetHeightPercent(ptr: ?*anyopaque, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setHeightPercent(percent);
    }
}

pub fn nodeSetHeightAuto(ptr: ?*anyopaque) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setHeightAuto();
    }
}

pub fn nodeSetMinWidth(ptr: ?*anyopaque, min_width: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMinWidth(min_width);
    }
}

pub fn nodeSetMinWidthPercent(ptr: ?*anyopaque, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMinWidthPercent(percent);
    }
}

pub fn nodeSetMinHeight(ptr: ?*anyopaque, min_height: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMinHeight(min_height);
    }
}

pub fn nodeSetMinHeightPercent(ptr: ?*anyopaque, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMinHeightPercent(percent);
    }
}

pub fn nodeSetMaxWidth(ptr: ?*anyopaque, max_width: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMaxWidth(max_width);
    }
}

pub fn nodeSetMaxWidthPercent(ptr: ?*anyopaque, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMaxWidthPercent(percent);
    }
}

pub fn nodeSetMaxHeight(ptr: ?*anyopaque, max_height: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMaxHeight(max_height);
    }
}

pub fn nodeSetMaxHeightPercent(ptr: ?*anyopaque, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMaxHeightPercent(percent);
    }
}

pub fn nodeSetAspectRatio(ptr: ?*anyopaque, aspect_ratio: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAspectRatio(aspect_ratio);
    }
}

pub fn nodeSetMargin(ptr: ?*anyopaque, edge: u32, margin: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMargin(@enumFromInt(edge), margin);
    }
}

pub fn nodeSetMarginPercent(ptr: ?*anyopaque, edge: u32, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMarginPercent(@enumFromInt(edge), percent);
    }
}

pub fn nodeSetMarginAuto(ptr: ?*anyopaque, edge: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setMarginAuto(@enumFromInt(edge));
    }
}

pub fn nodeSetPadding(ptr: ?*anyopaque, edge: u32, padding: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPadding(@enumFromInt(edge), padding);
    }
}

pub fn nodeSetPaddingPercent(ptr: ?*anyopaque, edge: u32, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPaddingPercent(@enumFromInt(edge), percent);
    }
}

pub fn nodeSetBorder(ptr: ?*anyopaque, edge: u32, border: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setBorder(@enumFromInt(edge), border);
    }
}

pub fn nodeSetPosition(ptr: ?*anyopaque, edge: u32, position: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPosition(@enumFromInt(edge), position);
    }
}

pub fn nodeSetPositionPercent(ptr: ?*anyopaque, edge: u32, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPositionPercent(@enumFromInt(edge), percent);
    }
}

pub fn nodeSetPositionAuto(ptr: ?*anyopaque, edge: u32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setPositionAuto(@enumFromInt(edge));
    }
}

pub fn nodeSetGap(ptr: ?*anyopaque, gutter: u32, gap: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setGap(@enumFromInt(gutter), gap);
    }
}

pub fn nodeSetGapPercent(ptr: ?*anyopaque, gutter: u32, percent: f32) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setGapPercent(@enumFromInt(gutter), percent);
    }
}

pub fn nodeSetAlwaysFormsContainingBlock(ptr: ?*anyopaque, always: bool) void {
    if (ptr) |p| {
        const node = Node{ .handle = @ptrCast(p) };
        node.setAlwaysFormsContainerBlock(always);
    }
}

// ============================================================================
// Tests
// ============================================================================

test "basic yoga test" {
    const root = Node.new();
    defer root.free();

    root.setFlexDirection(enums.FlexDirection.Row);
    root.setWidth(100);
    root.setHeight(100);

    const child0 = Node.new();
    defer child0.free();
    child0.setFlexGrow(1);
    child0.setMargin(enums.Edge.Right, 10);
    root.insertChild(child0, 0);

    const child1 = Node.new();
    defer child1.free();
    child1.setFlexGrow(1);
    root.insertChild(child1, 1);

    root.calculateLayout(null, null, enums.Direction.LTR);

    const child0Width = child0.getComputedWidth();
    const child1Width = child1.getComputedWidth();

    // With flex grow 1 each and 10px margin, children should split 90px (100-10)
    try std.testing.expectApproxEqAbs(@as(f32, 45), child0Width, 0.1);
    try std.testing.expectApproxEqAbs(@as(f32, 45), child1Width, 0.1);
}
