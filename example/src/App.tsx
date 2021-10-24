import * as React from "react";
import { match } from "ts-pattern";
import { Link } from "./Link";
import { createURL, useRoute } from "./router";

export const App = () => {
  const route = useRoute(["5", "7", "13", "19"]);

  return (
    match(route)
      .with({ name: "5" }, (params) => (
        <div>
          <h1>5</h1>
          <div>{JSON.stringify(params)}</div>
          <Link href={createURL("7")}>link</Link>
        </div>
      ))
      .with({ name: "7" }, (params) => (
        <div>
          <h1>7</h1>
          <div>{JSON.stringify(params)}</div>
          <Link
            href={createURL("13", {
              groupId: "github",
              foo: "foo",
              bar: ["", "", ""],
              baz: "baz",
            })}
          >
            link
          </Link>
        </div>
      ))
      .with({ name: "13" }, (params) => (
        <div>
          <h1>13</h1>
          <div>{JSON.stringify(params)}</div>
          <Link href={createURL("20", { groupId: "github" })}>link</Link>
        </div>
      ))
      .with({ name: "19" }, (params) => (
        <div>
          <h1>19</h1>
          <div>{JSON.stringify(params)}</div>
          <Link href={createURL("5")}>link</Link>
        </div>
      ))
      // .with({ name: "20" }, (params) => (
      //   <div>
      //     <h1>20</h1>
      //     <div>{JSON.stringify(params)}</div>
      //     <Link href={createURL("5")}>link</Link>
      //   </div>
      // ))
      .with(undefined, () => <div>404</div>)
      .exhaustive()
  );
};
