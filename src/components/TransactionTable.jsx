import React, {useCallback, useEffect, useState} from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
//import uuid from 'react-uuid';
import {v4 as uuidv4} from 'uuid';
import Spinner from './Spinner';
import './master.scss';
import {useHistory, useRouteMatch} from 'react-router-dom';
import SelectCleared from "./SelectCleared";
import {currencyFormat, formatDate, toEpochDateAsMillis} from "./Common"
import Button from "@material-ui/core/Button";

export default function TransactionTable() {
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState([]);
    const [data, setData] = useState([]);
    const [keyPressed, setKeyPressed] = useState(false);
    const history = useHistory();

    let match = useRouteMatch("/transactions/:account");

    const handleButtonClickLink = async (guid) => {
        // history.push('/transactions/' + accountNameOwner);
        await updateTransactionCleared(guid)
        history.go(0);
    };

    const fetchTotals = useCallback(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const response = await axios.get('http://localhost:8080/transaction/account/totals/' + match.params.account, {cancelToken: source.token});
        setTotals(response.data);
        return () => {
            source.cancel();
        };
    }, [match]);


    const updateTransactionCleared = async (guid) => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const response = await axios.put('http://localhost:8080/transaction/cleared/update/' + guid, {cancelToken: source.token});
        setTotals(response.data);
        return () => {
            source.cancel();
        };
    };

    const fetchData = useCallback(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const response = await axios.get('http://localhost:8080/transaction/account/select/' + match.params.account, {cancelToken: source.token});
        setData(response.data);
        setLoading(false);
        return () => {
            source.cancel();
        };
    }, [match]);

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

    const updateRow = (newData, oldData) => {
        return new Promise((resolve, reject) => {
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
        });
    };

    const deleteRow = (oldData) => {
        return new Promise((resolve, reject) => {
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
        });
    };

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                setData([newData, ...data]);
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

    const clearedStatus = (value) => {
        let result = parseInt(value, 10);
        if (result === 1) return "cleared";
        else if (result === 0) return "outstanding";
        else if (result === -1) return "future";
        else {
            alert("unknown status type: " + value);
            return "unknown";
        }
    };

    const deleteCall = async (payload) => {
        let endpoint = 'http://localhost:8080/transaction/delete/' + payload.guid;

        await axios.delete(endpoint, {timeout: 0, headers: {'Content-Type': 'application/json'}});
    };

    const postCall = async (payload) => {
        let endpoint = 'http://localhost:8080/transaction/insert/';
        let newPayload = {};

        //TODO: need to fix date
        //let buildTransactionDateString = payload.transactionDate.toDateString() + "T12:00:00.000";
        let buildTransactionDateString = payload.transactionDate.toISOString().split('T')[0] + "T12:00:00.000";
        //alert(buildTransactionDateString);

        //   newPayload['guid'] = uuid();
        newPayload['guid'] = uuidv4();
        //newPayload['transactionDate'] = toEpochDateAsMillis(new Date(payload.transactionDate.toDateString()));
        newPayload['transactionDate'] = buildTransactionDateString;
        newPayload['description'] = payload.description;
        newPayload['category'] = payload.category === undefined ? 'none' : payload.category;
        newPayload['notes'] = payload.notes === undefined ? '' : payload.notes;
        newPayload['amount'] = payload.amount;
        newPayload['cleared'] = payload.cleared;
        newPayload['accountType'] = 'undefined';
        newPayload['reoccurring'] = false
        //newPayload['sha256'] = payload.sha256 === undefined ? '' : payload.sha256;
        newPayload['accountNameOwner'] = match.params.account;
        newPayload['dateUpdated'] = toEpochDateAsMillis(new Date())
        newPayload['dateAdded'] = toEpochDateAsMillis(new Date())

        await axios.post(endpoint, newPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
    };

    //const fetchData = useCallback(async () => {

    const downHandler = useCallback(({ key }) => {
        // alert(key)
        if (key === 'Escape') {
            alert('me - escape' + keyPressed);
            // document.getElementById('Cancel').click()
            setKeyPressed(true);
        }

        // if (key === 'Enter') {
        //     alert('me - enter');
        //     // document.getElementById('Cancel').click()
        //     setKeyPressed(true);
        // }
    }, [keyPressed]);

    const upHandler = useCallback(({ key }) => {
        if (key === 'Escape') {
            setKeyPressed(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        if (data.length === 0) {
            fetchData();
        }

        if (totals.length === 0) {
            fetchTotals();
        }

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        }

    }, [totals, data, fetchTotals, fetchData, downHandler, upHandler]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "date", field: "transactionDate", type: "date", cellStyle: {whiteSpace: "nowrap",},
                            },
                            {title: "description", field: "description", cellStyle: {whiteSpace: "nowrap",},
                            },
                            {title: "category", field: "category", cellStyle: {whiteSpace: "nowrap",},
                            },
                            {title: "amount", field: "amount", type: "currency", cellStyle: {whiteSpace: "nowrap"},
                            },
                            {title: "cleared", field: "cleared", cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    if (rowData.cleared === 1) {
                                        return (<div>{clearedStatus(rowData.cleared)}</div>)
                                    } else {
                                        return (
                                            <Button style={{ fontWeight: 'bold', fontSize: '.6rem' }}
                                                onClick={() => handleButtonClickLink(rowData.guid)}>{clearedStatus(rowData.cleared)}</Button>
                                        )
                                    }
                                },
                                editComponent: (props) => {
                                    return (
                                        <>
                                        <SelectCleared onChangeFunction={props.onChange} currentValue={props.value}/>
                                        </>
                                    )
                                }
                            },
                            {title: "notes", field: "notes", cellStyle: {whiteSpace: "nowrap"},
                            },
                        ]}
                        data={data}
                        title={`[${match.params.account}] [ $${currencyFormat(totals.totalsCleared)} ], [ $${currencyFormat(totals.totals)} ]`}
                        options={{
                            paging: true,
                            pageSize: 20,
                            addRowPosition: "first",
                            search: true,
                            paginationPosition: "both",
                            headerStyle: {
                              backgroundColor: '#01579b',
                              color: '#FFF',
                            },
                            //rowStyle: {  fontSize: '.8rem',  height: 'auto !important', }

                            rowStyle: (rowData) => {
                                if( rowData.cleared === 1 ) {
                                    return {fontSize: '.6rem' };
                                } else if( rowData.cleared === -1 ) {
                                    return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: 'salmon'};
                                } else {
                                    return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: 'lightgreen'};
                                }
                            }
                        }}

                        editable={{
                            onRowAdd: addRow,
                            onRowUpdate: updateRow,
                            onRowDelete: deleteRow
                        }}

                        // actions={[
                        //     {
                        //         icon: "edit",
                        //         iconProps: { style: { fontSize: "24px" } },
                        //         tooltip: "Edit",
                        //         onClick: (event, rowData) => alert("You edited " + rowData.accountNameOwner)
                        //     }
                        // ]}

                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}