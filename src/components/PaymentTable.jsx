import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";

export default function PaymentTable() {

    const addRow = (newData) => {
        return new Promise((resolve) => {
            //TODO: add validation and reject()
            //reject();

            setTimeout(() => {
                setData([...data, newData]);
                //postCall(newData)
                resolve();
            }, 1000);
        });
    }

    useEffect(() => {
        setLoading(false);
    }, []);


    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "transactionDate", field: "transactionDate", type: "date"},
                            {title: "account", field: "accountNameOwner"},
                            {title: "amount", field: "amount"},
                            {title: "status", field: "status"},
                        ]}
                        data={data}
                        title="Payments"
                        options={{
                            paging: false,
                            search: false
                        }}

                        editable={{
                            onRowAdd: addRow,
                            onRowDelete: oldData => console.log('delete'),
                            onRowUpdate: (newData, oldData) => console.log('update')
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}