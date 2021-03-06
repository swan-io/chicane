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

export type RouteObject = Readonly<{
  path: string;
  search: string;
  hash: string;
}>;

export type RawLocation = Readonly<{
  path: string;
  search: string;
  hash: string;
}>;

export type Location = Readonly<{
  key: string;

  path: readonly string[];
  search: Readonly<Search>;
  hash?: string;

  raw: RawLocation;
  toString(): string;
}>;

type SplitAndFilterEmpty<
  Value extends string,
  Separator extends string,
> = Value extends `${infer Head}${Separator}${infer Tail}`
  ? Head extends ""
    ? SplitAndFilterEmpty<Tail, Separator>
    : [Head, ...SplitAndFilterEmpty<Tail, Separator>]
  : Value extends ""
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
    ? { [K in Name]?: string[] | undefined } & ExtractSearchParams<Search, Tail>
    : Head extends `:${infer Name}`
    ? { [K in Name]?: string | undefined } & ExtractSearchParams<Search, Tail>
    : ExtractSearchParams<Search, Tail>
  : {};

type ExtractHashParams<Value extends string> = Value extends `:${infer Name}`
  ? { [K in Name]?: string | undefined }
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
  ExtractedRoute extends RouteObject = ExtractRoute<Route>,
> = ExtractPathParams<ExtractedRoute["path"]> &
  ExtractSearchParams<ExtractedRoute["search"]> &
  ExtractHashParams<ExtractedRoute["hash"]>;

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
  ExtractedRouteA extends RouteObject = ExtractRoute<RouteA>,
  ExtractedRouteB extends RouteObject = ExtractRoute<RouteB>,
> = StringifyRouteObject<{
  path: ConcatPaths<ExtractedRouteA["path"], ExtractedRouteB["path"]>;
  search: ConcatSearchs<ExtractedRouteA["search"], ExtractedRouteB["search"]>;
  hash: ExtractedRouteB["hash"] extends ""
    ? ExtractedRouteA["hash"]
    : ExtractedRouteB["hash"];
}>;

export type PrependBasePath<
  BasePath extends string,
  Routes extends Record<string, string>,
  ExtractedBase extends RouteObject = ExtractRoute<BasePath>,
> = {
  [K in keyof Routes]: ConcatRoutes<ExtractedBase["path"], Routes[K]>;
};

export type GetAreaRoutes<Routes extends Record<string, string>> = {
  [K in keyof Routes as Routes[K] extends `${infer _}/*`
    ? K
    : never]: Routes[K] extends `${infer Rest}/*` ? Rest : never;
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
