import React, {useState,useEffect} from "react";
import MaterialTable from "material-table";
import NavbarInstance from './NavbarInstance';
import Spinner from './Spinner';
import './master.scss';

export default function TransactionTable () {

  const timer = () => setTimeout(()=>{
    setLoading(false)
  }, 2300);

  const [loading, setLoading] = useState(true);
  useEffect(function() {timer()})

   const [data, setData] = useState([
     { guid: 1, date: "6/12/2020", transaction: "test.com", category: "online", amount: 5.51, cleared: 1, notes: "none" },
        { guid: 2, date: "6/13/2020", transaction: "Walgreens", category: "", amount: 10.51, cleared: 1, notes: "none" },
        { guid: 3, date: "4/3/2020", transaction: "aliexpress.com", category: "online", amount: 7.71, cleared: 1, notes: "none" },
        { guid: 4, date: "4/3/2020", transaction: "ebay.com", category: "online", amount: 4.43, cleared: 1, notes: "none" },
    ]);

  return (<div>
        {!loading ?
      <div className="table-formatting">
        <NavbarInstance />
        <MaterialTable
          columns={[
            { title: "guid", field: "guid" },
            { title: "date", field: "date" },
            { title: "transaction", field: "transaction" },
            { title: "category", field: "category" },
            { title: "amount", field: "amount", type: "numeric" },
            { title: "cleared", field: "cleared", type: "numeric" },
            { title: "notes", field: "notes"},
            { title: "dateAdded", field: "dateAdded", type: "date"},
            { title: "dateUpdated", field: "dateUpdated", type: "date"},
          ]}
          data={data}
          title="Transactions"
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

