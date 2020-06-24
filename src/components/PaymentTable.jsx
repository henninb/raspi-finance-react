import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import './master.scss';
import axios from "axios";
//import uuid from "react-uuid";
import { v4 as uuidv4 } from 'uuid';

export default function PaymentTable() {

    const [data, setData] = useState([]);

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                setData([...data, newData]);
                try {
                    await postCall(newData);
                    resolve();
                } catch (error) {
                    if (error.response) {
                        alert(JSON.stringify(error.response.data));
                    }
                    reject();
                }

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

        accountPayload['guid'] = uuidv4();
        //accountPayload['guid'] = uuid();
        accountPayload['transactionDate'] = toEpochDateAsMillis(payload.transactionDate);
        accountPayload['description'] = 'payment';
        accountPayload['category'] = 'bill_pay';
        accountPayload['notes'] = 'from bcu';
        accountPayload['amount'] = payload.amount;
        accountPayload['cleared'] = 0;
        accountPayload['accountType'] = 'credit';
        accountPayload['reoccurring'] = false
        accountPayload['accountNameOwner'] = payload.accountNameOwner;

        bankPayload['guid'] = uuidv4();
        //bankPayload['guid'] = uuid();
        bankPayload['transactionDate'] = toEpochDateAsMillis(payload.transactionDate);
        bankPayload['description'] = 'payment';
        bankPayload['category'] = 'bill_pay';
        bankPayload['notes'] = 'to ' + payload.accountNameOwner;
        bankPayload['amount'] = payload.amount * (-1.0);
        bankPayload['cleared'] = 0;
        bankPayload['accountType'] = 'debit';
        bankPayload['reoccurring'] = false
        bankPayload['accountNameOwner'] = 'bcu-checking_brian';

        await axios.post(endpoint, accountPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
        await axios.post(endpoint, bankPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
    };

    useEffect(() => {

        let isLoaded = false;

        if (!isLoaded) {
            setData([]);
        }

        return () => {
            isLoaded = true;
        };
    }, []);

    //data example
    //{"transactionDate": "1/1/2021", "accountNameOwner":"test", "amount":0.00}
    // useEffect(() => {
    //     if ( 0 !== data.length ) {
    //         setData([]);
    //     }
    //
    // }, [data]);

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
                    onRowDelete: () => console.log('delete'),
                    onRowUpdate: () => console.log('update')
                }}
            />
        </div>
    )
}