import { Route, Routes } from "react-router-dom";
import TransactionTable from "./TransactionTable";
import AccountSummaryTable from "./AccountSummaryTable";
import PaymentTable from "./PaymentTable";
import FreeForm from "./FreeForm";
import PaymentRequired from "./PaymentRequired";
import Login from "./Login";
import ProtectedRoutes from "./ProtectedRoutes";

export default function AllRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/payments" element={<PaymentTable />} />
          <Route path="/freeform" element={<FreeForm />} />
          <Route path="/payment/required" element={<PaymentRequired />} />
          <Route path="/transactions/:account" element={<TransactionTable />} />
          <Route path="/" element={<AccountSummaryTable />} />
        </Route>
      </Routes>
    </>
  );
}
