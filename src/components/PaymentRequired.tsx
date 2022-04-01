import Spinner from "./Spinner";
import React from "react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import useFetchPaymentRequired from "./queries/useFetchPaymentRequired";

export default function PaymentRequired() {
  const history = useNavigate();

  const { data, isSuccess, isLoading } = useFetchPaymentRequired();

  const handleButtonClickLink = (accountNameOwner: String) => {
    history("/transactions/" + accountNameOwner);
  };

  return (
    <div>
      {!isLoading && isSuccess ? (
        <div data-testid="payment-required-table">
          <MaterialTable
            columns={[
              {
                title: "accountNameOwner",
                field: "accountNameOwner",
                cellStyle: { whiteSpace: "nowrap" },
                render: (rowData) => {
                  return (
                    <Button
                      onClick={() =>
                        handleButtonClickLink(rowData.accountNameOwner)
                      }
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
                render: (rowData) => {
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
            ]}
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
                // position: 'sticky', top: 0
              },
              rowStyle: { fontSize: ".6rem" },
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
}
