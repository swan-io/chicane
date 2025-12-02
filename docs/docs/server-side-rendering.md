---
title: Server-side rendering
sidebar_label: Server-side rendering
---

To render your app server-side, wrap it with `UrlProvider`:

```tsx {1,10-12}
import { UrlProvider } from "@swan-io/chicane/server";
import express from "express";
import { renderToString } from "react-dom/server";
import { App } from "../client/App";

const app = express();

app.use("*", (req, res) => {
  const html = renderToString(
    <UrlProvider value={req.originalUrl}>
      <App />
    </UrlProvider>,
  );

  // …
});
```
