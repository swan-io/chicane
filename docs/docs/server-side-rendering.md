---
title: Server-side rendering
sidebar_label: Server-side rendering
---

To render your app server-side, wrap it with `ServerUrlProvider`:

```tsx {1,11-13}
import { ServerUrlProvider } from "@swan-io/chicane";
import express from "express";
import ReactDOMServer from "react-dom/server";
import { App } from "../client/App";

const app = express();

app.use("*", (req, res) => {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <ServerUrlProvider value={req.originalUrl}>
        <App />
      </ServerUrlProvider>
    </React.StrictMode>,
  );

  // …
});
```

:::warning
Since the server can't access the hash contained in your url (as it's not sent by the browser), be sure **not** to render something conditionally based on its value.
:::
