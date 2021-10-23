export type Search = Record<string, string | string[]>;
export type Params = Record<string, string | string[] | undefined>;
export type Subscription = (location: Location) => void;

export type Segment = {
  name: string;
  param: boolean;
};

export type Matcher = {
  name: string;
  segments: Segment[];
  search: Record<string, "unique" | "multiple">;
  hash?: string;
  finite: boolean;
  ranking: number;
};

export type Location = {
  path: string[];
  search: Search;
  hash?: string;
};

type Split<
  Value extends string,
  Separator extends string,
> = Value extends `${infer Head}${Separator}${infer Tail}`
  ? [Head, ...Split<Tail, Separator>]
  : Value extends Separator
  ? []
  : [Value];

type ExtractPathParams<
  Path extends string,
  Parts = Split<Path, "/">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}`
    ? { [K in Name]: string } & ExtractPathParams<Path, Tail>
    : ExtractPathParams<Path, Tail>
  : {};

type ExtractSearchParams<
  Search extends string,
  Parts = Split<Search, "&">,
> = Parts extends [infer Head, ...infer Tail]
  ? Head extends `:${infer Name}[]`
    ? { [K in Name]?: string[] } & ExtractSearchParams<Search, Tail>
    : Head extends `:${infer Name}`
    ? { [K in Name]?: string } & ExtractSearchParams<Search, Tail>
    : ExtractSearchParams<Search, Tail>
  : {};

type ExtractHashParam<Value extends string> = Value extends `:${infer Name}`
  ? { [K in Name]?: string }
  : {};

type ExtractRouteParams<Route extends string> =
  Route extends `${infer Path}?${infer Search}#${infer Hash}`
    ? ExtractPathParams<Path> &
        ExtractSearchParams<Search> &
        ExtractHashParam<Hash>
    : Route extends `${infer Path}?${infer Search}`
    ? ExtractPathParams<Path> & ExtractSearchParams<Search>
    : ExtractPathParams<Route>;

export type PrependBasePath<
  Routes extends Record<string, string>,
  BasePath extends string,
> = {
  [K in keyof Routes]: `${BasePath}/${Routes[K]}`;
};

export type GetNestedRoutes<Routes extends Record<string, string>> = {
  [K in keyof Routes as Routes[K] extends `${infer _}*`
    ? K
    : never]: Routes[K] extends `${infer Rest}*` ? Rest : never;
};

export type ExtractRoutesParams<Routes extends Record<string, string>> = {
  [K in keyof Routes]: ExtractRouteParams<Routes[K]>;
};

type EmptyRecord = Record<string | number | symbol, never>;

export type Simplify<Params> = Params extends EmptyRecord
  ? {}
  : { [K in keyof Params]: Params[K] };

type NonOptionalProperties<T> = Exclude<
  { [K in keyof T]: T extends Record<K, T[K]> ? K : never }[keyof T],
  undefined
>;

export type Arguments<Params> = Params extends EmptyRecord
  ? []
  : NonOptionalProperties<Params> extends never
  ? [params?: { [K in keyof Params]: Params[K] }]
  : [params: { [K in keyof Params]: Params[K] }];
