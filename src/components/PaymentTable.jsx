import React, {useCallback, useEffect, useState} from "react"
import MaterialTable from "material-table"
import "./main.scss"
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
import useFetchPayment from "./queries/useFetchPayment";
import usePaymentInsert from "./queries/usePaymentInsert";
import usePaymentDelete from "./queries/usePaymentDelete";

export default function PaymentTable() {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [paymentAccount, setPaymentAccount] = useState('undefined')

    const history = useHistory()

    const {data, isSuccess, isLoading} = useFetchPayment()
    const {mutate: insertPayment} = usePaymentInsert()
    const {mutate: deletePayment} = usePaymentDelete()

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
                    await insertPayment({payload: newData})
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
        if ( paymentAccount === 'undefined' ) {
            let response = fetchParameterValue()
            console.log(response)
        }

        return () => {
        }
    }, [fetchParameterValue, paymentAccount])

    let today = moment(new Date().toDateString()).format('YYYY-MM-DD')

    return (

        <div>
            {!isLoading && isSuccess ? (
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

                                // render: (rowData) => {
                                //     return <div>{rowData.transactionDate}</div>
                                // },
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
                                        try {
                                            await deleteCall(oldData)
                                            await deletePayment({payload: oldData})
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
