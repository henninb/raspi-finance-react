import React, {useCallback, useEffect, useState} from 'react';
import MaterialTable from "material-table";
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import Spinner from './Spinner';
import './master.scss';
import {useRouteMatch} from 'react-router-dom';
import SelectTransactionState from "./SelectTransactionState";
import TransactionMove from "./TransactionMove";
import TransactionImage from "./TransactionImage";
import {currencyFormat, endpointUrl, toEpochDateAsMillis} from "./Common"
import Checkbox from "@material-ui/core/Checkbox";
import SelectCategory from "./SelectCategory";
import SelectDescription from "./SelectDescription";
// import { FilePicker } from 'react-file-picker'

export default function TransactionTable() {
    const [loadSpinner, setLoadSpinner] = useState(true);
    const [loadMoveDialog, setLoadMoveDialog] = useState(false);
    const [loadImageDialog, setLoadImageDialog] = useState(false);
    const [currentGuid, setCurrentGuid] = useState("");
    const [totals, setTotals] = useState([]);
    const [data, setData] = useState([]);
    const [keyPressed, setKeyPressed] = useState(false);
    // const [fileName, setFileName] = useState('');

    let match = useRouteMatch("/transactions/:account");

    const handlerForUpdatingTransactionState = async (guid) => {
        try {
            await changeTransactionStateToCleared(guid)
            setData(data.map((element) => {
                if (element["guid"] === guid) {
                    fetchTotals()
                    return {...element, transactionState: 'cleared'}
                } else {
                    return element
                }
            }));
        } catch (error) {
            console.log('handlerForUpdatingTransactionState failure');
            if (error.response) {
                alert(JSON.stringify(error.response.data));
            }
        }
    };

    // const getBase64 = (file) => {
    //    let reader = new FileReader();
    //    reader.readAsDataURL(file);
    //    reader.onload = () => {
    //      console.log(reader.result);
    //      return reader.result
    //    };
    //    reader.onerror = (error) => {
    //      console.log('Error: ', error);
    //    };
    // };

    const toggleReoccurring = async (guid, reoccurring) => {

        try {
            await changeTransactionReoccurringStatus(guid, !reoccurring)
            setData(data.map((elem) => {
                if (elem["guid"] === guid) {
                    return {...elem, reoccurring: !elem.reoccurring}
                } else {
                    return elem
                }
            }));
        } catch (error) {
            console.log('toggleReoccurring failure');
            if (error.response) {
                alert(JSON.stringify(error.response.data));
            }
        }
    };

    const fetchTotals = useCallback(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const response = await axios.get(endpointUrl() + '/transaction/account/totals/' + match.params['account'], {cancelToken: source.token});
        setTotals(response.data);
        return () => {
            source.cancel();
        };
    }, [match]);

    const changeTransactionStateToCleared = useCallback(async (guid) => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const response = await axios.put(endpointUrl() + '/transaction/state/update/' + guid + '/Cleared', {cancelToken: source.token});
        if (response.data !== "transaction state updated") {
            console.log('changeTransactionStateToCleared - failure');
            console.log(response.data);
        }
        return () => {
            source.cancel();
        };
    },[]);

    const changeTransactionReoccurringStatus = async (guid, reoccurring) => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const response = await axios.put(endpointUrl() + '/transaction/reoccurring/update/' + guid + '/' + reoccurring, {cancelToken: source.token});
        if (response.data !== "transaction reoccurring updated") {
            console.log('changeTransactionReoccurringStatus - failure');
            console.log(response.data);
        }
        return () => {
            source.cancel();
        };
    };

    const fetchData = useCallback(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const response = await axios.get(endpointUrl() + '/transaction/account/select/' + match.params['account'], {cancelToken: source.token});
        setData(response.data);
        setLoadSpinner(false);
        return () => {
            source.cancel();
        };
    }, [match]);

    const putCall = async (newData, oldData) => {
        let endpoint = endpointUrl() + '/transaction/update/' + oldData.guid;
        delete newData['tableData'];

        //TODO: do I need this?
        if (oldData.transactionState === undefined) {
            newData['transactionState'] = 'undefined'
        }

        newData['dateUpdated'] = toEpochDateAsMillis(new Date())
        //TODO: ought not use set the dateAdded()
        newData['dateAdded'] = toEpochDateAsMillis(new Date())

        await axios.put(endpoint, JSON.stringify(newData), {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
    };

    const updateRow = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                try {
                    await putCall(newData, oldData);
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
                try {
                    const newPayload = await postCall(newData);
                    setData([newPayload, ...data]);
                    await fetchTotals();
                    resolve();
                } catch (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        alert(JSON.stringify(error.response.data));
                    }
                    reject();
                }
            }, 1000);
        });
    };

    const deleteCall = async (payload) => {
        let endpoint = endpointUrl() + '/transaction/delete/' + payload.guid;

        let response = await axios.delete(endpoint, {timeout: 0, headers: {'Content-Type': 'application/json'}});
        console.log(response.data);
    };

    const postCall = async (payload) => {
        let endpoint = endpointUrl() + '/transaction/insert/';
        //let newPayload = {};

        //TODO: bh 8/28/2020 - need to address any date conversion issues
        //TODO: bh 10/31/2020 - set a timezone based on a parm
        let buildTransactionDateString = payload.transactionDate.toISOString().split('T')[0] + "T12:00:00.000";
        //dt.toISOString());
        let newPayload = {
            guid: uuidv4(),
            transactionDate: buildTransactionDateString,
            description: payload.description,
            category: payload.category === undefined ? 'undefined' : payload.category,
            notes: payload.notes === undefined ? '' : payload.notes,
            amount: payload.amount,
            transactionState: payload.transactionState === undefined ? 'outstanding':  payload.transactionState,
            activeStatus: true,
            accountType: 'undefined',
            reoccurring: payload.reoccurring === undefined ? false : payload.reoccurring,
            reoccurringType: payload.reoccurringType === undefined ? 'undefined' : payload.reoccurringType,
            accountNameOwner: match.params['account'],
            // dateUpdated: toEpochDateAsMillis(new Date()),
            // dateAdded: toEpochDateAsMillis(new Date()),
        }

        await axios.post(endpoint, newPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
        return newPayload;
    };

    const downHandler = useCallback(({key}) => {
        if (key === 'Escape') {
            console.log('escape key pressed: ' + keyPressed);
            setKeyPressed(true);
        }

        // if (key === 'Enter') {
        //     alert('me - enter');
        //     // document.getElementById('Cancel').click()
        //     setKeyPressed(true);
        // }
    }, [keyPressed]);

    const upHandler = useCallback(({key}) => {
        if (key === 'Escape') {
            setKeyPressed(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        if (data.length === 0) {
            let response = fetchData();
            console.log(response);
        }

        if (totals.length === 0) {
            let response = fetchTotals();
            console.log(response);
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
                            {
                                title: "date",
                                field: "transactionDate",
                                type: "date",
                                cellStyle: {whiteSpace: "nowrap",},
                            },
                            {
                                title: "description", field: "description", cellStyle: {whiteSpace: "nowrap",},
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectDescription onChangeFunction={props.onChange}
                                                currentValue={ () => {
                                                    if (props.value) {
                                                        return props.value;
                                                    } else {
                                                        return 'undefined';
                                                    }
                                                }
                                                }/>
                                        </>
                                    )
                                }
                            },
                            {
                                title: "category", field: "category", cellStyle: {whiteSpace: "nowrap",},

                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectCategory onChangeFunction={props.onChange}
                                                currentValue={ () => {
                                                    if (props.value) {

                                                        return props.value;
                                                    } else {
                                                        return 'none';
                                                    }
                                                }
                                                }/>
                                        </>
                                    )
                                }
                            },
                            {
                                title: "amount", field: "amount", type: "currency", cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "state", field: "transactionState", cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    if (rowData.transactionState === 'cleared') {
                                        return (<div>{rowData.transactionState}</div>)
                                    } else {
                                        return (
                                            <div>
                                                <Checkbox checked={false}
                                                          style={{color: '#9965f4'}}
                                                          onChange={() => handlerForUpdatingTransactionState(rowData.guid)}/>
                                                {rowData.transactionState}
                                            </div>
                                        )
                                    }
                                },
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectTransactionState onChangeFunction={props.onChange}
                                                currentValue={ () => {
                                                    if (props.value) {
                                                        return props.value;
                                                    } else {
                                                        return 'outstanding';
                                                    }
                                                   }
                                                }/>
                                        </>
                                    )
                                }
                            },
                            {
                                title: "reoccur", field: "reoccurring", cellStyle: {whiteSpace: "nowrap",},
                                render: (rowData) => {
                                    return <Checkbox checked={rowData.reoccurring}
                                                     style={{color: '#9965f4'}}
                                                     onChange={() => toggleReoccurring(rowData.guid, rowData.reoccurring)}/>
                                },
                                editComponent: (props) => {
                                    return <Checkbox checked={props.rowData.reoccurring}
                                                 style={{color: '#9965f4'}}
                                                 onChange={(e) => {
                                                     props.onChange(e.target.checked)
                                                     props.rowData.reoccurring = e.target.checked
                                                     console.log('state:', e.target.checked)
                                                 }
                                                 }
                                                 />
                                }
                            },
                            {
                                title: "notes", field: "notes", cellStyle: {whiteSpace: "nowrap"},
                            },
                        ]}
                        data={data}
                        title={`[${match.params['account']}] [ $${currencyFormat(totals['totalsCleared'])} ], [ $${currencyFormat(totals['totals'])} ]`}
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
                                if (rowData.transactionState === 'cleared') {
                                    return {fontSize: '.6rem'};
                                } else if (rowData.transactionState === 'future') {
                                    //return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: '#90ee02', color: '#000'};
                                    return {
                                        fontSize: '.6rem',
                                        fontWeight: 'bold',
                                        backgroundColor: '#5800f9',
                                        color: '#FFF'
                                    };
                                } else {
                                    //return {fontSize: '.6rem', fontWeight: 'bold', backgroundColor: '#defabb', color: '#000'};
                                    return {
                                        fontSize: '.6rem',
                                        fontWeight: 'bold',
                                        backgroundColor: '#4000f1',
                                        color: '#FFF'
                                    };
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
                                onClick: (_event, rowData) => {
                                    setCurrentGuid(rowData.guid);
                                    setLoadMoveDialog(true);
                                }
                            },
                            {
                                icon: "add_a_photo",
                                tooltip: "Photo-Add",
                                onClick: (_event, rowData) => {
//                                    console.log('onClick photo-add')
//                                    const fileSelector = document.createElement('input');
//                                    fileSelector.setAttribute('type', 'file');
//                                    fileSelector.click();

//                                          setFileName(file)
//                                          let b64 = getBase64(file)

                                    setCurrentGuid(rowData.guid);
                                    setLoadImageDialog(true);
                                }
                            }
                        ]}
                    />
                    {loadMoveDialog ?  <TransactionMove closeDialog={() => setLoadMoveDialog(false)}
                                                                             transactionGuid={currentGuid}/> : null}
                    {loadImageDialog ?  <TransactionImage closeDialog={() => setLoadImageDialog(false)}
                                                                             transactionGuid={currentGuid}/>: null}
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}
