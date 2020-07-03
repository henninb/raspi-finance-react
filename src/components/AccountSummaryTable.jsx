import React, {useState, useEffect, useCallback} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";
import Link from "@material-ui/core/Link";

export default function AccountSummaryTable() {

    const [totals, setTotals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

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
                alert(JSON.stringify(error.response.data));
            }
        }
    }, []);

    const fetchData = useCallback(async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        try {
            const response = await axios.get('http://localhost:8080/account/select/totals');

            setData(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response) {
                alert(JSON.stringify(error.response.data));
            }
        }

        return () => {
            source.cancel();
        };
    }, []);

    useEffect( () => {

        if( data.length === 0 ) {
            fetchData();
        }

        if( totals.length === 0 ) {
            fetchTotals();
        }

    }, [totals, data, fetchData, fetchTotals]);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "accountNameOwner", field: "accountNameOwner",
                                render: (rowData) => {
                                    return (
                                        <Link to="/transactions/t">{rowData.accountNameOwner}</Link>
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