export type Search = Record<string, string | string[]>;
export type Params = Record<string, string | string[] | undefined>;
export type Subscription = (location: Location) => void;

export type Matcher = {
  isArea: boolean;
  name: string;
  ranking: number;

  path: (string | { name: string })[];
  search: Record<string, "unique" | "multiple"> | undefined;
  hash: string | undefined;
};

export type ParsedRoute = Readonly<{
  path: string;
  search: string;
  hash: string;
}>;

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

export type NonEmptySplit<
  Value extends string,
  Separator extends string,
> = Value extends `${infer Head}${Separator}${infer Tail}`
  ? Head extends ""
    ? NonEmptySplit<Tail, Separator>
    : [Head, ...NonEmptySplit<Tail, Separator>]
  : Value extends ""
  ? []
  : [Value];

export type GetPathParams<
  Path extends string,
  Parts = NonEmptySplit<Path, "/">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}`
    ? { [K in Name]: string } & GetPathParams<Path, Tail>
    : GetPathParams<Path, Tail>
  : {}; // eslint-disable-line @typescript-eslint/ban-types

export type GetSearchParams<
  Search extends string,
  Parts = NonEmptySplit<Search, "&">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}[]`
    ? { [K in Name]?: string[] | undefined } & GetSearchParams<Search, Tail>
    : Head extends `:${infer Name}`
    ? { [K in Name]?: string | undefined } & GetSearchParams<Search, Tail>
    : GetSearchParams<Search, Tail>
  : {}; // eslint-disable-line @typescript-eslint/ban-types

export type GetHashParams<Value extends string> = Value extends `:${infer Name}`
  ? { [K in Name]?: string | undefined }
  : {}; // eslint-disable-line @typescript-eslint/ban-types

export type ParseRoute<Route extends string> =
  Route extends `${infer Path}?${infer Search}#${infer Hash}`
    ? { path: Path; search: Search; hash: Hash }
    : Route extends `${infer Path}?${infer Search}`
    ? { path: Path; search: Search; hash: "" }
    : Route extends `${infer Path}#${infer Hash}`
    ? { path: Path; search: ""; hash: Hash }
    : { path: Route; search: ""; hash: "" };

export type ParseRoutes<Routes extends Record<string, string>> = {
  [K in keyof Routes]: ParseRoute<Routes[K]>;
};

type AddPrefixOnNonEmpty<
  Value extends string,
  Prefix extends string,
> = Value extends "" ? Value : `${Prefix}${Value}`;

type EnsureSlashPrefix<Value extends string> = Value extends `/${string}`
  ? Value
  : `/${Value}`;

export type ConcatPaths<
  PathA extends string,
  PathB extends string,
  FixedPathA extends string = EnsureSlashPrefix<PathA>,
  FixedPathB extends string = EnsureSlashPrefix<PathB>,
> = FixedPathA extends "/"
  ? FixedPathB
  : FixedPathB extends "/"
  ? FixedPathA
  : `${FixedPathA}${FixedPathB}`;

export type ConcatSearchs<
  SearchA extends string,
  SearchB extends string,
> = SearchA extends ""
  ? SearchB
  : `${SearchA}${AddPrefixOnNonEmpty<SearchB, "&">}`;

export type ConcatParsedRoutes<
  RouteA extends ParsedRoute,
  RouteB extends ParsedRoute,
> = {
  path: ConcatPaths<RouteA["path"], RouteB["path"]>;
  search: ConcatSearchs<RouteA["search"], RouteB["search"]>;
  hash: RouteB["hash"] extends "" ? RouteA["hash"] : RouteB["hash"];
};

export type ConcatRoutes<
  RouteA extends string,
  RouteB extends string,
  Route extends ParsedRoute = ConcatParsedRoutes<
    ParseRoute<RouteA>,
    ParseRoute<RouteB>
  >,
> = `${Route["path"]}${AddPrefixOnNonEmpty<
  Route["search"],
  "?"
>}${AddPrefixOnNonEmpty<Route["hash"], "#">}`;

export type PrependBasePath<
  BasePath extends string,
  Routes extends Record<string, ParsedRoute>,
> = {
  [K in keyof Routes]: {
    path: ConcatPaths<BasePath, Routes[K]["path"]>;
    search: Routes[K]["search"];
    hash: Routes[K]["hash"];
  };
};

export type GetAreaRoutes<Routes extends Record<string, ParsedRoute>> = {
  [K in keyof Routes as Routes[K]["path"] extends `${string}/*`
    ? K
    : never]: Routes[K]["path"] extends `${infer Rest}/*`
    ? { path: Rest; search: Routes[K]["search"]; hash: Routes[K]["hash"] }
    : never;
};

export type GetRoutesParams<Routes extends Record<string, ParsedRoute>> = {
  [K in keyof Routes]: GetPathParams<Routes[K]["path"]> &
    GetSearchParams<Routes[K]["search"]> &
    GetHashParams<Routes[K]["hash"]>;
};

type EmptyRecord = Record<string | number | symbol, never>;

export type Simplify<T> = T extends EmptyRecord
  ? {} // eslint-disable-line @typescript-eslint/ban-types
  : { [K in keyof T]: T[K] };

type NonOptionalProperties<T> = Exclude<
  { [K in keyof T]: T extends Record<K, T[K]> ? K : never }[keyof T],
  undefined
>;

export type ParamsArg<Params> = Params extends EmptyRecord
  ? []
  : NonOptionalProperties<Params> extends never
  ? [params?: { [K in keyof Params]: Params[K] }]
  : [params: { [K in keyof Params]: Params[K] }];
