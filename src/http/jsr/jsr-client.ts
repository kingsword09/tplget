import { FetchHttpClient, HttpClientResponse } from "@effect/platform";
import { Context, Layer } from "effect";
import { Effect } from "effect";
import type { StringProcessor } from "../../utils/strings.ts";
import { BaseUrl } from "../../utils/url+effect.ts";
import { makeClient } from "../client.ts";
import { JsrPackageSchema } from "./schema.ts";

class BuildJsrPackagePath extends Context.Tag("BuildJsrPackagePath")<BuildJsrPackagePath, StringProcessor>() {
  static readonly Live = Layer.effect(
    this,
    Effect.promise(() =>
      Promise.resolve<StringProcessor>({
        converter: (input): string => {
          // 具体的实现逻辑
          return input.replace("/", "__").replace("@", "");
        },
      })
    ),
  );
}

class JsrPackageApi extends Context.Tag("JsrPackageApi")<JsrPackageApi, Effect.Effect.Success<typeof makeClient>>() {
  static readonly Live = Layer.effect(this, makeClient).pipe(
    Layer.provide(Layer.mergeAll(FetchHttpClient.layer, BaseUrl.JsrLive)),
  );
}

export const makeJsrPackageRequest = (jsrScopePackage: string) =>
  Effect.gen(function*() {
    const jsr = yield* JsrPackageApi;

    // @kingsword/nodekit => kingsword__nodekit
    const buildJsrPackagePath = yield* BuildJsrPackagePath;
    const path = buildJsrPackagePath.converter(jsrScopePackage);
    const jsrPackage = yield* jsr.client.get(path).pipe(
      Effect.flatMap(HttpClientResponse.schemaBodyJson(JsrPackageSchema)),
    );

    const latestVersion = jsrPackage["dist-tags"].latest;
    const latestPackage = jsrPackage.versions[latestVersion];

    return { jsrScopePackage, jsrLatestPackage: latestPackage } as const;
  });

// Effect.runPromise(
//   makeJsrPackageRequest("@jsr/kingsword__nodekit").pipe(
//     Effect.provide(Layer.mergeAll(BuildJsrPackagePath.Live, JsrPackageApi.Live)),
//   ),
// );

// {
//   "name": "@jsr/kingsword__nodekit",
//   "description": "Node utils package.",
//   "dist-tags": {
//     "latest": "0.0.9"
//   },
//   "versions": {
//     "0.0.9": {
//       "name": "@jsr/kingsword__nodekit",
//       "version": "0.0.9",
//       "description": "Node utils package.",
//       "dist": {
//         "tarball": "https://npm.jsr.io/~/11/@jsr/kingsword__nodekit/0.0.9.tgz",
//         "shasum": "217BA8DFE4CA2B3B2739E5426BA70ED86EAB1C1F",
//         "integrity": "sha512-Y+QAhhwGxVdSoDjQFKNriZCY1w29Hkmyjztusfw/HWl+bHiXaYOTMPSmQ9f6BQraYcMBcBnOkZvSX0tkPyyKrA=="
//       },
//       "dependencies": {
//         "@jsr/std__jsonc": "^1.0.2",
//         "quansync": "^0.2.10"
//       }
//     },
//     "0.0.8": {
//       "name": "@jsr/kingsword__nodekit",
//       "version": "0.0.8",
//       "description": "Node utils package.",
//       "dist": {
//         "tarball": "https://npm.jsr.io/~/11/@jsr/kingsword__nodekit/0.0.8.tgz",
//         "shasum": "6A9C41E0C054B3A3EFC16FF8065ED5C67B36A78E",
//         "integrity": "sha512-tuj/OB1R29tM8cUcGB+4P7Jg3He5mXKr9OmCyw/c12LQjjpn6vDgLvVcYsLkn6DcYic/nibk9p2Axp5BkCpseg=="
//       },
//       "dependencies": {
//         "@jsr/std__jsonc": "^1.0.2",
//         "quansync": "^0.2.10"
//       }
//     },
//     "0.0.7": {
//       "name": "@jsr/kingsword__nodekit",
//       "version": "0.0.7",
//       "description": "Node utils package.",
//       "dist": {
//         "tarball": "https://npm.jsr.io/~/11/@jsr/kingsword__nodekit/0.0.7.tgz",
//         "shasum": "DC2F4A28353D41772A90CB0BB6464C5C4F8A751C",
//         "integrity": "sha512-Lzv0zzxKA/LYfH040EWCCGGF8w/wEXV9VqT2EXJ0OqhPa0CXEY1/FavQwlmyAvS6jH4hC5KDo4LCtBcEdnhesQ=="
//       },
//       "dependencies": {
//         "@jsr/std__jsonc": "^1.0.2",
//         "quansync": "^0.2.10"
//       }
//     }
//   },
//   "time": {
//     "created": "2025-05-04T23:48:25.041Z",
//     "modified": "2025-05-04T23:49:51.987Z",
//     "0.0.9": "2025-05-08T05:57:25.250Z",
//     "0.0.8": "2025-05-08T04:27:20.846Z",
//     "0.0.7": "2025-05-04T23:48:35.027Z"
//   }
// }
