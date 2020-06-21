import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";
import uuid from "react-uuid";

export default function PaymentTable() {

    const addRow = (newData) => {
        return new Promise((resolve) => {
            //TODO: add validation and reject()
            //reject();

            setTimeout(async() => {
                setData([...data, newData]);
                await postCall(newData)
                resolve();
            }, 1000);
        });
    }

    const toEpochDateAsMillis = (transactionDate) => {
        let date_val = new Date(transactionDate);
        let utc_val = new Date(date_val.getTime() + date_val.getTimezoneOffset() * 60000);

        return utc_val.valueOf();
    };

    const postCall = async (payload) => {
        let endpoint = 'http://localhost:8080/transaction/insert/';
        let accountPayload = {};
        let bankPayload = {};

        accountPayload['guid'] = uuid();
        accountPayload['transactionDate'] = toEpochDateAsMillis(payload.transactionDate);
        accountPayload['description'] = 'payment';
        accountPayload['category'] = 'bill_pay';
        accountPayload['notes'] = 'from bcu';
        accountPayload['amount'] = payload.amount;
        accountPayload['cleared'] = 0;
        accountPayload['accountType'] = 'credit';
        accountPayload['reoccurring'] = false
        accountPayload['accountNameOwner'] = payload.accountNameOwner;

        bankPayload['guid'] = uuid();
        bankPayload['transactionDate'] = toEpochDateAsMillis(payload.transactionDate);
        bankPayload['description'] = 'payment';
        bankPayload['category'] = 'bill_pay';
        bankPayload['notes'] = 'to ' + payload.accountNameOwner;
        bankPayload['amount'] = payload.amount * (-1.0);
        bankPayload['cleared'] = 0;
        bankPayload['accountType'] = 'debit';
        bankPayload['reoccurring'] = false
        bankPayload['accountNameOwner'] = 'bcu-checking_brian';

        let response = await axios.post(endpoint, accountPayload, { timeout: 0, headers: {  'Content-Type': 'application/json'}})
        if (response.status !== 200 ) {
            alert(JSON.stringify(response))
        }
        response = await axios.post(endpoint, bankPayload, { timeout: 0, headers: {  'Content-Type': 'application/json'}})
        if (response.status !== 200 ) {
            alert(JSON.stringify(response))
        }
    };

    useEffect(() => {
        setData([]);
    }, []);

    const [data, setData] = useState([]);

    return (
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "transactionDate", field: "transactionDate", type: "date"},
                            {title: "account", field: "accountNameOwner"},
                            {title: "amount", field: "amount"},
                            //{title: "status", field: "status"},
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
                </div>
    )
}