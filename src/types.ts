type Last<T extends unknown[]> = T extends [...unknown[], infer R] ? R : never;
type EmptyRecord = Record<string | number | symbol, never>;

export type Simplify<T> = T extends EmptyRecord ? {} : { [K in keyof T]: T[K] };

export type Search = Record<string, string | string[]>;
export type Params = Record<string, string | string[] | undefined>;
export type Subscription = (location: Location) => void;

export type Matcher = {
  finite: boolean;
  name: string;
  ranking: number;

  path: (string | { name: string })[];
  search: Record<string, "unique" | "multiple">;
  hash: string | undefined;
};

export type RouteFromGroup = Pick<Matcher, "path" | "search" | "hash">;

export type Location = Readonly<{
  key: string;

  path: readonly string[];
  search: Readonly<Search>;
  hash?: string;

  raw: Readonly<{
    path: string;
    search: string;
    hash: string;
  }>;

  toString(): string;
}>;

type SplitAndFilterEmpty<
  Value extends string,
  Separator extends string,
> = Value extends `${infer Head}${Separator}${infer Tail}`
  ? Head extends ""
    ? SplitAndFilterEmpty<Tail, Separator>
    : [Head, ...SplitAndFilterEmpty<Tail, Separator>]
  : Value extends Separator | ""
  ? []
  : [Value];

type ExtractPath<
  Path extends string,
  Parts = SplitAndFilterEmpty<Path, "/">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}`
    ? [{ name: Name }, ...ExtractPath<Path, Tail>]
    : [Head, ...ExtractPath<Path, Tail>]
  : [];

type ExtractSearch<
  Search extends string,
  Parts = SplitAndFilterEmpty<Search, "&">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}[]`
    ? { [K in Name]: "multiple" } & ExtractSearch<Search, Tail>
    : Head extends `:${infer Name}`
    ? { [K in Name]: "unique" } & ExtractSearch<Search, Tail>
    : ExtractSearch<Search, Tail>
  : {};

type ExtractHash<Hash extends string> = Hash extends `:${infer Name}`
  ? Name
  : undefined;

type ExtractRoute<Route extends string> =
  Route extends `${infer Path}?${infer Search}#${infer Hash}`
    ? {
        path: ExtractPath<Path>;
        search: ExtractSearch<Search>;
        hash: ExtractHash<Hash>;
      }
    : Route extends `${infer Path}?${infer Search}`
    ? {
        path: ExtractPath<Path>;
        search: ExtractSearch<Search>;
        hash: undefined;
      }
    : Route extends `${infer Path}#${infer Hash}`
    ? { path: ExtractPath<Path>; search: {}; hash: ExtractHash<Hash> }
    : { path: ExtractPath<Route>; search: {}; hash: undefined };

type ConcatSearch<
  SearchA extends RouteFromGroup["search"],
  SearchB extends RouteFromGroup["search"],
  KeysA extends keyof SearchA = keyof SearchA,
  KeysB extends keyof SearchB = keyof SearchB,
> = Simplify<
  Omit<SearchA, KeysB> &
    Omit<SearchB, KeysA> & {
      [K in KeysA & KeysB]: SearchA[K] extends "multiple"
        ? "multiple"
        : SearchB[K] extends "multiple"
        ? "multiple"
        : "unique"; // mandatory
    }
>;

type ConcatRoutes<
  RouteA extends RouteFromGroup,
  RouteB extends RouteFromGroup,
> = Simplify<{
  path: [...RouteA["path"], ...RouteB["path"]];
  search: ConcatSearch<RouteA["search"], RouteB["search"]>;
  hash: RouteB["hash"] extends undefined ? RouteA["hash"] : RouteB["hash"];
}>;

export type PrependBasePath<
  BasePath extends string,
  Routes extends Record<string, string | RouteFromGroup>,
  ExtractedBasePath extends RouteFromGroup = ExtractRoute<BasePath>,
> = {
  [K in keyof Routes]: ConcatRoutes<
    ExtractedBasePath,
    Routes[K] extends string
      ? ExtractRoute<Routes[K]>
      : Routes[K] extends RouteFromGroup
      ? Routes[K]
      : never // mandatory
  >;
};

export type GetNestedRoutes<Routes extends Record<string, RouteFromGroup>> = {
  [K in keyof Routes as Last<Routes[K]["path"]> extends "*"
    ? K
    : never]: Routes[K];
};

type GetPathParams<Path extends RouteFromGroup["path"]> = Exclude<
  Path[number],
  string
>;

type GetSearchParams<Search extends RouteFromGroup["search"]> = {
  [K in keyof Search]: Search[K] extends "multiple" ? string[] : string;
};

type GetHashParams<Hash extends RouteFromGroup["hash"]> = Hash extends string
  ? { [K in Hash]: string }
  : {};

type GetRouteParams<Route extends RouteFromGroup> = Simplify<
  GetPathParams<Route["path"]> &
    GetSearchParams<Route["search"]> &
    GetHashParams<Route["hash"]>
>;

export type GetRoutesParams<Routes extends Record<string, RouteFromGroup>> = {
  [K in keyof Routes]: GetRouteParams<Routes[K]>;
};

type NonOptionalProperties<T> = Exclude<
  { [K in keyof T]: T extends Record<K, T[K]> ? K : never }[keyof T],
  undefined
>;

export type ParamsArg<Params> = Params extends EmptyRecord
  ? []
  : NonOptionalProperties<Params> extends never
  ? [params?: { [K in keyof Params]: Params[K] }]
  : [params: { [K in keyof Params]: Params[K] }];
