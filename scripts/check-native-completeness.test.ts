import { describe, expect, test } from "bun:test";
import { extractEnumToString, extractFunctions } from "./check-native-completeness";

describe("check-native-completeness helpers", () => {
  test("extractFunctions handles multi-token return types", () => {
    const content = "YG_EXPORT const char* YGAlignToString(YGAlign value);";
    expect(extractFunctions(content)).toEqual(["YGAlignToString"]);
  });

  test("extractFunctions handles line breaks before the name", () => {
    const content =
      "YG_EXPORT void\nYGNodeSetChildren(YGNodeRef owner, const YGNodeRef* children, size_t count);";
    expect(extractFunctions(content)).toEqual(["YGNodeSetChildren"]);
  });

  test("extractEnumToString detects enum ToString declarations", () => {
    const content = `YG_ENUM_DECL(
  YGUnit,
  YGUnitUndefined,
  YGUnitPoint
)`;
    expect(extractEnumToString(content)).toEqual(["YGUnitToString"]);
  });
});
