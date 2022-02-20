import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TransactionTable from "./TransactionTable";
import AccountSummaryTable from "./AccountSummaryTable";
import PaymentTable from "./PaymentTable";
import FreeForm from "./FreeForm";
import NavbarInstance from "./NavbarInstance";
import PaymentRequired from "./PaymentRequired";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./Login";
import Register from "./Register"

export default function AllRoutes() {
  const queryClient = new QueryClient();
  return (
    <div>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <div>
            <NavbarInstance />
          </div>
          <Routes>
            <Route path="/payments" element={<PaymentTable />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/freeform" element={<FreeForm />} />
            <Route path="/payment/required" element={<PaymentRequired />} />
            <Route
              path="/transactions/:account"
              element={<TransactionTable />}
            />
            <Route path="/" element={<AccountSummaryTable />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}
