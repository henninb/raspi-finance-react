import React, {useCallback, useEffect, useState} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";

export default function AccountSummaryTable() {

    const [totals, setTotals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const history = useHistory();

    const handleButtonClickLink = (accountNameOwner) => {
        history.push('/transactions/' + accountNameOwner);
        history.go(0);
    }


    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await postCall(newData);
                    setData([newData, ...data]);
                    resolve();
                } catch (error) {
                    if (error.response) {
                        alert("addRow - status: " + error.response.status + " - " + JSON.stringify(error.response.data));
                    }
                    reject();
                }
            }, 1000);
        });
    };


    const postCall = async (payload) => {
        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();
        let endpoint = 'http://localhost:8080/account/insert/';

        const now = new Date()
        payload.totals = 0.0;
        payload.totalsBalanced = 0.0;
        payload.dateClosed = 0;
        payload.dateAdded = Math.round(now.getTime());
        payload.dateUpdated = Math.round(now.getTime());
        payload.activeStatus = true;

        await axios.post(endpoint, payload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'},
            cancelToken: source.token
        });
    };

    const currencyFormat = (inputData) => {
        inputData = parseFloat(inputData).toFixed(2);
        return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const deleteCall = async (payload) => {
        let endpoint = 'http://localhost:8080/account/delete/' + payload.accountNameOwner;

        let response = await axios.delete(endpoint, {timeout: 0, headers: {'Content-Type': 'application/json'}});
        if( response.status !== 200 ) {
            alert("not a 200");
        }
    };

    const fetchTotals = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/totals');
            setTotals(response.data);
        } catch (error) {
            if (error.response) {
                alert("fetchTotals: " + error.response.status);
                alert("fetchTotals: " + JSON.stringify(error.response.data));
            }
        }
    }, []);

    const fetchData = useCallback(async () => {
        // const CancelToken = axios.CancelToken;
        // const source = CancelToken.source();

        try {
            const response = await axios.get('http://localhost:8080/account/select/active');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setLoading(false);
                } else {
                    alert("fetchData: " + error.response.status);
                    alert("fetchData: " + JSON.stringify(error.response.data));
                }
            }
        }

        // return () => {
        //     source.cancel();
        // };
    }, []);

    useEffect(() => {

        if (data.length === 0) {
            fetchData();
        }

        if (totals.length === 0) {
            fetchTotals();
        }

    }, [totals, data, fetchData, fetchTotals]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {
                                title: "accountNameOwner", field: "accountNameOwner",
                                render: (rowData) => {
                                    return (
                                        <Button
                                            onClick={() => handleButtonClickLink(rowData.accountNameOwner)}>{rowData.accountNameOwner}</Button>
                                    )
                                }
                            },
                            {title: "accountType", field: "accountType"},
                            {title: "moniker", field: "moniker"},
                            {title: "unbalanced", field: "totals", type: "currency"},
                            {title: "balanced", field: "totalsBalanced", type: "currency"},
                        ]}
                        data={data}
                        title={` [ $${currencyFormat(totals.totalsCleared)} ], [ $${currencyFormat(totals.totals)} ]`}
                        options={{
                            paging: false,
                            search: true,
                            addRowPosition: "first",
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
                                                alert("onRowDelete - status: " + error.response + " - " + JSON.stringify(error.response.data));
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