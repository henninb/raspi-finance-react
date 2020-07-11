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

    const currencyFormat = (inputData) => {
        inputData = parseFloat(inputData).toFixed(2);
        return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                            {title: "unbalanced", field: "totals", type: "currency"},
                            {title: "balanced", field: "totalsBalanced", type: "currency"},
                        ]}
                        data={data}
                        title={` [ $${currencyFormat(totals.totalsCleared)} ], [ $${currencyFormat(totals.totals)} ]`}
                        options={{
                            paging: false,
                            search: true
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}