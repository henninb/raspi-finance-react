import React, {useCallback, useEffect, useState} from "react"
import MaterialTable from "material-table"
import Spinner from "./Spinner"
import "./master.scss"
import axios from "axios"
import Button from "@material-ui/core/Button"
import {useHistory} from "react-router-dom"
import {endpointUrl} from "./Common"
import SnackbarBaseline from "./SnackbarBaseline";

export default function AccountSummaryTable() {
    const [totals, setTotals] = useState([])
    const [loading, setLoading] = useState(true)
    const [accountData, setData] = useState([])
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const history = useHistory()

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
                    const newPayload = await postCall(newData)
                    if (newPayload) {
                        setData([newPayload, ...accountData])
                    }
                    resolve()
                } catch (error) {
                    handleError(error, 'addRow', false)
                    reject()
                }
            }, 1000)
        })
    }

    const postCall = useCallback(async (payload) => {
        let CancelToken = axios.CancelToken
        let source = CancelToken.source()
        let endpoint = endpointUrl() + "/account/insert/"

        const now = new Date()
        payload.totals = 0.0
        payload.totalsBalanced = 0.0
        payload.dateClosed = 0
        payload.dateAdded = Math.round(now.getTime())
        payload.dateUpdated = Math.round(now.getTime())
        payload.activeStatus = true

        try {
            let response = await axios.post(endpoint, payload, {
                timeout: 0,
                headers: {"Content-Type": "application/json"},
                cancelToken: source.token,
            })
            console.log(response)
            return payload
        } catch (error) {
            handleError(error, 'postCall', true)
        }
    }, [])

    const currencyFormat = (inputData) => {
        inputData = parseFloat(inputData).toFixed(2)
        return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const deleteCall = useCallback(async (payload) => {
        let endpoint = endpointUrl() + "/account/delete/" + payload.accountNameOwner
        try {
            let response = await axios.delete(endpoint, {
                timeout: 0,
                headers: {"Content-Type": "application/json"},
            })
            console.log(response)
        } catch (error) {
            handleError(error, 'deleteCall', true)
        }
    }, [])

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

    const fetchData = useCallback(async () => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

        try {
            const response = await axios.get(endpointUrl() + "/account/select/active",
                {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                }
            )
            setData(response.data)
        } catch (error) {
            handleError(error, 'fetchData', true)
        } finally {
            setLoading(false)
        }

        return () => {
            source.cancel()
        }
    }, [])

    useEffect(() => {
        if (accountData.length === 0) {
            let response = fetchData()
            console.log(response)
            setMessage("data loaded")
            setOpen(true)
        }

        if (totals.length === 0) {
            let response = fetchTotals()
            console.log(response)
        }

        return () => {
        }
    }, [totals, accountData, fetchData, fetchTotals])

    return (
        <div>
            {!loading ? (
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
                        data={accountData}
                        title={` [ $${currencyFormat(
                            totals["totalsCleared"]
                        )} ], [ $${currencyFormat(totals["totals"])} ]`}
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
                            onRowDelete: (oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        const dataDelete = [...accountData]
                                        const index = oldData.tableData.id
                                        dataDelete.splice(index, 1)
                                        try {
                                            await deleteCall(oldData)
                                            setData([...dataDelete])
                                            resolve()
                                        } catch (error) {
                                            handleError(error, 'onRowDelete', false)
                                            reject()
                                        }
                                    }, 1000)
                                }),
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
