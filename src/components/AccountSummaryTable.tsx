import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Spinner from "./Spinner";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import { currencyFormat, noNaN } from "./Common";
import SnackbarBaseline from "./SnackbarBaseline";
import useFetchAccount from "./queries/useFetchAccount";
import useAccountInsert from "./queries/useAccountInsert";
import useAccountDelete from "./queries/useAccountDelete";
import useFetchTotals from "./queries/useFetchTotals";
import Account from "./model/Account";

export default function AccountSummaryTable() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const history = useNavigate();

  const { data, isSuccess, isLoading } = useFetchAccount();
  const { data: totals, isSuccess: isSuccessTotals } = useFetchTotals();
  const { mutate: insertAccount } = useAccountInsert();
  const { mutate: deleteAccount } = useAccountDelete();

  const handleButtonClickLink = (accountNameOwner: String) => {
    history("/transactions/" + accountNameOwner);
  };

  const handleError = (error: any, moduleName: String, throwIt: any) => {
    if (error.response) {
      setMessage(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data
        )}`
      );
      console.log(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data
        )}`
      );
      setOpen(true);
    } else {
      setMessage(`${moduleName}: failure`);
      console.log(`${moduleName}: failure`);
      setOpen(true);
      if (throwIt) {
        throw error;
      }
    }
  };

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const addRow = (newData: Account) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await insertAccount({ payload: newData });
          // @ts-ignore
          resolve();
        } catch (error) {
          handleError(error, "addRow", false);
          reject();
        }
      }, 1000);
    });
  };

  const deleteRow = (oldData: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await deleteAccount({ oldRow: oldData });
          // @ts-ignore
          resolve();
        } catch (error) {
          handleError(error, "onRowDelete", false);
          reject();
        }
      }, 1000);
    });
  };

  useEffect(() => {}, []);

  return (
    <>
      {!isLoading && isSuccess && isSuccessTotals ? (
        <div>
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
            title={`[ $${currencyFormat(
              noNaN(totals["totals"])
            )} ] [ $${currencyFormat(
              noNaN(totals["totalsCleared"])
            )} ]  [ $${currencyFormat(
              noNaN(totals["totalsOutstanding"])
            )} ] [ $${currencyFormat(noNaN(totals["totalsFuture"]))} ]`}
            options={{
              actionsColumnIndex: -1,
              paging: false,
              search: true,
              addRowPosition: "first",
              headerStyle: {
                backgroundColor: "#9965f4",
                color: "#FFF",
                zIndex: 0,
              },
              rowStyle: { fontSize: ".6rem" },
            }}
            editable={{
              onRowAdd: addRow,
              onRowDelete: deleteRow,
            }}
          />
          <div>
            <SnackbarBaseline
              message={message}
              state={open}
              handleSnackbarClose={handleSnackbarClose}
            />
          </div>
        </div>
      ) : (
        <div className="centered">
          <Spinner />
        </div>
      )}
    </>
  );
}
