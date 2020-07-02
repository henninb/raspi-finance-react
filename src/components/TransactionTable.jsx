import React, {useState, useEffect, useCallback } from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
//import uuid from 'react-uuid';
import { v4 as uuidv4 } from 'uuid';
//import uuid from 'uuid';
import Spinner from './Spinner';
import './master.scss';
import {useRouteMatch} from 'react-router-dom';
import SelectAccountType from './SelectAccountType';
import SelectCleared from "./SelectCleared";

export default function TransactionTable() {
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState([]);
    const [data, setData] = useState([]);
    let match = useRouteMatch("/transactions/:account");

    const fetchTotals = useCallback( async () => {
        const response = await axios.get('http://localhost:8080/transaction/account/totals/' + match.params.account);
        setTotals(response.data);
    }, [match]);

    const fetchData = useCallback(async () => {
        const response = await axios.get('http://localhost:8080/transaction/account/select/' + match.params.account);
        setData(response.data);
        setLoading(false);
    }, [match]);

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                setData([...data, newData]);
                try {
                    await postCall(newData);
                    await fetchTotals();
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

    const toEpochDateAsMillis = (transactionDate) => {
        let date_val = new Date(transactionDate);
        let utc_val = new Date(date_val.getTime() + date_val.getTimezoneOffset() * 60000);

        return utc_val.valueOf();
    };

    const currencyFormat = (inputData) => {
        inputData = parseFloat(inputData).toFixed(2);
        return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const deleteCall = async (payload) => {
        let endpoint = 'http://localhost:8080/transaction/delete/' + payload.guid;

        await axios.delete(endpoint, {timeout: 0, headers: {'Content-Type': 'application/json'}});
    };

    const patchCall = async (newData, oldData) => {
        let endpoint = 'http://localhost:8080/transaction/update/' + oldData.guid;
        delete newData['tableData'];

        newData['dateUpdated'] = toEpochDateAsMillis(new Date())
        //TODO: ought not use set the dateAdded()
        newData['dateAdded'] = toEpochDateAsMillis(new Date())

        await axios.patch(endpoint, JSON.stringify(newData), {
            timeout: 0,
            headers: {'Content-Type': 'application/json-patch+json'}
        });
    };

    const postCall = async (payload) => {
        let endpoint = 'http://localhost:8080/transaction/insert/';
        let newPayload = {};

     //   newPayload['guid'] = uuid.v4();
     //   newPayload['guid'] = uuid();
        newPayload['guid'] = uuidv4();
        newPayload['transactionDate'] = toEpochDateAsMillis(payload.transactionDate);
        newPayload['description'] = payload.description;
        newPayload['category'] = payload.category;
        newPayload['notes'] = payload.notes;
        newPayload['amount'] = payload.amount;
        newPayload['cleared'] = payload.cleared;
        //TODO: how do we set the accountType
        newPayload['accountType'] = payload.accountType;
        newPayload['reoccurring'] = false
        newPayload['sha256'] = ''
        newPayload['accountNameOwner'] = match.params.account;
        newPayload['dateUpdated'] = toEpochDateAsMillis(new Date())
        newPayload['dateAdded'] = toEpochDateAsMillis(new Date())

        await axios.post(endpoint, newPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
    };

    //https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
    useEffect( () => {

        if( data.length === 0 ) {
            fetchData().then(()=>console.log('fetchData'));
        }

        if( totals.length === 0 ) {
            fetchTotals().then(()=>console.log('fetchTotals'));
        }

    }, [totals, data, fetchTotals, fetchData]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "date", field: "transactionDate", type: 'date'},
                            {title: "description", field: "description"},
                            {title: "category", field: "category"},
                            {title: "amount", field: "amount", type: "currency"},
                            {title: "cleared", field: "cleared",
                                editComponent: (props) => {
                                    return (
                                        <SelectCleared onChangeFunction={props.onChange} currentValue={props.value} />
                                    )}},
                            {title: "notes", field: "notes"}, //TODO: add a custom text box for notes
                            //{title: "accountType", field: "accountType"},
                            {title: "accountType", field: "accountType",
                                editComponent: (props) => {
                                return (
                                    <SelectAccountType onChangeFunction={props.onChange} currentValue={props.value} />
                                )}
                            },
                        ]}
                        data={data}
                        title={`[${match.params.account}] [ $${currencyFormat(totals.totalsCleared)} ], [ $${currencyFormat(totals.totals)} ]`}
                        options={{
                            paging: true,
                            pageSize: 20,
                            addRowPosition: "first",
                            search: true
                        }}

                        editable={{
                            onRowAdd: addRow,
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {

                                        const dataUpdate = [...data];
                                        const index = oldData.tableData.id;
                                        dataUpdate[index] = newData;
                                        try {
                                            await patchCall(newData, oldData);
                                            await fetchTotals();
                                            setData([...dataUpdate]);
                                            resolve();
                                        } catch (error) {
                                            if (error.response) {
                                                alert(JSON.stringify(error.response.data));
                                            }
                                            reject();
                                        }
                                    }, 1000);
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        const dataDelete = [...data];
                                        const index = oldData.tableData.id;
                                        dataDelete.splice(index, 1);
                                        try {
                                            await deleteCall(oldData);
                                            await fetchTotals();
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
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}