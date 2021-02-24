import React, {useCallback, useEffect, useState} from "react"
import MaterialTable from "material-table"
import "./master.scss"
import axios from "axios"
import SelectAccountNameOwnerCredit from "./SelectAccountNameOwnerCredit"
import Spinner from "./Spinner"
import {endpointUrl, fetchTimeZone} from "./Common"
import {useHistory} from "react-router-dom"
import Button from "@material-ui/core/Button"
import SnackbarBaseline from "./SnackbarBaseline";
import moment from "moment";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DatePicker from "react-datepicker";

export default function PaymentTable() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [paymentAccount, setPaymentAccount] = useState('undefined')

    const history = useHistory()

    const handleSnackbarClose = () => {
        setOpen(false);
    };

    const handleButtonClickLink = (accountNameOwner) => {
        history.push("/transactions/" + accountNameOwner)
        history.go(0)
    }

    const handleError = (error, moduleName, throwIt) => {
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

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const newPayload = await postCallPayment(newData)
                    if (!verifyData(newPayload)) {
                        reject()
                    }
                    // @ts-ignore
                    setData([newPayload, ...data])
                    resolve()
                } catch (error) {
                    handleError(error, 'addRow', false)
                    reject()
                }
            }, 1000)
        })
    }

    const fetchParameterValue = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + "/parm/select/payment_account",
                {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                }
            )

            if (response.data) {
               setPaymentAccount(response.data.parameterValue)
               setMessage(`${response.data.parameterValue}`)
               setOpen(true)
            } else {
                console.log('payment_account parameter needs to be set.')
            }

        } catch (error) {
            handleError(error, 'fetchParameterValue', true)
        } finally {
            //setLoading(false)
        }
    }, [])

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + "/payment/select",
                {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                }
            )
            if (response.data.length > 0) {
                setData(response.data)
            }

        } catch (error) {
            handleError(error, 'fetchData', true)
        } finally {
            setLoading(false)
        }
    }, [])

    const verifyData = (newData) => {
        if (isNaN(newData.amount)) return false
        // if(newData.amount === undefined) return false;
        // if(newData.transactionDate === undefined) return false;
        // return newData.accountNameOwner !== undefined;
        return true
    }

    const postCallPayment = useCallback(async (payload) => {
        let CancelToken = axios.CancelToken
        let source = CancelToken.source()
        let endpoint = endpointUrl() + "/payment/insert/"
        let newPayload = {
            accountNameOwner: payload.accountNameOwner,
            amount: payload.amount,
            transactionDate: payload.transactionDate.toISOString(),
        }

        try {
            let response = await axios.post(endpoint, newPayload, {
                timeout: 0,
                headers: {"Content-Type": "application/json"},
                cancelToken: source.token,
            })
            console.log(response.data)
            return newPayload
        } catch (error) {
            handleError(error, 'postCallPayment', true)
        }
    }, [])

    const deleteCall = useCallback(async (payload) => {
        let endpoint = endpointUrl() + "/payment/delete/" + payload["paymentId"]

        try {
            await axios.delete(endpoint, {
                timeout: 0,
                headers: {"Content-Type": "application/json"},
            })
        } catch (error) {
            handleError(error, 'postCallPayment', true)
        }
    }, [])

    useEffect(() => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

        if (data === undefined) {
            console.log("data is undefined")
        }

        if ( paymentAccount === 'undefined' ) {
            let response = fetchParameterValue()
            console.log(response)
        }

        if (data.length === 0) {
            let response = fetchData()
            console.log(response)
        }

        return () => {
            source.cancel()
        }
    }, [data, fetchData, fetchParameterValue, paymentAccount])

    let today = moment(new Date().toDateString()).format('YYYY-MM-DD')

    return (

        <div>
            {!loading ? (
                <div className="table-formatting">
                    <MaterialTable
                        data-testid="payment-table"
                        columns={[
                            {
                                title: "transactionDate",
                                field: "transactionDate",
                                type: "date",
                                initialEditValue: today,
                                cellStyle: {whiteSpace: "nowrap"},

                                editComponent: (props) => (

                                    <MuiPickersUtilsProvider utils={MomentUtils}
                                                             locale={props.dateTimePickerLocalization}>
                                        <DatePicker
                                            placeholderText='yyyy-MM-dd'
                                            format="yyyy-MM-dd"
                                            selected={moment(props.value).tz(fetchTimeZone()).toDate()}

                                            value={props.value
                                                ? moment(props.value).format('YYYY-MM-DD') : moment(new Date().toDateString()).format('YYYY-MM-DD')}
                                            onChange={props.onChange}
                                            clearable
                                        />
                                    </MuiPickersUtilsProvider>
                                ),

                                render: (rowData) => {
                                    return <div>{rowData.transactionDate}</div>
                                },
                            },
                            {
                                title: "accountNameOwner",
                                field: "accountNameOwner",

                                cellStyle: {
                                    whiteSpace: "nowrap",
                                },

                                headerStyle: {
                                },

                                render: (rowData) => {
                                    return (
                                        <Button
                                            style={{fontSize: ".6rem"}}
                                            onClick={() =>
                                                handleButtonClickLink(rowData.accountNameOwner)
                                            }
                                        >
                                            {rowData.accountNameOwner}
                                        </Button>
                                    )
                                },
                                editComponent: (props) => {
                                    return (
                                        <div className="container">
                                            <div>
                                                <SelectAccountNameOwnerCredit
                                                    onChangeFunction={props.onChange}
                                                    currentValue={props.value}
                                                />
                                            </div>
                                        </div>
                                    )
                                },
                            },
                            {
                                title: "amount",
                                field: "amount",
                                type: "currency",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "source",
                                field: "sourceAccount",
                                type: "string",
                                initialEditValue: paymentAccount,
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                        ]}
                        data={data}
                        title="Payments"
                        options={{
                            paging: true,
                            paginationPosition: "both",
                            pageSize: 20,
                            addRowPosition: "first",
                            search: false,
                            headerStyle: {
                                backgroundColor: "#9965f4",
                                color: "#FFF",
                                // position: 'sticky', top: 0
                            },
                            rowStyle: {
                                fontSize: ".6rem",
                            },

                        }}
                        editable={{
                            onRowAdd: addRow,
                            onRowDelete: (oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        const dataDelete = [...data]
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
