import OfficialYoga from "yoga-layout";
import LocalYoga, { Node, Config } from "../src/index";

function getMethods(proto: object): string[] {
  return Object.getOwnPropertyNames(proto).filter(
    (k) => k !== "constructor" && !k.startsWith("_")
  );
}

function diff(official: string[], local: string[]): string[] {
  const set = new Set(local);
  return official.filter((k) => !set.has(k));
}

const excludeBuiltins = (k: string) =>
  k !== "Node" && k !== "Config" && k !== "default";

const missingExports = diff(
  Object.keys(OfficialYoga).filter(excludeBuiltins),
  Object.keys(LocalYoga).filter(excludeBuiltins)
);

const missingNodeMethods = diff(
  getMethods(OfficialYoga.Node.prototype),
  getMethods(Node.prototype)
);

const missingConfigMethods = diff(
  getMethods(OfficialYoga.Config.prototype),
  getMethods(Config.prototype)
);

let ok = true;

if (missingExports.length > 0) {
  console.log("Missing exports:");
  missingExports.forEach((k) => console.log(`  ${k}`));
  ok = false;
}

if (missingNodeMethods.length > 0) {
  console.log("Missing Node methods:");
  missingNodeMethods.forEach((k) => console.log(`  ${k}`));
  ok = false;
}

if (missingConfigMethods.length > 0) {
  console.log("Missing Config methods:");
  missingConfigMethods.forEach((k) => console.log(`  ${k}`));
  ok = false;
}

if (ok) {
  console.log("Complete");
} else {
  process.exit(1);
}
