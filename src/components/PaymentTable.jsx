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
                try {
                    if( verifyData(newData) ) {
                        await postCall(newData);
                    } else {
                        reject();
                    }
                    setData([...data, newData]);
                    resolve();
                } catch (error) {
                    if (error.response) {
                        alert(JSON.stringify(error.response.data));
                    }
                    reject();
                }
            }, 1000);
        });
    };

    const formatDate = (date) => {
        let d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    };

    const verifyData = (newData) => {
        // if(isNaN(newData.amount)) return false;
        // if(newData.amount === undefined) return false;
        // if(newData.transactionDate === undefined) return false;
        // return newData.accountNameOwner !== undefined;
        return true
    }

    const toEpochDateAsMillis = (transactionDate) => {
        let date_val = new Date(transactionDate);
        let utc_val = new Date(date_val.getTime() + date_val.getTimezoneOffset() * 60000);

        return utc_val.valueOf();
    };

    const postCallCredit = async (accountPayload) => {
        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();
        let endpoint = 'http://localhost:8080/transaction/insert/';

        await axios.post(endpoint, accountPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'},
            cancelToken: source.token
        });

        return () => {
            source.cancel();
        };
    };

    const postCallDebit = async (bankPayload) => {
        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();
        let endpoint = 'http://localhost:8080/transaction/insert/';

        await axios.post(endpoint, bankPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'},
            cancelToken: source.token
        });

        return () => {
            source.cancel();
        };
    };

    const postCall = async (payload) => {
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

        await postCallCredit(accountPayload);
        await postCallDebit(bankPayload);
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
        <div className="table-formatting" data-testid="payment-table">
            <MaterialTable

                columns={[
                    {title: "transactionDate", field: "transactionDate", type: "date",
                        render: (rowData) => {
                            return <div>{formatDate(rowData.transactionDate)}</div>
                        }
                    },
                    {title: "accountNameOwner", field: "accountNameOwner",
                        editComponent: (props) => {
                            return (
                                <SelectAccountNameOwnerCredit onChangeFunction={props.onChange} currentValue={props.value} />
                            )}
                    },
                    {title: "amount", field: "amount", type: "currency"},
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
