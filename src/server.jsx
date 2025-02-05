import express from 'express';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from './createEmotionCache';
import App from './App';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function renderFullPage(html, css) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>My SSR React App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="/dist/index.css" />
        <style>${css}</style>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/dist/main.js"></script>
      </body>
    </html>
  `;
}

function handleRender(req, res) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

  const context = {};

  const html = ReactDOMServer.renderToString(
    <CacheProvider value={cache}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </CacheProvider>,
  );

  const emotionChunks = extractCriticalToChunks(html);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);

  res.send(renderFullPage(html, emotionCss));
}

const app = express();

app.use('/dist', express.static(path.resolve(__dirname, 'dist')));

app.get('*', handleRender);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
