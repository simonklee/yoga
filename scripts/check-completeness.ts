const excludedExports = new Set(["Node", "Config", "default", "__esModule"]);
const excludedStatics = new Set([
  "length",
  "name",
  "prototype",
  "arguments",
  "caller",
]);

export function getPrototypeMethods(proto: object): string[] {
  return Object.getOwnPropertyNames(proto).filter(
    (k) => k !== "constructor" && !k.startsWith("_")
  );
}

export function getStaticMethods(ctor: Function): string[] {
  return Object.getOwnPropertyNames(ctor).filter(
    (k) => !excludedStatics.has(k) && !k.startsWith("_")
  );
}

export function getExportNames(moduleExports: object): string[] {
  return Object.getOwnPropertyNames(moduleExports).filter(
    (k) => !excludedExports.has(k)
  );
}

export function diff(official: string[], local: string[]): string[] {
  const set = new Set(local);
  return official.filter((k) => !set.has(k));
}

async function main(): Promise<void> {
  const officialModule = await import("yoga-layout");
  const localModule = await import("../src/index");
  const OfficialYoga = officialModule.default;
  const LocalYoga = localModule.default;
  const { Node, Config } = localModule;

  const missingExports = diff(
    getExportNames(OfficialYoga),
    getExportNames(LocalYoga)
  );

  const missingNodeMethods = diff(
    getPrototypeMethods(OfficialYoga.Node.prototype),
    getPrototypeMethods(Node.prototype)
  );

  const missingNodeStatics = diff(
    getStaticMethods(OfficialYoga.Node),
    getStaticMethods(Node)
  );

  const missingConfigMethods = diff(
    getPrototypeMethods(OfficialYoga.Config.prototype),
    getPrototypeMethods(Config.prototype)
  );

  const missingConfigStatics = diff(
    getStaticMethods(OfficialYoga.Config),
    getStaticMethods(Config)
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

  if (missingNodeStatics.length > 0) {
    console.log("Missing Node static methods:");
    missingNodeStatics.forEach((k) => console.log(`  ${k}`));
    ok = false;
  }

  if (missingConfigMethods.length > 0) {
    console.log("Missing Config methods:");
    missingConfigMethods.forEach((k) => console.log(`  ${k}`));
    ok = false;
  }

  if (missingConfigStatics.length > 0) {
    console.log("Missing Config static methods:");
    missingConfigStatics.forEach((k) => console.log(`  ${k}`));
    ok = false;
  }

  if (ok) {
    console.log("Complete");
  } else {
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
