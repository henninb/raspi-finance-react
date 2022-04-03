import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./components/main.scss";

const queryClient = new QueryClient();

const rootElement = ReactDOM.createRoot(document.getElementById("root"));

rootElement.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);
