import React, { useState } from "react";
import MaterialTable from "material-table";
import SelectAccountNameOwnerDebit from "./SelectAccountNameOwnerDebit";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import SnackbarBaseline from "./SnackbarBaseline";
import moment from "moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import useFetchPayment from "./queries/useFetchPayment";
import usePaymentInsert from "./queries/usePaymentInsert";
import usePaymentDelete from "./queries/usePaymentDelete";
//import useFetchParameter from "./queries/useFetchParameter";
import DatePicker from "react-datepicker";
import { TablePagination } from "@material-ui/core";
import Payment from "./model/Payment";
import Transaction from "./model/Transaction";

export default function TransferTable() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const history = useNavigate();

  const { data, isSuccess } = useFetchPayment();

  const { mutate: insertPayment } = usePaymentInsert();
  const { mutate: deletePayment } = usePaymentDelete();

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const handleButtonClickLink = (oldRow: Transaction) => {
    history("/transactions/" + oldRow.accountNameOwner);
  };

  const handleError = (error: any, moduleName: string, throwIt: any) => {
    if (error.response) {
      setMessage(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data,
        )}`,
      );
      console.log(
        `${moduleName}: ${error.response.status} and ${JSON.stringify(
          error.response.data,
        )}`,
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

  const addRow = (newData: Payment) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await insertPayment({ payload: newData });
          // @ts-ignore
          resolve();
        } catch (error) {
          handleError(error, "addRow", false);
          reject();
        }
      }, 1000);
    });
  };

  // @ts-ignore
  return (
    <div>
      {isSuccess ? (
        <div data-testid="transfer-table">
          <MaterialTable
            data-testid="transfer-material-table"
            // data-cy="transfer-table"
            columns={[
              {
                title: "transactionDate",
                field: "transactionDate",
                type: "date",
                initialEditValue: moment().format("YYYY-MM-DD"),
                cellStyle: { whiteSpace: "nowrap" },

                editComponent: (props) => (
                  <MuiPickersUtilsProvider
                    utils={MomentUtils}
                    //locale={props.dateTimePickerLocalization}
                  >
                    <DatePicker
                      data-test-id="payment-date-picker"
                      value={
                        props.value
                          ? moment(props.value).format("YYYY-MM-DD")
                          : moment().format("YYYY-MM-DD")
                      }
                      onChange={props.onChange}
                    />
                  </MuiPickersUtilsProvider>
                ),
              },
              {
                title: "destination",
                field: "destinationAccount",

                cellStyle: {
                  whiteSpace: "nowrap",
                },

                headerStyle: {},

                render: (rowData: Transaction) => {
                  return (
                    <Button
                      style={{ fontSize: ".6rem" }}
                      onClick={() => handleButtonClickLink(rowData)}
                    >
                      {rowData.accountNameOwner}
                    </Button>
                  );
                },
                editComponent: (props) => {
                  return (
                    <div className="container">
                      <div>
                        <SelectAccountNameOwnerDebit
                          onChangeFunction={props.onChange}
                          currentValue={props.value}
                        />
                      </div>
                    </div>
                  );
                },
              },
              {
                title: "amount",
                field: "amount",
                type: "currency",
                cellStyle: { whiteSpace: "nowrap" },
              },
              {
                title: "source",
                field: "sourceAccount",
                

                render: (rowData: Transaction) => {
                    return (
                      <Button
                        style={{ fontSize: ".6rem" }}
                        onClick={() => handleButtonClickLink(rowData)}
                      >
                        {rowData.accountNameOwner}
                      </Button>
                    );
                  },
                  editComponent: (props) => {
                    return (
                      <div className="container">
                        <div>
                          <SelectAccountNameOwnerDebit
                            onChangeFunction={props.onChange}
                            currentValue={props.value}
                          />
                        </div>
                      </div>
                    );
                  },


                headerStyle: {},
                cellStyle: { whiteSpace: "nowrap" },
              },
            ]}
            data={data}
            title="Transfers"
            components={{
              Pagination: (props) => {
                return (
                  <td className="right">
                    <TablePagination
                      component="div"
                      count={props.count}
                      page={props.page}
                      rowsPerPage={props.rowsPerPage}
                      rowsPerPageOptions={[25, 50, 75, 100]}
                      onRowsPerPageChange={props.onChangeRowsPerPage}
                      onPageChange={props.onChangePage}
                    />
                  </td>
                );
              },
            }}
            options={{
              actionsColumnIndex: -1,
              paging: true,
              paginationPosition: "both",
              pageSize: 25,
              addRowPosition: "first",
              search: false,
              headerStyle: {
                backgroundColor: "#9965f4",
                color: "#FFFFFF",
                zIndex: 0,
              },
            }}
            editable={{
              // @ts-ignore
              onRowAdd: addRow,
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(async () => {
                    try {
                      console.log("oldData: " + JSON.stringify(oldData));
                      deletePayment({ oldRow: oldData });
                      // @ts-ignore
                      resolve();
                    } catch (error) {
                      handleError(error, "onRowDelete", false);
                      reject();
                    }
                  }, 1000);
                }),
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
          <Spinner data-test-id="payments-spinner" />
        </div>
      )}
    </div>
  );
}
