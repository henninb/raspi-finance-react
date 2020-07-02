import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import './master.scss';
import axios from "axios";
//import uuid from "react-uuid";
import { v4 as uuidv4 } from 'uuid';
import SelectAccountNameOwnerCredit from './SelectAccountNameOwnerCredit'


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
        accountPayload['amount'] = payload.amount * (-1.0);
        accountPayload['cleared'] = 0;
        accountPayload['accountType'] = 'credit';
        accountPayload['reoccurring'] = false
        accountPayload['sha256'] = '';
        accountPayload['accountNameOwner'] = payload.accountNameOwner;
        accountPayload['dateUpdated'] = toEpochDateAsMillis(new Date())
        accountPayload['dateAdded'] = toEpochDateAsMillis(new Date())

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
        bankPayload['sha256'] = '';
        bankPayload['accountNameOwner'] = 'bcu-checking_brian';
        bankPayload['dateUpdated'] = toEpochDateAsMillis(new Date())
        bankPayload['dateAdded'] = toEpochDateAsMillis(new Date())

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

    return (
        <div className="table-formatting">
            <MaterialTable
                columns={[
                    {title: "transactionDate", field: "transactionDate", type: "date"},
                    {title: "account", field: "accountNameOwner",
                        editComponent: (props) => {
                            return (
                                <SelectAccountNameOwnerCredit onChangeFunction={props.onChange} currentValue={props.value} />
                            )}
                    },
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
                    onRowDelete: () =>
                        new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject();
                        }, 1000);
                    }),
                    onRowUpdate:  () =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                              reject();
                            }, 1000);
                        })
                }}
            />
        </div>
    )
}
