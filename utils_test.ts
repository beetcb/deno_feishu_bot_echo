import { assert } from "https://deno.land/std/testing/asserts.ts";

import { isVerification } from "./utils.ts";

Deno.test("isVerification", (): void => {
  assert(!isVerification(null));
  assert(!isVerification(undefined));
  assert(!isVerification(""));
  assert(!isVerification("foo"));
  assert(!isVerification({}));
  assert(isVerification({ type: "url_verification" }));
});
