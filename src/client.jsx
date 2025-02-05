import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./createEmotionCache";

const cache = createEmotionCache();

function Main() {
  return (
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  );
}

ReactDOM.hydrateRoot(document.querySelector("#root"), <Main />);
