import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";

export default function AccountSummaryTable() {

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'http://localhost:8080/account/select/totals',
            );

            setData(result.data);
            console.log('fetch data called.')
            setLoading(false);
        };

        fetchData().then(() => console.log('called fetchData.'));
    }, []);


    const [loading, setLoading] = useState(true);

    const [data, setData] = useState([]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "guid", field: "guid"},
                            {title: "accountNameOwner", field: "accountNameOwner"},
                            {title: "accountType", field: "accountType"},
                            {title: "unbalanced", field: "totals", type: "currency"},
                            {title: "balanced", field: "totalsBalanced", type: "currency"},
                        ]}
                        data={data}
                        title="AccountSummary"
                        options={{
                            paging: false,
                            search: true
                        }}

                        editable={{
                            onRowAddCancelled: rowData => console.log("Row adding cancelled" + rowData),
                            onRowDeleteCancelled: rowData => console.log("Row deleting cancelled" + rowData),
                            onRowUpdateCancelled: rowData => console.log("Row editing cancelled" + rowData),
                            onRowAdd: newData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        setData([...data, newData]);
                                        resolve();
                                    }, 1000);
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        const dataUpdate = [...data];
                                        const index = oldData.tableData.id;
                                        dataUpdate[index] = newData;
                                        setData([...dataUpdate]);
                                        resolve();
                                    }, 1000);
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        const dataDelete = [...data];
                                        const index = oldData.tableData.id;
                                        dataDelete.splice(index, 1);
                                        setData([...dataDelete]);
                                        resolve();
                                    }, 1000);
                                })
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}

