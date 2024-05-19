// import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import App from "./App";
import { BrowserRouter, Outlet, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import AccountSummaryTable from "./components/AccountSummaryTable";
import PaymentTable from "./components/PaymentTable";
import PaymentRequired from "./components/PaymentRequired";
import ParameterConfiguration from "./components/ParameterConfiguration";
import FreeForm from "./components/FreeForm";
import TransactionTable from "./components/TransactionTable";
import Transactions from "./components/Transactions";
import Login from "./components/Login";
import Header from "./components/Header";

const queryClient = new QueryClient();

const rootElement = ReactDOM.createRoot(document.getElementById("root"));

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

// const router = createBrowserRouter([
createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <AccountSummaryTable /> },
      { path: "/payments", element: <PaymentTable /> },
      { path: "/freeform", element: <FreeForm /> },
      { path: "/configuration", element: <ParameterConfiguration /> },
      { path: "/payments/required", element: <PaymentRequired /> },

      { path: "/transactions/:account", element: <TransactionTable /> },
      { path: "/login", element: <Login /> },
      { path: "/transactionsnew/:account", element: <Transactions /> },
      // { path: '*', element: <NotFound /> }, // Catch-all route for undefined paths
    ],
  },
]);

// <RouterProvider router={router} ></RouterProvider>
rootElement.render(
  <div>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </div>,
);
