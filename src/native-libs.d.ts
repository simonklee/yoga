// Type declarations for binary file imports using Bun's { type: "file" } syntax.
// These imports return the filesystem path to the embedded file.
declare module "*.dylib" {
  const path: string;
  export default path;
}
declare module "*.so" {
  const path: string;
  export default path;
}
declare module "*.dll" {
  const path: string;
  export default path;
}
