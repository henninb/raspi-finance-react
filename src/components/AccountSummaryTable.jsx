import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";

export default function AccountSummaryTable() {

    const [totals, setTotals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    function currencyFormat(inputData) {
        inputData = parseFloat(inputData).toFixed(2);
        return inputData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/select/totals');

            setData(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response) {
                alert(JSON.stringify(error.response.data));
            }
        }
    };

    const fetchTotals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/totals');
            setTotals(response.data);
        } catch (error) {
            if (error.response) {
                alert(JSON.stringify(error.response.data));
            }
        }
    };

    useEffect(async () => {
        let isMounted = true;
        //TODO: consider a try catch here
        if (isMounted) {
            await fetchData();
            await fetchTotals();
        }
        return () => {
            isMounted = false
        };
    }, []);

    return (<div>
            {!loading ?
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {title: "accountNameOwner", field: "accountNameOwner"},
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