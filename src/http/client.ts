import { HttpClient, HttpClientRequest } from "@effect/platform";
import { Effect } from "effect";
import { BaseUrl } from "../utils/url+effect.ts";

export const makeClient = Effect.gen(function*() {
  const defaultClient = yield* HttpClient.HttpClient;
  const baseUrl = yield* BaseUrl;
  const client = defaultClient.pipe(HttpClient.mapRequest(HttpClientRequest.prependUrl(baseUrl)));

  return { client } as const;
});
