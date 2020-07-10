import React, {useCallback, useEffect, useState} from "react";
import MaterialTable from "material-table";
import './master.scss';
import axios from "axios";
//import uuid from "react-uuid";
import {v4 as uuidv4} from 'uuid';
import SelectAccountNameOwnerCredit from './SelectAccountNameOwnerCredit'
import Spinner from "./Spinner";
import {formatDate} from "./Common"

export default function PaymentTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    if (verifyData(newData)) {
                        await postCall(newData);
                    } else {
                        reject();
                    }
                    setData([newData, ...data]);
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

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/payment/select');
            setData(response.data);
            setLoading(false);

        } catch (error) {
            if (error.response) {
                alert("status: " + error.response.status + " - " + JSON.stringify(error.response.data));
            }
        }
    }, []);

    // const formatDate = (date) => {
    //     let d = new Date(date);
    //     let month = '' + (d.getMonth() + 1);
    //     let day = '' + d.getDate();
    //     let year = d.getFullYear();
    //
    //     month = ("0" + month).slice(-2);
    //     day = ("0" + day).slice(-2);
    //
    //     return [year, month, day].join('-');
    // };

    const verifyData = (newData) => {
        if (isNaN(newData.amount)) return false;
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

        // return () => {
        //     source.cancel();
        // };
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

        // return () => {
        //     source.cancel();
        // };
    };


    const postCallPayment = async (payload) => {
        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();
        let endpoint = 'http://localhost:8080/payment/insert/';

        await axios.post(endpoint, payload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'},
            cancelToken: source.token
        });
    };


    const postCall = async (payload) => {
        let accountPayload = {};
        let bankPayload = {};


        accountPayload['guid'] = uuidv4();
        //accountPayload['guid'] = uuid();
        accountPayload['transactionDate'] = toEpochDateAsMillis(new Date(payload.transactionDate.toDateString()));
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
        bankPayload['transactionDate'] = toEpochDateAsMillis(new Date(payload.transactionDate.toDateString()));
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
        await postCallPayment(payload);
    };

    useEffect(() => {
        if (data === undefined) {
            console.log('data is undefined')
        }

        if (data.length === 0) {
            fetchData();
        }

    }, [data, fetchData]);

    const deleteCall = async (payload) => {
        let endpoint = 'http://localhost:8080/payment/delete/' + payload.paymentId;

        await axios.delete(endpoint, {timeout: 0, headers: {'Content-Type': 'application/json'}});
    };

    return (
        <div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        data-testid="payment-table"
                        columns={[
                            {
                                title: "transactionDate", field: "transactionDate", type: "date",
                                render: (rowData) => {
                                    return <div>{formatDate(rowData.transactionDate)}</div>
                                }
                            },
                            {
                                title: "accountNameOwner", field: "accountNameOwner",
                                editComponent: (props) => {
                                    return (
                                        <SelectAccountNameOwnerCredit onChangeFunction={props.onChange}
                                                                      currentValue={props.value}/>
                                    )
                                }
                            },
                            {title: "amount", field: "amount", type: "currency"},
                        ]}
                        data={data}
                        title="Payments"
                        options={{
                            paging: false,
                            pageSize: 20,
                            addRowPosition: "first",
                            search: false
                        }}

                        editable={{
                            onRowAdd: addRow,
                            onRowDelete: (oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        const dataDelete = [...data];
                                        const index = oldData.tableData.id;
                                        dataDelete.splice(index, 1);
                                        try {
                                            await deleteCall(oldData);
                                            setData([...dataDelete]);
                                            resolve();
                                        } catch (error) {
                                            if (error.response) {
                                                alert(JSON.stringify(error.response.data));
                                            }
                                            reject();
                                        }
                                    }, 1000);
                                })
                            ,
                            onRowUpdate: () =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        reject();
                                    }, 1000);
                                })
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}
