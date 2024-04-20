import React, { useCallback, useEffect, useState } from "react";
import MaterialTable from "material-table";
//import MaterialTable from "@material-table/core";
import Spinner from "./Spinner";
import { useMatch } from "react-router-dom";
import SelectTransactionState from "./SelectTransactionState";
import SelectTransactionType from "./SelectTransactionType";
import TransactionMove from "./TransactionMove";
import { currencyFormat, epochToDate, noNaN } from "./Common";
import ChevronRightRounded from "@material-ui/icons/ChevronRightRounded";
import SelectCategory from "./SelectCategory";
import SelectDescription from "./SelectDescription";
import SnackbarBaseline from "./SnackbarBaseline";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DatePicker from "react-datepicker";
import moment from "moment";
import SelectReoccurringType from "./SelectReoccurringType";
import Button from "@material-ui/core/Button";
import useFetchTransactionByAccount from "./queries/useFetchTransactionByAccount";
import useChangeTransactionState from "./queries/useTransactionStateUpdate";
import useTransactionUpdate from "./queries/useTransactionUpdate";
import useTransactionDelete from "./queries/useTransactionDelete";
import useTransactionInsert from "./queries/useTransactionInsert";
import useFetchTotalsPerAccount from "./queries/useFetchTotalsPerAccount";
import useReceiptImageUpdate from "./queries/useReceiptImageUpdate";
import { TablePagination } from "@material-ui/core";
import Transaction from "./model/Transaction";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import useFetchValidationAmount from "./queries/useFetchValidationAmount";
import useValidationAmountInsert from "./queries/useValidationAmountInsert";
import ValidationAmount from "./model/ValidationAmount";
import { TransactionState } from "./model/TransactionState";
import HoverButtons from "./HoverButtons";

export default function TransactionTable() {
  const [loadMoveDialog, setLoadMoveDialog] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [keyPressed, setKeyPressed] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  
  const routeMatch: any = useMatch("/transactions/:account");
  let accountNameOwner = 'default';
  try {
    accountNameOwner = routeMatch.params["account"];
  } catch {
    console.log("accountNameOwner is set to the default.");
  }

  const { data, isSuccess } = useFetchTransactionByAccount(
    accountNameOwner,
  );
  const { data: totals, isSuccess: isSuccessTotals } = useFetchTotalsPerAccount(
    accountNameOwner,
  );
  const { data: validationData, isSuccess: isSuccessValidationTotals } =
    useFetchValidationAmount(accountNameOwner);
  const { mutate: updateTransactionState } = useChangeTransactionState(
    accountNameOwner,
  );
  const { mutate: updateTransaction } = useTransactionUpdate();
  const { mutate: deleteTransaction } = useTransactionDelete();
  const { mutate: insertReceiptImage } = useReceiptImageUpdate();
  const { mutate: insertTransaction } = useTransactionInsert(
    accountNameOwner,
  );
  const { mutate: insertValidationAmount } = useValidationAmountInsert();

  const handleSnackbarClose = () => {
    setOpen(false);
  };

  const handleError = (error: any, moduleName: any, throwIt: any) => {
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

  const storeTheFileContent = useCallback(async (file: any): Promise<any> => {
    let reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileContent(reader.result.toString());
      return reader.result;
    };
    reader.onerror = (error: any) => {
      handleError(error, "storeTheFile", false);
    };
  }, []);

  const getImageFileContents = useCallback(
    async (currentRow: Transaction): Promise<any> => {
      console.log("onClick photo-add");

      const fileSelector: HTMLInputElement = document.createElement("input");
      fileSelector.setAttribute("type", "file");
      fileSelector.addEventListener("change", (event: any) => {
        console.log("addEventListener is called.");
        let fileList = event.target.files;

        if (fileList[0].size >= 1024 * 1024) {
          console.log("maximum file size is 1MB");
          return;
        }

        if (
          fileList[0].type.match("image/jpeg") ||
          fileList[0].type.match("image/png")
        ) {
          if (fileList[0] instanceof Blob) {
            // @ts-ignore
            // console.log(
            //   `file ${fileList[0].name} is file type ${fileList[0].type}.`
            // );
            // image/jpeg
            // image/png
            // image/gif
            // image/webp
            setCurrentTransaction(currentRow);
            let response = storeTheFileContent(fileList[0]);
            console.log(response);
          } else {
            console.log(`file ${fileList[0].name} is not a blob.`);
          }
        } else {
          console.log(`file ${fileList[0].name} is not an image.`);
        }
      });
      fileSelector.click();
    },
    [storeTheFileContent],
  );

  const handlerToUpdateTransactionState = useCallback(
    async (
      guid: any,
      accountNameOwner: string,
      transactionState: any,
    ): Promise<any> => {
      try {
        updateTransactionState({
          guid: guid,
          transactionState: transactionState,
        });
        //await fetchTotals()
      } catch (error) {
        console.log(error);
        handleError(error, "updateTransactionState1", false);
      }
    },
    [updateTransactionState],
  );

  const handlerToUpdateTransactionType = useCallback(
    async (
      guid: any,
      accountNameOwner: string,
      transactionType: any,
    ): Promise<any> => {
      // try {
      //     updateTransactionState({
      //         guid: guid,
      //         transactionState: transactionState,
      //     });
      //     //await fetchTotals()
      // } catch (error) {
      //     console.log(error);
      //     handleError(error, "updateTransactionState1", false);
      // }
    },
    [],
  );

  const updateRow = (newData: any, oldData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          updateTransaction({ newRow: newData, oldRow: oldData });
          // @ts-ignore
          resolve();
        } catch (error) {
          handleError(error, "updateRow", false);
          reject();
        }
      }, 1000);
    });
  };

  const deleteRow = (oldData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          deleteTransaction({ oldRow: oldData });
          // @ts-ignore
          resolve();
        } catch (error) {
          handleError(error, "deleteRow", false);
          reject();
        }
      }, 1000);
    });
  };

  const addRow = (newData: Transaction): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          insertTransaction({
            accountNameOwner: newData.accountNameOwner,
            newRow: newData,
            isFutureTransaction: false,
          });
          // @ts-ignore
          resolve();
        } catch (error) {
          handleError(error, "addRow", false);
          reject();
        }
      }, 1000);
    });
  };

  const handleButtonClickLink = useCallback(
    async (newData: Transaction): Promise<any> => {
      try {
        insertTransaction({
          accountNameOwner: newData.accountNameOwner,
          newRow: newData,
          isFutureTransaction: true,
        });
      } catch (error) {
        handleError(error, "futureTransactionInsertPostCall", false);
      }
    },
    [insertTransaction],
  );

  const insertNewValidationData = (
    accountNameOwner: String,
    transactionState: TransactionState,
  ) => {
    console.log(accountNameOwner);

    let payload: ValidationAmount = {
      activeStatus: true,
      amount: totals.totalsCleared,
      transactionState: transactionState,
      validationDate: new Date(),
    };

    insertValidationAmount({
      accountNameOwner: accountNameOwner,
      payload: payload,
    });
  };

  const downHandler = useCallback(
    ({ key }: any) => {
      if (key === "Escape") {
        console.log(`escape key pressed: ${keyPressed}`);
        setKeyPressed(true);
      }
    },
    [keyPressed],
  );

  const upHandler = useCallback(({ key }: any) => {
    if (key === "Escape") {
      setKeyPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    if (fileContent !== "") {
      // @ts-ignore
      console.log(`current transactionId = ${currentTransaction.guid}`);
      insertReceiptImage({
        oldRow: currentTransaction,
        fileContent: fileContent,
      });

      let foundObject = data.filter((obj: any) => {
        // @ts-ignore
        return obj.guid === currentTransaction.guid;
      });
      if (foundObject.length === 1) {
        foundObject[0].receiptImage = { image: fileContent };
      }
      console.log(`objects found: ${foundObject.length}`);

      setFileContent("");
    }

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [
    data,
    downHandler,
    upHandler,
    fileContent,
    currentTransaction,
    insertReceiptImage,
  ]);

  let dateFormat = "YYYY-MM-DD";

  return (
    <div>
      {isSuccessValidationTotals && isSuccess && isSuccessTotals ? (
        <div>
          <MaterialTable
            columns={[
              {
                title: "date",
                field: "transactionDate",
                sorting: true,
                type: "date",
                initialEditValue: moment().format(dateFormat),
                cellStyle: { whiteSpace: "nowrap" },
                editComponent: (props) => (
                  <div>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DatePicker
                        selected={
                          props.value
                            ? new Date(moment(props.value).unix() * 1000)
                            : new Date(moment().unix() * 1000)
                        }
                        value={
                          props.value
                            ? moment(props.value).format(dateFormat)
                            : moment().format(dateFormat)
                        }
                        onChange={props.onChange}
                        readOnly={false}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                ),
              },
              {
                title: "description",
                field: "description",
                cellStyle: { whiteSpace: "nowrap" },
                render: (rowData) => {
                  return (
                    <div>
                      {rowData.description}
                      <Button
                        data-test-id="transaction-move-button"
                        style={{ fontSize: ".6rem" }}
                        onClick={() => {
                          setCurrentTransaction(rowData);
                          setLoadMoveDialog(true);
                        }}
                      >
                        <ChevronRightRounded />
                      </Button>
                    </div>
                  );
                },
                editComponent: (props) => {
                  return (
                    <>
                      <SelectDescription
                        data-test-id="transaction-edit-description"
                        onChangeFunction={props.onChange}
                        currentValue={() => {
                          return props.value ? props.value : "undefined";
                        }}
                      />
                    </>
                  );
                },
              },
              {
                title: "category",
                field: "category",
                cellStyle: { whiteSpace: "nowrap" },

                editComponent: (props) => {
                  return (
                    <>
                      <SelectCategory
                        onChangeFunction={props.onChange}
                        currentValue={() => {
                          return props.value ? props.value : "none";
                        }}
                      />
                    </>
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
                title: "state",
                field: "transactionState",
                cellStyle: { whiteSpace: "nowrap" },
                render: (rowData) => {
                  return (
                    <div className="displayed">
                      <HoverButtons
                        transactionState={rowData.transactionState}
                        guid={rowData.guid}
                        accountNameOwner={rowData.accountNameOwner}
                        handlerToUpdateTransactionState={
                          handlerToUpdateTransactionState
                        }
                      />
                    </div>
                  );
                },
                editComponent: (props) => {
                  return (
                    <>
                      <SelectTransactionState
                        onChangeFunction={props.onChange}
                        currentValue={() => {
                          return props.rowData.transactionState
                            ? props.rowData.transactionState
                            : "outstanding";
                        }}
                      />
                    </>
                  );
                },
              },

              {
                title: "type",
                field: "transactionType",
                cellStyle: { whiteSpace: "nowrap" },
                render: (rowData) => {
                  return rowData.transactionType
                    ? rowData.transactionType
                    : "looks to be undefined";
                },
                editComponent: (props) => {
                  return (
                    <>
                      <SelectTransactionType
                        onChangeFunction={props.onChange}
                        currentValue={() => {
                          return props.rowData.transactionType
                            ? props.rowData.transactionType
                            : "undefined";
                        }}
                      />
                    </>
                  );
                },
              },

              {
                title: "reoccur",
                field: "reoccurringType",
                //TODO: Look into these options
                //defaultSort: "asc",
                //customSort: (a, b): number => a.remaining - b.remaining,
                cellStyle: { whiteSpace: "nowrap" },
                render: (rowData) => {
                  if (
                    rowData.reoccurringType === "onetime" ||
                    rowData.reoccurringType === "undefined"
                  ) {
                    return <>{rowData.reoccurringType}</>;
                  } else {
                    return (
                      <>
                        {rowData.reoccurringType}
                        <Button
                          style={{ width: 50 }}
                          onClick={() => handleButtonClickLink(rowData)}
                        >
                          <ChevronRightRounded />
                        </Button>
                      </>
                    );
                  }
                },
                editComponent: (props) => {
                  return (
                    <>
                      <SelectReoccurringType
                        newAccountType={props.rowData.accountType}
                        onChangeFunction={props.onChange}
                        currentValue={() => {
                          if (props.value) {
                            return props.value;
                          } else {
                            return "onetime";
                          }
                        }}
                      />
                    </>
                  );
                },
              },
              {
                title: "notes",
                field: "notes",
                cellStyle: { whiteSpace: "nowrap" },
              },
              // {
              //   title: "due",
              //   field: "dueDate",
              //   type: "date",
              //   cellStyle: { whiteSpace: "nowrap" },
              //   editComponent: (props) => (
              //     <MuiPickersUtilsProvider utils={MomentUtils}>
              //       <DatePicker
              //         value={
              //           props.value
              //             ? moment(props.value).format(dateFormat)
              //             : ""
              //         }
              //         onChange={props.onChange}
              //       />
              //     </MuiPickersUtilsProvider>
              //   ),
              // },
              {
                title: "image",
                field: "receiptImage",
                editable: "never",
                filtering: false,
                cellStyle: { whiteSpace: "nowrap" },
                render: (rowData: Transaction) => {
                  let image = "";
                  if (rowData["receiptImage"] !== undefined) {
                    if (rowData["receiptImage"].thumbnail === undefined) {
                      rowData["receiptImage"].thumbnail =
                        rowData["receiptImage"].image;
                    }

                    if (rowData.receiptImage.image.startsWith("data")) {
                      //TODO: needs to be added bck
                      //image = rowData.receiptImage.thumbnail
                    } else {
                      const formatType = rowData.receiptImage.imageFormatType;
                      image =
                        "data:image/" +
                        formatType +
                        ";base64," +
                        rowData.receiptImage.thumbnail;
                    }
                  } else {
                  }

                  return (
                    <div>
                      {rowData["receiptImage"] !== undefined ? (
                        <img
                          className="receipt-image"
                          alt="receipt"
                          src={image}
                        />
                      ) : (
                        <div>
                          <Button
                            onClick={() => {
                              let response = getImageFileContents(rowData);
                              console.log("response" + response);
                            }}
                          >
                            <AddAPhoto />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                },
              },
            ]}
            data={data}
            title={`[${accountNameOwner}] [ $${currencyFormat(
              noNaN(totals["totals"]),
            )} ] [ $${currencyFormat(
              noNaN(totals["totalsCleared"]),
            )} ]  [ $${currencyFormat(
              noNaN(totals["totalsOutstanding"]),
            )} ] [ $${currencyFormat(noNaN(totals["totalsFuture"]))} ]`}
            components={{
              Pagination: (props) => {
                return (
                  <td className="right">
                    <Button
                      onClick={() =>
                        insertNewValidationData(
                          accountNameOwner,
                          "cleared",
                        )
                      }
                    >
                      {validationData.amount
                        ? validationData.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "$0.00"}{" "}
                      {" - "}{" "}
                      {validationData.validationDate
                        ? epochToDate(
                            validationData.validationDate,
                          ).toLocaleString()
                        : "1970-01-01T00:00:00:000Z"}
                    </Button>
                    <TablePagination
                      component="div"
                      count={props.count}
                      page={props.page}
                      rowsPerPage={props.rowsPerPage}
                      rowsPerPageOptions={[25, 50, 75, 100]}
                      onRowsPerPageChange={props.onChangeRowsPerPage}
                      onPageChange={props.onPageChange}
                    />
                  </td>
                );
              },
            }}
            options={{
              actionsColumnIndex: -1,
              selection: true,
              filtering: true,
              paging: true,
              pageSize: 25,
              pageSizeOptions: [25, 50, 75, 100],
              addRowPosition: "first",
              search: true,
              toolbar: true,
              paginationPosition: "both",
              emptyRowsWhenPaging: false,
              headerStyle: {
                backgroundColor: "#9965f4",
                color: "white",
                zIndex: 0,
              },

              rowStyle: (rowData): any => {
                if (rowData.transactionState !== null) {
                  if (rowData.transactionState === "cleared") {
                    //return { fontSize: ".6rem" };
                    return {};
                  } else if (rowData.transactionState === "future") {
                    return {
                      backgroundColor: "#5800f9",
                      color: "white",
                    };
                  } else if (rowData.transactionState === "outstanding") {
                    return {
                      backgroundColor: "#4000f1",
                      color: "white",
                    };
                  } else {
                    return {
                      backgroundColor: "#000000",
                      color: "white",
                    };
                  }
                } else {
                  console.log("rowData.transactionState is a null value.");
                }
              },
            }}
            editable={{
              onRowAdd: addRow,
              onRowUpdate: updateRow,
              onRowDelete: deleteRow,
            }}
          />
          {loadMoveDialog ? (
            <TransactionMove
              closeDialog={() => {
                setLoadMoveDialog(false);
              }}
              currentTransaction={currentTransaction}
            />
          ) : null}
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
    </div>
  );
}
