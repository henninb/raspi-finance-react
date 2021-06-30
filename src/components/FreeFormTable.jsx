import React, {useCallback, useEffect, useState} from 'react'
import MaterialTable from "material-table";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DatePicker from "react-datepicker";
import moment from "moment";
import {currencyFormat, fetchTimeZone, noNaN, typeOf} from "./Common";
import SelectDescription from "./SelectDescription";
import SelectCategory from "./SelectCategory";
import SelectTransactionState from "./SelectTransactionState";
import SelectReoccurringType from "./SelectReoccurringType";


export default function FreeFormTable() {

    const [data, setData] = useState([])

    return (
        <div>
                <div className="table-formatting">

                    <MaterialTable
                        columns={[
                            {
                                title: "accountNameOwner",
                                field: "accountNameOwner",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "date",
                                field: "transactionDate",
                                type: "date",
                                initialEditValue: moment(new Date().toDateString()).format('YYYY-MM-DD'),
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => (

                                    <div>
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
                                    </div>
                                ),
                            },
                            {
                                title: "description",
                                field: "description",
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectDescription
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "undefined"
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "category",
                                field: "category",
                                cellStyle: {whiteSpace: "nowrap"},

                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectCategory
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "none"
                                                    }
                                                }}
                                            />
                                        </>
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
                                title: "state",
                                field: "transactionState",
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectTransactionState
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "outstanding"
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "reoccur",
                                field: "reoccurringType",
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectReoccurringType
                                                newAccountType = {props.rowData.accountType}
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "onetime"
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "notes",
                                field: "notes",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "due",
                                field: "dueDate",
                                type: "date",
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => (

                                    <MuiPickersUtilsProvider utils={MomentUtils}
                                                             locale={props.dateTimePickerLocalization}>
                                        <DatePicker
                                            placeholderText='yyyy-MM-dd'
                                            format="yyyy-MM-dd"
                                            selected={moment(props.value).tz(fetchTimeZone()).toDate()}
                                            value={props.value  ? moment(props.value).format('YYYY-MM-DD') : ""}
                                            onChange={props.onChange}
                                            clearable
                                        />
                                    </MuiPickersUtilsProvider>
                                )
                            },
                        ]}
                        data={data}
                        title="test"
                        options={{
                            filtering: true,
                            // selection: true,
                            paging: false,
                            //pageSize: 20,
                            addRowPosition: "first",
                            search: true,
                            paginationPosition: "both",
                            headerStyle: {
                                backgroundColor: "#9965f4",
                                color: "#FFF",
                            },
                            rowStyle: (rowData) => {
                                if( rowData.transactionState !== null ) {
                                    if (rowData.transactionState.toLowerCase() === "cleared") {
                                        return {fontSize: ".6rem"}
                                    } else if (rowData.transactionState.toLowerCase() === "future") {
                                        return {
                                            fontSize: ".6rem",
                                            fontWeight: "bold",
                                            backgroundColor: "#5800f9",
                                            color: "#FFF",
                                        }
                                    } else if (rowData.transactionState.toLowerCase() === "outstanding") {
                                        return {
                                            fontSize: ".6rem",
                                            fontWeight: "bold",
                                            backgroundColor: "#4000f1",
                                            color: "#FFF",
                                        }
                                    } else {
                                        return {
                                            fontSize: ".6rem",
                                            fontWeight: "bold",
                                            backgroundColor: "#000000",
                                            color: "#FFF",
                                        }
                                    }
                                } else {
                                    console.log("rowData.transactionState is a null value.")
                                }
                            },
                        }}

                        actions={[
                        ]}
                    />

                </div>
        </div>
    )
}
