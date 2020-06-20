import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";

export default function AccountSummaryTable() {

    const [totals, setTotals] = useState([]);

    const fetchData = async () => {
        const response = await axios('http://localhost:8080/account/select/totals',);

        response.data.forEach(element1 => {
            //alert(element1.accountNameOwner);
        });

        setData(response.data);
        setLoading(false);
    };

    function currencyFormat(x) {
        x = parseFloat(x).toFixed(2);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const fetchTotals = async () => {
        const response = await axios.get('http://localhost:8080/account/totals' );
        setTotals(response.data);
    };

    useEffect(async() => {
        await fetchData();
        await fetchTotals();
    }, []);


    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

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
                        //title="AccountSummary"
                        title={` [ $${currencyFormat(totals.totalsCleared)} ], [ $${currencyFormat(totals.totals)} ]`}
                        options={{
                            paging: false,
                            search: true
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}