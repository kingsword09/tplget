import { Context, Effect, Layer } from "effect";

export class BaseUrl extends Context.Tag("BaseUrl")<BaseUrl, string>() {
  static readonly JsrLive = Layer.effect(this, Effect.promise(() => Promise.resolve("https://npm.jsr.io/@jsr")));
}

export class BuildApiUrl extends Context.Tag("BuildApiUrl")<BuildApiUrl, ({ path }: { path: string; }) => string>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function*() {
      const baseUrl = yield* BaseUrl;
      return ({ path }) => `${baseUrl}/${path}`;
    }),
  );
}
