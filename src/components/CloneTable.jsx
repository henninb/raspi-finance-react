import MaterialTable from "material-table"
import Spinner from "./Spinner"
import React, {useEffect, useState} from "react"

//TODO: this is an unused component as of 11/19/2020
export default function CloneTable() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    // @ts-ignore
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
                            },
                            {
                                title: "unbalanced",
                                field: "totals",
                                type: "currency",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "balanced",
                                field: "totalsBalanced",
                                type: "currency",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                        ]}
                        title={"test"}
                        options={{
                            paging: false,
                            search: true,
                            addRowPosition: "first",
                            headerStyle: {backgroundColor: "#01579b", color: "#FFF"},
                            rowStyle: {fontSize: ".6rem"},
                        }}
                        editable={{}}
                        data={{}}
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
