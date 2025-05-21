import { Schema } from "effect";

/*
 *  {
 *    "name": "@jsr/kingsword__nodekit",
 *    "version": "0.0.9",
 *    "description": "Node utils package.",
 *    "dist": {
 *      "tarball": "https://npm.jsr.io/~/11/@jsr/kingsword__nodekit/0.0.9.tgz",
 *      "shasum": "217BA8DFE4CA2B3B2739E5426BA70ED86EAB1C1F",
 *      "integrity": "sha512-Y+QAhhwGxVdSoDjQFKNriZCY1w29Hkmyjztusfw/HWl+bHiXaYOTMPSmQ9f6BQraYcMBcBnOkZvSX0tkPyyKrA=="
 *    },
 *    "dependencies": {
 *      "@jsr/std__jsonc": "^1.0.2",
 *      "quansync": "^0.2.10"
 *    }
 *  }
 */
export const JsrPackageVersionStruct = Schema.Struct({
  name: Schema.String,
  version: Schema.String,
  description: Schema.String,
  dist: Schema.Struct({ tarball: Schema.String, shasum: Schema.String, integrity: Schema.String }),
  dependencies: Schema.Record({ key: Schema.String, value: Schema.String }),
});

/**
 * @see {@link https://npm.jsr.io/@jsr/kingsword__nodekit}
 */
export const JsrPackageSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  "dist-tags": Schema.Struct({ latest: Schema.String }),
  versions: Schema.Record({ key: Schema.String, value: JsrPackageVersionStruct }),
  time: Schema.Struct({ created: Schema.String, modified: Schema.String }),
});
