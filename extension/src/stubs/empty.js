// Browser build: transformers.js has Node-only branches (fs/path/url/sharp/
// onnxruntime-node) that are never reached when env.IS_NODE is false. Point them
// at this empty module so esbuild can resolve them instead of emitting a bare
// require() that explodes at runtime.
export default {};
