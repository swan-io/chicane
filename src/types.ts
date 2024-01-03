export type Params = Record<string, string | string[] | undefined>;
export type Search = Record<string, string | string[]>;
export type Listener = (location: Location) => void;

export type Matcher = {
  isArea: boolean;
  name: string;
  ranking: number;

  path: (string | { name: string; union?: string[] })[];
  search: Record<string, { multiple: boolean; union?: string[] }> | undefined;
};

export type RouteObject = Readonly<{
  path: string;
  search: string;
}>;

export type Location = Readonly<{
  path: readonly string[];
  search: Readonly<Search>;

  raw: Readonly<{
    path: string;
    search: string;
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

export type PartialRecord<K extends string, T> = {
  [P in K]?: T | undefined;
};

export type ExtractUnion<Union extends string> = NonEmptySplit<
  Union,
  "|"
>[number];

export type ExtractRequiredParam<Value extends string> =
  Value extends `${infer Name}{${infer Union}}`
    ? Record<Name, ExtractUnion<Union>>
    : Record<Value, string>;

export type ExtractOptionalMultipleParam<Value extends string> =
  Value extends `${infer Name}{${infer Union}}`
    ? PartialRecord<Name, ExtractUnion<Union>[]>
    : PartialRecord<Value, string[]>;

export type ExtractOptionalUniqueParam<Value extends string> =
  Value extends `${infer Name}{${infer Union}}`
    ? PartialRecord<Name, ExtractUnion<Union>>
    : PartialRecord<Value, string>;

export type GetPathParams<
  Path extends string,
  Parts = NonEmptySplit<Path, "/">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}`
    ? ExtractRequiredParam<Name> & GetPathParams<Path, Tail>
    : GetPathParams<Path, Tail>
  : {}; // eslint-disable-line @typescript-eslint/ban-types

export type GetSearchParams<
  Search extends string,
  Parts = NonEmptySplit<Search, "&">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}[]`
    ? ExtractOptionalMultipleParam<Name> & GetSearchParams<Search, Tail>
    : Head extends `:${infer Name}`
      ? ExtractOptionalUniqueParam<Name> & GetSearchParams<Search, Tail>
      : GetSearchParams<Search, Tail>
  : {}; // eslint-disable-line @typescript-eslint/ban-types

type EnsureSlashPrefix<Value extends string> = Value extends `/${string}`
  ? Value
  : `/${Value}`;

export type ParseRoute<
  Route extends string,
  CleanRoute = EnsureSlashPrefix<
    Route extends `${infer Head}#${string}` ? Head : Route
  >,
> = CleanRoute extends `${infer Path}?${infer Search}`
  ? { path: Path; search: Search }
  : { path: CleanRoute; search: "" };

export type ParseRoutes<Routes extends Record<string, string>> = {
  [K in keyof Routes]: ParseRoute<Routes[K]>;
};

type AddPrefixOnNonEmpty<
  Value extends string,
  Prefix extends string,
> = Value extends "" ? Value : `${Prefix}${Value}`;

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

export type ConcatRoutes<
  RouteA extends string,
  RouteB extends string,
  RouteObjectA extends RouteObject = ParseRoute<RouteA>,
  RouteObjectB extends RouteObject = ParseRoute<RouteB>,
  Path extends string = ConcatPaths<RouteObjectA["path"], RouteObjectB["path"]>,
  Search extends string = ConcatSearchs<
    RouteObjectA["search"],
    RouteObjectB["search"]
  >,
> = `${Path}${AddPrefixOnNonEmpty<Search, "?">}`;

export type PrependBasePath<
  BasePath extends string,
  Routes extends Record<string, RouteObject>,
> = {
  [K in keyof Routes]: {
    path: ConcatPaths<BasePath, Routes[K]["path"]>;
    search: Routes[K]["search"];
  };
};

export type GetAreaRoutes<Routes extends Record<string, RouteObject>> = {
  [K in keyof Routes as Routes[K]["path"] extends `${string}/*`
    ? K
    : never]: Routes[K]["path"] extends `${infer Rest}/*`
    ? { path: Rest; search: Routes[K]["search"] }
    : never;
};

type SimplifyParams<T> = T extends Record<PropertyKey, never>
  ? {} // eslint-disable-line @typescript-eslint/ban-types
  : { [K in keyof T]: T[K] };

export type GetRoutesParams<Routes extends Record<string, RouteObject>> = {
  [K in keyof Routes]: SimplifyParams<
    GetPathParams<Routes[K]["path"]> & GetSearchParams<Routes[K]["search"]>
  >;
};

type NonOptionalProperties<T> = Exclude<
  { [K in keyof T]: T extends Record<K, T[K]> ? K : never }[keyof T],
  undefined
>;

export type ParamsArg<Params> = Params extends Record<PropertyKey, never>
  ? []
  : NonOptionalProperties<Params> extends never
    ? [params?: { [K in keyof Params]: Params[K] }]
    : [params: { [K in keyof Params]: Params[K] }];

export type GetCreateURLFns<RoutesParams extends Record<string, Params>> = {
  [RouteName in keyof RoutesParams]: (
    ...params: ParamsArg<RoutesParams[RouteName]>
  ) => string;
};
