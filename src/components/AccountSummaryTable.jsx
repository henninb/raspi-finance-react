import React, {useState,useEffect} from "react";
import MaterialTable from "material-table";
import NavbarInstance from './NavbarInstance';
import Spinner from './Spinner';
import './master.scss';

export default function AccountSummaryTable () {

  const timer = () => setTimeout(()=>{
    setLoading(false)
  }, 2300);


  const [loading, setLoading] = useState(true);
  useEffect(function() {timer()})

   const [data, setData] = useState([
        { guid: 1, accountName: "chase", owner: "brian", amount: 5.51, cleared: 5.51 },
        { guid: 2, accountName: "amex", owner: "brian", amount: 4.50, cleared: 4.50 },
    ]);

  return (<div>
        {!loading ?
      <div className="table-formatting">
        <NavbarInstance />
        <MaterialTable
          columns={[
            { title: "guid", field: "guid" },
            { title: "accountName", field: "accountName" },
            { title: "owner", field: "owner" },
            { title: "amount", field: "amount", type: "numeric" },
            { title: "cleared", field: "cleared", type: "numeric" },
          ]}
          data={data}
          title="AccountSummary"
          options={{
            paging: false,
            search: true
          }}

         editable={{
           onRowAddCancelled: rowData => console.log("Row adding cancelled"),
           onRowDeleteCancelled: rowData => console.log("Row deleting cancelled"),
           onRowUpdateCancelled: rowData => console.log("Row editing cancelled"),
           onRowAdd: newData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    setData([...data, newData]);
                    resolve();
                }, 1000);
            }),
           onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...data];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setData([...dataUpdate]);
                  resolve();
                }, 1000);
            }),
           onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    resolve();
                }, 1000);
             })
         }}
        />
      </div>: <div className="centered"><Spinner /></div>}</div>
    )
  }

