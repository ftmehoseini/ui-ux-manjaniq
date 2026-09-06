/**
 * Side-effect stylesheet imports.
 *
 * Next's bundler handles these, but the TypeScript version this project pins
 * does not infer a type for them, so they are declared here rather than
 * loosening `strict` or adding a compiler escape hatch.
 */
declare module "*.css";
