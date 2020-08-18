import React, {useCallback, useEffect, useState} from "react";
import MaterialTable from "material-table";
import './master.scss';
import axios from "axios";
import SelectAccountNameOwnerCredit from './SelectAccountNameOwnerCredit'
import Spinner from "./Spinner";
import {formatDate} from "./Common"
import {useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function PaymentTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const handleButtonClickLink = (accountNameOwner) => {
        history.push('/transactions/' + accountNameOwner);
        history.go(0);
    }

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    if (verifyData(newData)) {
                        await postCallPayment(newData);
                    } else {
                        reject();
                    }
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

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/payment/select');
            if (response.data.length > 0) {
                setData(response.data);
            }
            setLoading(false);
        } catch (error) {
            if (error.response) {
                alert("fetchData - status: " + error.response.status + " - " + JSON.stringify(error.response.data));
            }
        }
    }, []);

    const verifyData = (newData) => {
        if (isNaN(newData.amount)) return false;
        // if(newData.amount === undefined) return false;
        // if(newData.transactionDate === undefined) return false;
        // return newData.accountNameOwner !== undefined;
        return true
    }

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

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if (data === undefined) {
            console.log('data is undefined')
        }

        if (data.length === 0) {
            fetchData();
        }

        return () => {
            source.cancel();
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
                            {title: "transactionDate", field: "transactionDate", type: "date", cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    return <div>{formatDate(rowData.transactionDate)}</div>
                                }
                            },
                            {title: "accountNameOwner", field: "accountNameOwner", cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    return (
                                        <Button style={{ fontSize: '.6rem' }}
                                            onClick={() => handleButtonClickLink(rowData.accountNameOwner)}>{rowData.accountNameOwner}</Button>
                                    )
                                }
                                ,
                                editComponent: (props) => {
                                    return (
                                        <SelectAccountNameOwnerCredit onChangeFunction={props.onChange}
                                                                      currentValue={props.value}/>
                                    )
                                }
                            },
                            {title: "amount", field: "amount", type: "currency", cellStyle: {whiteSpace: "nowrap"}},
                        ]}
                        data={data}
                        title="Payments"
                        options={{
                            paging: true,
                            paginationPosition: "both",
                            pageSize: 20,
                            addRowPosition: "first",
                            search: false,
                            headerStyle: {
                                backgroundColor: '#01579b',
                                color: '#FFF',
                            },
                            rowStyle: {
                                fontSize: '.6rem',
                            }
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
