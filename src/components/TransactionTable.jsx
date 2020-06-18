import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import axios from 'axios';
import uuid from 'react-uuid';
import Spinner from './Spinner';
import './master.scss';
import { useRouteMatch } from 'react-router-dom'
import TextField from "@material-ui/core/TextField";

export default function TransactionTable() {

    const [loading, setLoading] = useState(true);

    const addRow = (newData) => {
        return new Promise((resolve) => {
            //TODO: add validation and reject()
            //reject();

            setTimeout(() => {
                setData([...data, newData]);
                postCall(newData)
                resolve();
            }, 1000);
        });
    }

    const deleteRow = (oldData) => {
        new Promise((resolve) => {
            setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                //TODO: axios rest call to delete from database
                resolve();
            }, 1000);
        });
    }

    const toEpochDateAsMillis = (transactionDate) => {

        let date_val = new Date(transactionDate);
        let utc_val = new Date(
            date_val.getTime() + date_val.getTimezoneOffset() * 60000,
        );

        return utc_val.valueOf();
    };

    const deleteCall = (payload) => {
        let endpoint = 'http://localhost:8080/transaction/delete/' + payload.guid;
        axios
            .delete(endpoint, "", {
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log(JSON.stringify(response));
                //alert(JSON.stringify(response));
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    }


    const getBreeds = async (newData, oldData) => {
        try {
            return await axios.patch('http://localhost:8080/transaction/update/' + oldData.guid)
        } catch (error) {
            console.error(error)
        }
    }

    const patchCallNew = async (newData, oldData) => {
        const breeds = await getBreeds(newData, oldData)

        if (breeds.data.message) {
            //console.log(`Got ${Object.entries(breeds.data.message).length} breeds`)
        }
    }


    const patchCall = (newData, oldData) => {
        let endpoint = 'http://localhost:8080/transaction/update/' + oldData.guid;
        //alert(JSON.stringify(newData));

        delete newData['tableData'];

        axios
            .patch(endpoint, newData, {
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json-patch+json',
                },
            })
            .then(response => {
                console.log(JSON.stringify(response));
                //alert(JSON.stringify(response));
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    }

    const postCall = (payload) => {
        let endpoint = 'http://localhost:8080/transaction/insert/';
        let newPayload = {};

        newPayload['guid'] = uuid();
        newPayload['transactionDate'] = toEpochDateAsMillis(payload.transactionDate);
        newPayload['description'] = payload.description;
        newPayload['category'] = payload.category;
        newPayload['notes'] = payload.notes;
        newPayload['amount'] = payload.amount;
        newPayload['cleared'] = payload.cleared;
        //TODO: how do we set the accountType
        newPayload['accountType'] = payload.accountType;
        newPayload['reoccuring'] = false
        newPayload['accountNameOwner'] = match.params.account;

        axios
            .post(endpoint, newPayload, {
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                console.log(JSON.stringify(response));
                //alert(JSON.stringify(response));
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    }

    let match = useRouteMatch("/transactions/:account");

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios(
                'http://localhost:8080/transaction/account/select/' + match.params.account,
            );

            setData(response.data);
            setLoading(false);
        };

        fetchData().then(() => console.log('called fetchData.'));
    }, []);

    const [data, setData] = useState([]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "date", field: "transactionDate", type: 'date'},
                            {title: "description", field: "description"},
                            {title: "category", field: "category"},
                            {title: "amount", field: "amount", type: "currency"},
                            {title: "cleared", field: "cleared", type: "numeric"},
                            {title: "notes", field: "notes"}, //TODO: add a custom text box for notes
                            {title: "accountType", field: "accountType"},
                            // {
                            //     title: 'Name', field: 'name',
                            //     editComponent: (props) => (
                            //         <TextField
                            //             type="text"
                            //             value={props.value ? props.value : ''}
                            //             onChange={e => props.onChange(e.target.value)}
                            //         />
                            //     )
                            // },
                        ]}
                        data={data}
                        title={"Transactions: " + match.params.account}
                        options={{
                            paging: true,
                            pageSize: 15,
                            addRowPosition: "first",
                            search: true
                        }}


                        editable={{
                            onRowAdd: addRow,
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        const dataUpdate = [...data];
                                        const index = oldData.tableData.id;
                                        dataUpdate[index] = newData;
                                        setData([...dataUpdate]);
                                        //patchCall(newData, oldData);
                                        resolve();
                                    }, 1000);
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        const dataDelete = [...data];
                                        const index = oldData.tableData.id;
                                        dataDelete.splice(index, 1);
                                        setData([...dataDelete]);
                                        //TODO: axios rest call to delete from database
                                        deleteCall(oldData)
                                        resolve();
                                    }, 1000);
                                })
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}

