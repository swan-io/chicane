---
title: Server-side rendering
sidebar_label: Server-side rendering
---

To render your app server-side, wrap it with `ServerUrlProvider`:

```tsx {1,11-13}
import { ServerUrlProvider } from "@swan-io/chicane";
import express from "express";
import { renderToString } from "react-dom/server";
import { App } from "../client/App";

const app = express();

app.use("*", (req, res) => {
  const html = renderToString(
    <ServerUrlProvider value={req.originalUrl}>
      <App />
    </ServerUrlProvider>,
  );

  // …
});
```
