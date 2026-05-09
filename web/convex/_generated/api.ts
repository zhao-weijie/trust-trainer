/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * Run `npx convex dev` after linking a Convex deployment to regenerate this file.
 */

import { anyApi } from "convex/server";
import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as domain from "../domain.js";

const fullApi: ApiFromModules<{
  domain: typeof domain;
}> = anyApi as any;

export const api: FilterApi<typeof fullApi, FunctionReference<any, "public">> = anyApi as any;
export const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">> = anyApi as any;

