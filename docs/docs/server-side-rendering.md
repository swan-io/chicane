---
title: Server-side rendering
sidebar_label: Server-side rendering
---

To render your app server-side, wrap it with `ServerSideUrlProvider`:

```tsx {1,11-13}
import { ServerSideUrlProvider } from "@swan-io/chicane/server";
import express from "express";
import ReactDOMServer from "react-dom/server";
import { App } from "../client/App";

const app = express();

app.use("*", (req, res) => {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <ServerSideUrlProvider value={req.originalUrl}>
        <App />
      </ServerSideUrlProvider>
    </React.StrictMode>,
  );

  // …
});
```

:::warning
Since the server can't access the hash contained in your url (as it's not sent by the browser), be sure **not** to render something conditionally based on its value.
:::
