import Spinner from "./Spinner";
import React from "react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
import useFetchPaymentRequired from "./queries/useFetchPaymentRequired";

export default function PaymentRequired() {
    const history = useHistory()

    const {data, isSuccess, isLoading} = useFetchPaymentRequired()

    const handleButtonClickLink = (accountNameOwner: String) => {
        history.push("/transactions/" + accountNameOwner)
        history.go(0)
    }

    return (
        <div>
            {!isLoading && isSuccess ? (
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
                                    return (rowData.cleared + rowData.outstanding + rowData.future).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    });
                                },
                            },
                        ]}
                        data={data}
                        title="Payment Required"
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
                    />
                </div>
            ) : (
                <div className="centered">
                    <Spinner/>
                </div>
            )}
        </div>
    )
}
