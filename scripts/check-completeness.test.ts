import { describe, expect, test } from "bun:test";
import { getExportNames, getStaticMethods } from "./check-completeness";

describe("check-completeness helpers", () => {
  test("getExportNames includes non-enumerable exports", () => {
    const moduleExports: Record<string, unknown> = {};
    Object.defineProperty(moduleExports, "Hidden", {
      value: 1,
      enumerable: false,
    });
    Object.defineProperty(moduleExports, "Visible", {
      value: 2,
      enumerable: true,
    });

    const names = getExportNames(moduleExports);
    expect(names).toEqual(expect.arrayContaining(["Hidden", "Visible"]));
  });

  test("getStaticMethods includes class statics", () => {
    class Example {
      static create() {}
      static from() {}
    }

    const names = getStaticMethods(Example);
    expect(names).toEqual(expect.arrayContaining(["create", "from"]));
    expect(names).not.toContain("length");
    expect(names).not.toContain("prototype");
  });
});
