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
                            {title: "accountNameOwner", field: "accountNameOwner"},
                            {title: "amount", field: "amount"},
                        ]}
                        data={data}
                        title="Payment"
                        options={{
                            paging: false,
                            search: true
                        }}

                        editable={{
                            onRowAdd: addRow,
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}