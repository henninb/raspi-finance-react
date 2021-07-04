import React, {useCallback, useEffect, useState} from "react"
import MaterialTable from "material-table"
import Spinner from "./Spinner"
import "./main.scss"
import axios from "axios"
import Button from "@material-ui/core/Button"
import {useHistory} from "react-router-dom"
import {currencyFormat, endpointUrl, noNaN} from "./Common"
import SnackbarBaseline from "./SnackbarBaseline"
import useFetchAccount from "./queries/useFetchAccount";
import useAccountInsert from "./queries/useAccountInsert";
import useAccountDelete from "./queries/useAccountDelete";

export default function AccountSummaryTable() {
    const [totals, setTotals] = useState([])
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const history = useHistory()

    const {data, isSuccess, isLoading} = useFetchAccount()
    const {mutate: insertAccount} = useAccountInsert()
    const {mutate: deleteAccount} = useAccountDelete()

    const handleButtonClickLink = (accountNameOwner) => {
        history.push("/transactions/" + accountNameOwner)
        history.go(0)
    }

    const handleError = (error, moduleName, throwIt) =>  {
        if (error.response) {
            setMessage(`${moduleName}: ${error.response.status} and ${JSON.stringify(error.response.data)}`)
            console.log(`${moduleName}: ${error.response.status} and ${JSON.stringify(error.response.data)}`)
            setOpen(true)
        } else {
            setMessage(`${moduleName}: failure`)
            console.log(`${moduleName}: failure`)
            setOpen(true)
            if (throwIt) {
                throw  error
            }
        }
    }

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await insertAccount({payload: newData})
                    resolve()
                } catch (error) {
                    handleError(error, 'addRow', false)
                    reject()
                }
            }, 1000)
        })
    }

    const deleteRow = (oldData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await deleteAccount({oldRow: oldData})
                    resolve()
                } catch (error) {
                    handleError(error, 'onRowDelete', false)
                    reject()
                }
            }, 1000)
        })
    }

    const fetchTotals = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + "/account/totals",
                {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                }
            )
            setTotals(response.data)
        } catch (error) {
            handleError(error, 'fetchTotals', true)
        }
    }, [])

    useEffect(() => {
        if (totals.length === 0) {
            let response = fetchTotals()
            console.log(response)
        }

        return () => {
        }
    }, [totals, fetchTotals])

    return (
        <div>
            { !isLoading && isSuccess   ? (
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {
                                title: "accountNameOwner",
                                field: "accountNameOwner",
                                cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    return (
                                        <Button
                                            onClick={() =>
                                                handleButtonClickLink(rowData.accountNameOwner)
                                            }
                                        >
                                            {rowData.accountNameOwner}
                                        </Button>
                                    )
                                },
                            },
                            {
                                title: "accountType",
                                field: "accountType",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "moniker",
                                field: "moniker",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "future",
                                field: "future",
                                type: "currency",
                                editable: "never",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "outstanding",
                                field: "outstanding",
                                type: "currency",
                                editable: "never",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "cleared",
                                field: "cleared",
                                type: "currency",
                                editable: "never",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "aftermath",
                                type: "currency",
                                editable: "never",
                                cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                  return (rowData.cleared  + rowData.outstanding + rowData.future).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    });
                                },
                            },
                        ]}
                        data={data}
                        title={`[ $${currencyFormat(noNaN(totals["totals"]))} ] [ $${currencyFormat(noNaN(totals["totalsCleared"]))} ]  [ $${currencyFormat(noNaN(totals["totalsOutstanding"]))} ] [ $${currencyFormat(noNaN(totals["totalsFuture"]))} ]`}
                        options={{
                            paging: false,
                            search: true,
                            addRowPosition: "first",
                            headerStyle: {
                                backgroundColor: "#9965f4",
                                color: "#FFF",
                                // position: 'sticky', top: 0
                            },
                            rowStyle: {fontSize: ".6rem"},
                        }}
                        editable={{
                            onRowAdd: addRow,
                            onRowDelete: deleteRow,
                        }}
                    />
                    <div>
                        <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
                    </div>
                </div>

            ) : (
                <div className="centered">
                    <Spinner/>
                </div>
            )}
        </div>
    )
}
