import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { CityProvider } from "./context/CityContext";
import App from "./App";

export function render(path) {
  const cityUri = path.split("/")[1]; // Extract city from the path

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={path}>
        <CityProvider initialCityUri={cityUri}>
          <App />
        </CityProvider>
      </StaticRouter>
    </React.StrictMode>
  );

  return { html };
}
