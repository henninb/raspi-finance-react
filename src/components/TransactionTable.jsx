import React, {useCallback, useEffect, useState} from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
//import uuid from 'react-uuid';
import {v4 as uuidv4} from 'uuid';
import Spinner from './Spinner';
import './master.scss';
import {useRouteMatch} from 'react-router-dom';
import SelectTransactionState from "./SelectTransactionState";
import TransactionMoveDialog from "./TransactionMoveDialog";
import {currencyFormat, toEpochDateAsMillis} from "./Common"
import Button from "@material-ui/core/Button";

export default function TransactionTable() {
    const [loadSpinner, setLoadSpinner] = useState(true);
    const [loadDialog, setLoadDialog] = useState(false);
    const [currentGuid, setCurrentGuid] = useState("");
    const [totals, setTotals] = useState([]);
    const [data, setData] = useState([]);
    const [keyPressed, setKeyPressed] = useState(false);
    // const history = useHistory();

    let match = useRouteMatch("/transactions/:account");

    const handlerForUpdatingTransactionState = async (guid) => {
        await updateTransactionState(guid)
        //TODO: history go might not be required
        //history.go(0);
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


    const updateTransactionState = async (guid) => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const response = await axios.put('http://localhost:8080/transaction/state/update/' + guid, {cancelToken: source.token});
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
        setLoadSpinner(false);
        return () => {
            source.cancel();
        };
    }, [match]);

    const patchCall = async (newData, oldData) => {
        let endpoint = 'http://localhost:8080/transaction/update/' + oldData.guid;
        delete newData['tableData'];

        //TODO: do I need this?
        if( oldData.transactionState ===  undefined) {
            newData['transactionState'] = 'undefined'
        }

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

    const deleteCall = async (payload) => {
        let endpoint = 'http://localhost:8080/transaction/delete/' + payload.guid;

        await axios.delete(endpoint, {timeout: 0, headers: {'Content-Type': 'application/json'}});
    };

    const postCall = async (payload) => {
        let endpoint = 'http://localhost:8080/transaction/insert/';
        let newPayload = {};

        //TODO: bh 8/28/2020 - need to address any date conversion issues
        let buildTransactionDateString = payload.transactionDate.toISOString().split('T')[0] + "T12:00:00.000";

        newPayload['guid'] = uuidv4();
        //newPayload['transactionDate'] = toEpochDateAsMillis(new Date(payload.transactionDate.toDateString()));
        newPayload['transactionDate'] = buildTransactionDateString
        newPayload['description'] = payload.description
        newPayload['category'] = payload.category === undefined ? 'none' : payload.category
        newPayload['notes'] = payload.notes === undefined ? '' : payload.notes
        newPayload['amount'] = payload.amount
        if( payload.transactionState === undefined) {
            newPayload['transactionState'] = 'outstanding'
        } else {
            newPayload['transactionState'] = payload.transactionState
        }
        newPayload['accountType'] = 'undefined'
        newPayload['reoccurring'] = false
        newPayload['accountNameOwner'] = match.params.account
        newPayload['dateUpdated'] = toEpochDateAsMillis(new Date())
        newPayload['dateAdded'] = toEpochDateAsMillis(new Date())

        await axios.post(endpoint, newPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
    };

    const downHandler = useCallback(({ key }) => {
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
            {!loadSpinner ?
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
                            {title: "state", field: "transactionState", cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    if (rowData.transactionState === 'cleared') {
                                        return (<div>{rowData.transactionState}</div>)
                                    } else {
                                        return (
                                            <Button style={{ fontWeight: 'bold', fontSize: '.6rem', backgroundColor: '#9965f4', color: '#FFF' }}
                                                    onClick={() => handlerForUpdatingTransactionState(rowData.guid)}>{rowData.transactionState}</Button>
                                        )
                                    }
                                },
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectTransactionState onChangeFunction={props.onChange} currentValue={props.value}/>
                                        </>
                                    )
                                }
                            },
                            {
                                title: "reoccur", field: "reoccurring", cellStyle: {  whiteSpace: "nowrap", },
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
                              backgroundColor: '#9965f4',
                              color: '#FFF',
                              // position: 'sticky', top: 0
                            },
                            //rowStyle: {  fontSize: '.8rem',  height: 'auto !important', }

                            rowStyle: (rowData) => {
                                if( rowData.transactionState === 'cleared' ) {
                                    return {fontSize: '.6rem' };
                                } else if( rowData.transactionState === 'future' ) {
                                    //return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: '#90ee02', color: '#000'};
                                    return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: '#5800f9', color: '#FFF'};
                                } else {
                                    //return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: '#defabb', color: '#000'};
                                    return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: '#4000f1', color: '#FFF'};
                                }
                            }
                        }}

                        editable={{
                            onRowAdd: addRow,
                            onRowUpdate: updateRow,
                            onRowDelete: deleteRow
                        }}

                        actions={[
                            {
                                icon: "send",
                                tooltip: "Move",
                                // onClick: (event, rowData) => alert("Move transaction " + rowData.guid + " to another account.")
                                onClick: (event, rowData) =>  {
                                    setCurrentGuid(rowData.guid);
                                    setLoadDialog(true);
                                }
                            },
                            {
                                icon: "add_a_photo",
                                tooltip: "Photo-Add",
                                onClick: (event, rowData) => alert("Associate a photo to transaction " + rowData.guid)
                            }
                        ]}
                    />
                    {loadDialog ? <TransactionMoveDialog closeDialog={() => setLoadDialog(false)} transactionGuid={currentGuid} />: null}
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}