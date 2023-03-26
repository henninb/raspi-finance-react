import Spinner from "./Spinner";
import React, { FC } from "react";
import MaterialTable, { Column } from "material-table";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import useFetchPaymentRequired from "./queries/useFetchPaymentRequired";

interface PaymentRequiredData {
  accountNameOwner: string;
  accountType: string;
  moniker: string;
  future: number;
  outstanding: number;
  cleared: number;
}

const PaymentRequired: FC = () => {
  const history = useNavigate();

  const { data, isSuccess, isLoading } = useFetchPaymentRequired();

  const handleButtonClickLink = (accountNameOwner: string) => {
    history("/transactions/" + accountNameOwner);
  };

  const columns: Column<PaymentRequiredData>[] = [
    {
      title: "accountNameOwner",
      field: "accountNameOwner",
      cellStyle: { whiteSpace: "nowrap" },
      render: (rowData: PaymentRequiredData) => {
        return (
          <Button
            style={{ fontSize: ".6rem" }}
            onClick={() => handleButtonClickLink(rowData.accountNameOwner)}
          >
            {rowData.accountNameOwner}
          </Button>
        );
      },
    },
    {
      title: "accountType",
      field: "accountType",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "moniker",
      field: "moniker",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "future",
      field: "future",
      type: "currency",
      editable: "never",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "outstanding",
      field: "outstanding",
      type: "currency",
      editable: "never",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "cleared",
      field: "cleared",
      type: "currency",
      editable: "never",
      cellStyle: { whiteSpace: "nowrap" },
    },
    {
      title: "aftermath",
      type: "currency",
      editable: "never",
      cellStyle: { whiteSpace: "nowrap" },
      render: (rowData: PaymentRequiredData) => {
        return (
          rowData.cleared +
          rowData.outstanding +
          rowData.future
        ).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
    },
  ];

  return (
    <div>
      {!isLoading && isSuccess ? (
        <div data-testid="payment-required-table">
          <MaterialTable
            columns={columns}
            data={data}
            title="Payment Required"
            options={{
              actionsColumnIndex: -1,
              paging: false,
              search: true,
              addRowPosition: "first",
              headerStyle: {
                backgroundColor: "#9965f4",
                color: "#FFFFFF",
                zIndex: 0,
              },
            }}
          />
        </div>
      ) : (
        <div className="centered">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default PaymentRequired;
