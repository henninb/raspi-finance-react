import React from "react";
import { Route, Routes } from "react-router-dom";
import TransactionTable from "./TransactionTable";
import AccountSummaryTable from "./AccountSummaryTable";
import PaymentTable from "./PaymentTable";
import FreeForm from "./FreeForm";
import PaymentRequired from "./PaymentRequired";
import Login from "./Login";
import Register from "./Register";

export default function AllRoutes() {
  return (
    <>
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
    </>
  );
}
