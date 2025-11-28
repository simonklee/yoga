const std = @import("std");
const napigen = @import("napigen");
const wrapper = @import("yoga_wrapper.zig");

// Define the N-API module
comptime {
    napigen.defineModule(initModule);
}

fn initModule(js: *napigen.JsContext, exports: napigen.napi_value) anyerror!napigen.napi_value {
    // Basic test function
    try js.setNamedProperty(exports, "add", try js.createFunction(wrapper.add));

    // ========================================================================
    // Node Creation/Destruction
    // ========================================================================
    try js.setNamedProperty(exports, "nodeCreate", try js.createFunction(wrapper.nodeCreate));
    try js.setNamedProperty(exports, "nodeFree", try js.createFunction(wrapper.nodeFree));
    try js.setNamedProperty(exports, "nodeFreeRecursive", try js.createFunction(wrapper.nodeFreeRecursive));
    try js.setNamedProperty(exports, "nodeReset", try js.createFunction(wrapper.nodeReset));

    // ========================================================================
    // Child Management
    // ========================================================================
    try js.setNamedProperty(exports, "nodeInsertChild", try js.createFunction(wrapper.nodeInsertChild));
    try js.setNamedProperty(exports, "nodeRemoveChild", try js.createFunction(wrapper.nodeRemoveChild));
    try js.setNamedProperty(exports, "nodeGetChildCount", try js.createFunction(wrapper.nodeGetChildCount));
    try js.setNamedProperty(exports, "nodeGetChild", try js.createFunction(wrapper.nodeGetChild));
    try js.setNamedProperty(exports, "nodeGetParent", try js.createFunction(wrapper.nodeGetParent));

    // ========================================================================
    // Layout Calculation
    // ========================================================================
    try js.setNamedProperty(exports, "nodeCalculateLayout", try js.createFunction(wrapper.nodeCalculateLayout));

    // ========================================================================
    // Computed Layout Getters
    // ========================================================================
    try js.setNamedProperty(exports, "nodeGetComputedLayout", try js.createFunction(wrapper.nodeGetComputedLayout));
    try js.setNamedProperty(exports, "nodeGetComputedWidth", try js.createFunction(wrapper.nodeGetComputedWidth));
    try js.setNamedProperty(exports, "nodeGetComputedHeight", try js.createFunction(wrapper.nodeGetComputedHeight));
    try js.setNamedProperty(exports, "nodeGetComputedLeft", try js.createFunction(wrapper.nodeGetComputedLeft));
    try js.setNamedProperty(exports, "nodeGetComputedTop", try js.createFunction(wrapper.nodeGetComputedTop));
    try js.setNamedProperty(exports, "nodeGetComputedRight", try js.createFunction(wrapper.nodeGetComputedRight));
    try js.setNamedProperty(exports, "nodeGetComputedBottom", try js.createFunction(wrapper.nodeGetComputedBottom));
    try js.setNamedProperty(exports, "nodeGetComputedBorder", try js.createFunction(wrapper.nodeGetComputedBorder));
    try js.setNamedProperty(exports, "nodeGetComputedMargin", try js.createFunction(wrapper.nodeGetComputedMargin));
    try js.setNamedProperty(exports, "nodeGetComputedPadding", try js.createFunction(wrapper.nodeGetComputedPadding));

    // ========================================================================
    // Dirty State
    // ========================================================================
    try js.setNamedProperty(exports, "nodeIsDirty", try js.createFunction(wrapper.nodeIsDirty));
    try js.setNamedProperty(exports, "nodeMarkDirty", try js.createFunction(wrapper.nodeMarkDirty));
    try js.setNamedProperty(exports, "nodeIsReferenceBaseline", try js.createFunction(wrapper.nodeIsReferenceBaseline));

    // ========================================================================
    // Style Getters
    // ========================================================================
    try js.setNamedProperty(exports, "nodeGetFlexGrow", try js.createFunction(wrapper.nodeGetFlexGrow));
    try js.setNamedProperty(exports, "nodeGetFlexShrink", try js.createFunction(wrapper.nodeGetFlexShrink));
    try js.setNamedProperty(exports, "nodeGetAspectRatio", try js.createFunction(wrapper.nodeGetAspectRatio));
    try js.setNamedProperty(exports, "nodeGetBorder", try js.createFunction(wrapper.nodeGetBorder));

    // ========================================================================
    // Style Setters
    // ========================================================================
    try js.setNamedProperty(exports, "nodeSetDirection", try js.createFunction(wrapper.nodeSetDirection));
    try js.setNamedProperty(exports, "nodeSetFlexDirection", try js.createFunction(wrapper.nodeSetFlexDirection));
    try js.setNamedProperty(exports, "nodeSetJustifyContent", try js.createFunction(wrapper.nodeSetJustifyContent));
    try js.setNamedProperty(exports, "nodeSetAlignContent", try js.createFunction(wrapper.nodeSetAlignContent));
    try js.setNamedProperty(exports, "nodeSetAlignItems", try js.createFunction(wrapper.nodeSetAlignItems));
    try js.setNamedProperty(exports, "nodeSetAlignSelf", try js.createFunction(wrapper.nodeSetAlignSelf));
    try js.setNamedProperty(exports, "nodeSetPositionType", try js.createFunction(wrapper.nodeSetPositionType));
    try js.setNamedProperty(exports, "nodeSetFlexWrap", try js.createFunction(wrapper.nodeSetFlexWrap));
    try js.setNamedProperty(exports, "nodeSetOverflow", try js.createFunction(wrapper.nodeSetOverflow));
    try js.setNamedProperty(exports, "nodeSetDisplay", try js.createFunction(wrapper.nodeSetDisplay));
    try js.setNamedProperty(exports, "nodeSetBoxSizing", try js.createFunction(wrapper.nodeSetBoxSizing));
    try js.setNamedProperty(exports, "nodeSetFlex", try js.createFunction(wrapper.nodeSetFlex));
    try js.setNamedProperty(exports, "nodeSetFlexGrow", try js.createFunction(wrapper.nodeSetFlexGrow));
    try js.setNamedProperty(exports, "nodeSetFlexShrink", try js.createFunction(wrapper.nodeSetFlexShrink));
    try js.setNamedProperty(exports, "nodeSetFlexBasisPercent", try js.createFunction(wrapper.nodeSetFlexBasisPercent));
    try js.setNamedProperty(exports, "nodeSetFlexBasisAuto", try js.createFunction(wrapper.nodeSetFlexBasisAuto));
    try js.setNamedProperty(exports, "nodeSetWidth", try js.createFunction(wrapper.nodeSetWidth));
    try js.setNamedProperty(exports, "nodeSetWidthPercent", try js.createFunction(wrapper.nodeSetWidthPercent));
    try js.setNamedProperty(exports, "nodeSetWidthAuto", try js.createFunction(wrapper.nodeSetWidthAuto));
    try js.setNamedProperty(exports, "nodeSetHeight", try js.createFunction(wrapper.nodeSetHeight));
    try js.setNamedProperty(exports, "nodeSetHeightPercent", try js.createFunction(wrapper.nodeSetHeightPercent));
    try js.setNamedProperty(exports, "nodeSetHeightAuto", try js.createFunction(wrapper.nodeSetHeightAuto));
    try js.setNamedProperty(exports, "nodeSetMinWidth", try js.createFunction(wrapper.nodeSetMinWidth));
    try js.setNamedProperty(exports, "nodeSetMinWidthPercent", try js.createFunction(wrapper.nodeSetMinWidthPercent));
    try js.setNamedProperty(exports, "nodeSetMinHeight", try js.createFunction(wrapper.nodeSetMinHeight));
    try js.setNamedProperty(exports, "nodeSetMinHeightPercent", try js.createFunction(wrapper.nodeSetMinHeightPercent));
    try js.setNamedProperty(exports, "nodeSetMaxWidth", try js.createFunction(wrapper.nodeSetMaxWidth));
    try js.setNamedProperty(exports, "nodeSetMaxWidthPercent", try js.createFunction(wrapper.nodeSetMaxWidthPercent));
    try js.setNamedProperty(exports, "nodeSetMaxHeight", try js.createFunction(wrapper.nodeSetMaxHeight));
    try js.setNamedProperty(exports, "nodeSetMaxHeightPercent", try js.createFunction(wrapper.nodeSetMaxHeightPercent));
    try js.setNamedProperty(exports, "nodeSetAspectRatio", try js.createFunction(wrapper.nodeSetAspectRatio));
    try js.setNamedProperty(exports, "nodeSetMargin", try js.createFunction(wrapper.nodeSetMargin));
    try js.setNamedProperty(exports, "nodeSetMarginPercent", try js.createFunction(wrapper.nodeSetMarginPercent));
    try js.setNamedProperty(exports, "nodeSetMarginAuto", try js.createFunction(wrapper.nodeSetMarginAuto));
    try js.setNamedProperty(exports, "nodeSetPadding", try js.createFunction(wrapper.nodeSetPadding));
    try js.setNamedProperty(exports, "nodeSetPaddingPercent", try js.createFunction(wrapper.nodeSetPaddingPercent));
    try js.setNamedProperty(exports, "nodeSetBorder", try js.createFunction(wrapper.nodeSetBorder));
    try js.setNamedProperty(exports, "nodeSetPosition", try js.createFunction(wrapper.nodeSetPosition));
    try js.setNamedProperty(exports, "nodeSetPositionPercent", try js.createFunction(wrapper.nodeSetPositionPercent));
    try js.setNamedProperty(exports, "nodeSetPositionAuto", try js.createFunction(wrapper.nodeSetPositionAuto));
    try js.setNamedProperty(exports, "nodeSetGap", try js.createFunction(wrapper.nodeSetGap));
    try js.setNamedProperty(exports, "nodeSetGapPercent", try js.createFunction(wrapper.nodeSetGapPercent));
    try js.setNamedProperty(exports, "nodeSetAlwaysFormsContainingBlock", try js.createFunction(wrapper.nodeSetAlwaysFormsContainingBlock));

    // ========================================================================
    // Enum Constants - Direction
    // ========================================================================
    try js.setNamedProperty(exports, "DIRECTION_INHERIT", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "DIRECTION_LTR", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "DIRECTION_RTL", try js.write(@as(u32, 2)));

    // ========================================================================
    // Enum Constants - FlexDirection
    // ========================================================================
    try js.setNamedProperty(exports, "FLEX_DIRECTION_COLUMN", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "FLEX_DIRECTION_COLUMN_REVERSE", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "FLEX_DIRECTION_ROW", try js.write(@as(u32, 2)));
    try js.setNamedProperty(exports, "FLEX_DIRECTION_ROW_REVERSE", try js.write(@as(u32, 3)));

    // ========================================================================
    // Enum Constants - Justify
    // ========================================================================
    try js.setNamedProperty(exports, "JUSTIFY_FLEX_START", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "JUSTIFY_CENTER", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "JUSTIFY_FLEX_END", try js.write(@as(u32, 2)));
    try js.setNamedProperty(exports, "JUSTIFY_SPACE_BETWEEN", try js.write(@as(u32, 3)));
    try js.setNamedProperty(exports, "JUSTIFY_SPACE_AROUND", try js.write(@as(u32, 4)));
    try js.setNamedProperty(exports, "JUSTIFY_SPACE_EVENLY", try js.write(@as(u32, 5)));

    // ========================================================================
    // Enum Constants - Align
    // ========================================================================
    try js.setNamedProperty(exports, "ALIGN_AUTO", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "ALIGN_FLEX_START", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "ALIGN_CENTER", try js.write(@as(u32, 2)));
    try js.setNamedProperty(exports, "ALIGN_FLEX_END", try js.write(@as(u32, 3)));
    try js.setNamedProperty(exports, "ALIGN_STRETCH", try js.write(@as(u32, 4)));
    try js.setNamedProperty(exports, "ALIGN_BASELINE", try js.write(@as(u32, 5)));
    try js.setNamedProperty(exports, "ALIGN_SPACE_BETWEEN", try js.write(@as(u32, 6)));
    try js.setNamedProperty(exports, "ALIGN_SPACE_AROUND", try js.write(@as(u32, 7)));
    try js.setNamedProperty(exports, "ALIGN_SPACE_EVENLY", try js.write(@as(u32, 8)));

    // ========================================================================
    // Enum Constants - Edge
    // ========================================================================
    try js.setNamedProperty(exports, "EDGE_LEFT", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "EDGE_TOP", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "EDGE_RIGHT", try js.write(@as(u32, 2)));
    try js.setNamedProperty(exports, "EDGE_BOTTOM", try js.write(@as(u32, 3)));
    try js.setNamedProperty(exports, "EDGE_START", try js.write(@as(u32, 4)));
    try js.setNamedProperty(exports, "EDGE_END", try js.write(@as(u32, 5)));
    try js.setNamedProperty(exports, "EDGE_HORIZONTAL", try js.write(@as(u32, 6)));
    try js.setNamedProperty(exports, "EDGE_VERTICAL", try js.write(@as(u32, 7)));
    try js.setNamedProperty(exports, "EDGE_ALL", try js.write(@as(u32, 8)));

    // ========================================================================
    // Enum Constants - PositionType
    // ========================================================================
    try js.setNamedProperty(exports, "POSITION_TYPE_STATIC", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "POSITION_TYPE_RELATIVE", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "POSITION_TYPE_ABSOLUTE", try js.write(@as(u32, 2)));

    // ========================================================================
    // Enum Constants - Wrap
    // ========================================================================
    try js.setNamedProperty(exports, "WRAP_NO_WRAP", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "WRAP_WRAP", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "WRAP_WRAP_REVERSE", try js.write(@as(u32, 2)));

    // ========================================================================
    // Enum Constants - Overflow
    // ========================================================================
    try js.setNamedProperty(exports, "OVERFLOW_VISIBLE", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "OVERFLOW_HIDDEN", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "OVERFLOW_SCROLL", try js.write(@as(u32, 2)));

    // ========================================================================
    // Enum Constants - Display
    // ========================================================================
    try js.setNamedProperty(exports, "DISPLAY_FLEX", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "DISPLAY_NONE", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "DISPLAY_CONTENTS", try js.write(@as(u32, 2)));

    // ========================================================================
    // Enum Constants - Unit
    // ========================================================================
    try js.setNamedProperty(exports, "UNIT_UNDEFINED", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "UNIT_POINT", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "UNIT_PERCENT", try js.write(@as(u32, 2)));
    try js.setNamedProperty(exports, "UNIT_AUTO", try js.write(@as(u32, 3)));

    // ========================================================================
    // Enum Constants - Gutter
    // ========================================================================
    try js.setNamedProperty(exports, "GUTTER_COLUMN", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "GUTTER_ROW", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "GUTTER_ALL", try js.write(@as(u32, 2)));

    // ========================================================================
    // Enum Constants - BoxSizing
    // ========================================================================
    try js.setNamedProperty(exports, "BOX_SIZING_BORDER_BOX", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "BOX_SIZING_CONTENT_BOX", try js.write(@as(u32, 1)));

    // ========================================================================
    // Enum Constants - MeasureMode
    // ========================================================================
    try js.setNamedProperty(exports, "MEASURE_MODE_UNDEFINED", try js.write(@as(u32, 0)));
    try js.setNamedProperty(exports, "MEASURE_MODE_EXACTLY", try js.write(@as(u32, 1)));
    try js.setNamedProperty(exports, "MEASURE_MODE_AT_MOST", try js.write(@as(u32, 2)));

    return exports;
}
