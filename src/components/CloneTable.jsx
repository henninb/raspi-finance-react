import MaterialTable from "material-table";
// import Button from "@material-ui/core/Button";
import Spinner from "./Spinner";
import React, {useEffect, useState} from "react";

export default function CloneTable() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {
                                title: "accountNameOwner", field: "accountNameOwner", cellStyle: {whiteSpace: "nowrap"},
                            },
                            {title: "unbalanced", field: "totals", type: "currency", cellStyle: {whiteSpace: "nowrap"}},
                            {
                                title: "balanced",
                                field: "totalsBalanced",
                                type: "currency",
                                cellStyle: {whiteSpace: "nowrap"}
                            },
                        ]}
                        // data={data}
                        title={'test'}
                        options={{
                            paging: false,
                            search: true,
                            addRowPosition: "first",
                            headerStyle: {backgroundColor: '#01579b', color: '#FFF',},
                            rowStyle: {fontSize: '.6rem',}
                        }}

                        editable={{}}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}
