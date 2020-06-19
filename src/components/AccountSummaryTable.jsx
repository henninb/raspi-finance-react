import React, {useState, useEffect} from "react";
import MaterialTable from "material-table";
import Spinner from './Spinner';
import './master.scss';
import axios from "axios";

export default function AccountSummaryTable() {

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios('http://localhost:8080/account/select/totals',);

            response.data.forEach(element1 => {
                //alert(element1.accountNameOwner);
            });

            setData(response.data);
            setLoading(false);
        };

        fetchData().then(() => console.log('successfully called fetchData.'));
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
                        title="AccountSummary"
                        //title={`Transactions: [${match.params.account}] [ $${totals.totalsCleared} ], [ $${totals.totals} ]`}
                        options={{
                            paging: false,
                            search: true
                        }}
                    />
                </div> : <div className="centered"><Spinner/></div>}</div>
    )
}