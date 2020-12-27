import Spinner from "./Spinner";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {endpointUrl} from "./Common";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

export default function PaymentRequired() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const history = useHistory()

    const handleButtonClickLink = (accountNameOwner) => {
        history.push("/transactions/" + accountNameOwner)
        history.go(0)
    }

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + "/transaction/payment/required",
                {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                }
            )
            if (response.data.length > 0) {
                setData(response.data)
            }

        } catch (error) {
            //handleError(error, 'fetchData', true)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        //setLoading(false)
        fetchData()
    })

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
                                title: "unbalanced",
                                field: "totals",
                                type: "currency",
                                editable: "never",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "balanced",
                                field: "totalsBalanced",
                                type: "currency",
                                editable: "never",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                        ]}
                        data={data}
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