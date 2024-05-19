import { Route, Routes } from "react-router-dom";
import TransactionTable from "./TransactionTable";
import Transactions from "./Transactions";
import AccountSummaryTable from "./AccountSummaryTable";
import PaymentTable from "./PaymentTable";
import FreeForm from "./FreeForm";
import PaymentRequired from "./PaymentRequired";
import ParameterConfiguration from "./ParameterConfiguration";
import Login from "./Login";
import ProtectedRoutes from "./ProtectedRoutes";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function AllRoutes() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#26c6da",
        light: "#ffffff",
      },
      secondary: {
        main: "#006064",
      },
      background: {
        default: "#fafafa",
        paper: "#f5f5f5",
      },
      text: {
        primary: "rgba(18,18,18,0.87)",
      },
    },
  });

  // const router = createBrowserRouter([]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/payments" element={<PaymentTable />} />
            <Route path="/freeform" element={<FreeForm />} />
            <Route path="/payments/required" element={<PaymentRequired />} />
            <Route path="/configuration" element={<ParameterConfiguration />} />
            <Route
              path="/transactions/:account"
              element={<TransactionTable />}
            />
            <Route
              path="/transactionsnew/:account"
              element={<Transactions />}
            />
            <Route path="/" element={<AccountSummaryTable />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}
