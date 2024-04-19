import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const rootElement = ReactDOM.createRoot(document.getElementById("root"));

rootElement.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
);
