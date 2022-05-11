export type Search = Record<string, string | string[]>;
export type Params = Record<string, string | string[] | undefined>;
export type Subscription = (location: Location) => void;

export type Matcher = {
  isArea: boolean;
  name: string;
  ranking: number;

  path: (string | { name: string })[];
  search: Record<string, "unique" | "multiple">;
  hash: string | undefined;
};

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

export type RouteObject = {
  path: string;
  search: string;
  hash: string;
};

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

type ExtractPathParams<
  Path extends string,
  Parts = SplitAndFilterEmpty<Path, "/">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}`
    ? { [K in Name]: string } & ExtractPathParams<Path, Tail>
    : ExtractPathParams<Path, Tail>
  : {};

type ExtractSearchParams<
  Search extends string,
  Parts = SplitAndFilterEmpty<Search, "&">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}[]`
    ? { [K in Name]?: string[] } & ExtractSearchParams<Search, Tail>
    : Head extends `:${infer Name}`
    ? { [K in Name]?: string } & ExtractSearchParams<Search, Tail>
    : ExtractSearchParams<Search, Tail>
  : {};

type ExtractHashParams<Value extends string> = Value extends `:${infer Name}`
  ? { [K in Name]?: string }
  : {};

type ExtractRoute<Route extends string> =
  Route extends `${infer Path}?${infer Search}#${infer Hash}`
    ? { path: Path; search: Search; hash: Hash }
    : Route extends `${infer Path}?${infer Search}`
    ? { path: Path; search: Search; hash: "" }
    : Route extends `${infer Path}#${infer Hash}`
    ? { path: Path; search: ""; hash: Hash }
    : { path: Route; search: ""; hash: "" };

type ExtractRouteParams<
  Route extends string,
  Extracted extends RouteObject = ExtractRoute<Route>,
> = ExtractPathParams<Extracted["path"]> &
  ExtractSearchParams<Extracted["search"]> &
  ExtractHashParams<Extracted["hash"]>;

type AddPrefixOnNonEmpty<
  Value extends string,
  Prefix extends string,
> = Value extends "" ? Value : `${Prefix}${Value}`;

type EnsureSlashPrefix<Value extends string> = Value extends `/${infer _}`
  ? Value
  : `/${Value}`;

type ConcatPaths<
  PathA extends string,
  PathB extends string,
  FixedPathA extends string = EnsureSlashPrefix<PathA>,
  FixedPathB extends string = EnsureSlashPrefix<PathB>,
> = FixedPathA extends "/"
  ? FixedPathB
  : FixedPathB extends "/"
  ? FixedPathA
  : `${FixedPathA}${FixedPathB}`;

type ConcatSearchs<
  SearchA extends string,
  SearchB extends string,
> = SearchA extends ""
  ? SearchB
  : `${SearchA}${AddPrefixOnNonEmpty<SearchB, "&">}`;

type StringifyRouteObject<Route extends RouteObject> =
  `${Route["path"]}${AddPrefixOnNonEmpty<
    Route["search"],
    "?"
  >}${AddPrefixOnNonEmpty<Route["hash"], "#">}`;

export type ConcatRoutes<
  RouteA extends string,
  RouteB extends string,
  RouteObjectA extends RouteObject = ExtractRoute<RouteA>,
  RouteObjectB extends RouteObject = ExtractRoute<RouteB>,
> = StringifyRouteObject<{
  path: ConcatPaths<RouteObjectA["path"], RouteObjectB["path"]>;
  search: ConcatSearchs<RouteObjectA["search"], RouteObjectB["search"]>;
  hash: RouteObjectB["hash"] extends ""
    ? RouteObjectA["hash"]
    : RouteObjectB["hash"];
}>;

export type PrependBasePath<
  BasePath extends string,
  Routes extends Record<string, string>,
  Extracted extends RouteObject = ExtractRoute<BasePath>,
> = {
  [K in keyof Routes]: ConcatRoutes<Extracted["path"], Routes[K]>;
};

export type GetAreaRoutes<Routes extends Record<string, string>> = {
  [K in keyof Routes as Routes[K] extends `${infer _}*`
    ? K
    : never]: Routes[K] extends `${infer Rest}*` ? Rest : never;
};

export type ExtractRoutesParams<Routes extends Record<string, string>> = {
  [K in keyof Routes]: ExtractRouteParams<Routes[K]>;
};

type EmptyRecord = Record<string | number | symbol, never>;

export type Simplify<T> = T extends EmptyRecord ? {} : { [K in keyof T]: T[K] };

type NonOptionalProperties<T> = Exclude<
  { [K in keyof T]: T extends Record<K, T[K]> ? K : never }[keyof T],
  undefined
>;

export type ParamsArg<Params> = Params extends EmptyRecord
  ? []
  : NonOptionalProperties<Params> extends never
  ? [params?: { [K in keyof Params]: Params[K] }]
  : [params: { [K in keyof Params]: Params[K] }];
