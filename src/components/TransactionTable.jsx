import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import axios from 'axios';
import Spinner from './Spinner';
import './master.scss';

export default function TransactionTable() {

    const [loading, setLoading] = useState(true);

    const addRow = (newData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setData([...data, newData]);
                resolve();
            }, 1000);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'http://localhost:8080/transaction/account/select/amazon_brian',
            );

            setData(result.data);
            console.log('fetch data called.')
            setLoading(false);
        };

        fetchData().then(() => console.log('called fetchData.'));
    }, []);

    const [data, setData] = useState([]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            //{ title: "guid", field: "guid" },
                            {title: "date", field: "transactionDate", type: 'date'},
                            {title: "description", field: "description"},
                            {title: "category", field: "category"},
                            {title: "amount", field: "amount", type: "currency"},
                            {title: "cleared", field: "cleared", type: "numeric"},
                            {title: "notes", field: "notes"}, //TODO: add a custom text box for notes
                            //{ title: "dateAdded", field: "dateAdded", type: "date"},
                            //{ title: "dateUpdated", field: "dateUpdated", type: "date"},
                        ]}
                        data={data}
                        title="Transactions"
                        options={{
                            paging: true,
                            pageSize: 15,
                            addRowPosition: "first",
                            search: true
                        }}

                        editable={{
                            onRowAdd: addRow,
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
                                        //TODO: axios rest call to delete from database
                                        resolve();
                                    }, 1000);
                                })
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}

