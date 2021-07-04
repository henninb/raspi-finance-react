import React, {useState} from "react"
import MaterialTable from "material-table"
import "./main.scss"
import SelectAccountNameOwnerCredit from "./SelectAccountNameOwnerCredit"
import Spinner from "./Spinner"
import {fetchTimeZone} from "./Common"
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
import useFetchParameter from "./queries/useFetchParameter";

export default function PaymentTable() {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const history = useHistory()

    const {data, isSuccess} = useFetchPayment()
    const {data: parmData, isSuccess: parmSuccess} = useFetchParameter('payment_account')
    const {mutate: insertPayment} = usePaymentInsert()
    const {mutate: deletePayment} = usePaymentDelete()

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const handleButtonClickLink = (oldRow) => {
        history.push("/transactions/" + oldRow.accountNameOwner)
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

    return (
        <div>
            {isSuccess && parmSuccess ? (
                <div className="table-formatting">
                    <MaterialTable
                        data-testid="payment-table"
                        columns={[
                            {
                                title: "transactionDate",
                                field: "transactionDate",
                                type: "date",
                                initialEditValue: moment(new Date().toDateString()).format('YYYY-MM-DD'),
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
                                                handleButtonClickLink(rowData)
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
                                initialEditValue: (parmData) ? parmData.parameterValue: "undefined parmData"
                                ,
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
                                            console.log("oldData: " + JSON.stringify(oldData))
                                            await deletePayment({oldRow: oldData})
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
