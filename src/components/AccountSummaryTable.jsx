import React, { Component } from "react";
import MaterialTable from "material-table";
import NavbarInstance from './NavbarInstance';
import Spinner from './Spinner';
import './master.scss';

export default class AccountSummaryTable extends Component {
  state = {
    loading: true,
    data: [
        { guid: 1, accountName: "chase", owner: "brian", amount: 5.51, cleared: 5.51 },
        { guid: 1, accountName: "amex", owner: "brian", amount: 4.50, cleared: 4.50 },
    ]
  }

  setData() {

  }

  componentDidMount() {
    this.isLoading = setTimeout(()=>{this.setState({loading: false})}, 2300);
  }

  componentWillUnmount() {
     clearTimeout(this.isLoading);
  }

  timer = () => setTimeout(()=>{
    this.setState({loading: false})
  }, 2300);

  render() {
    const {loading} = this.state;
    const {data} = this.state;
    let val;
    if( loading )  {
      //val = <div class="loading centered"></div>
      val = <div class="centered"><Spinner /></div>
    } else {
    val =
      <div style={{ maxWidth: "100%" }}>
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
            paging: false
          }}

         editable={{
        onRowAddCancelled: rowData => console.log("Row adding cancelled"),
        onRowUpdateCancelled: rowData => console.log("Row editing cancelled"),
        onRowAdd: newData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    /* setData([...data, newData]); */

                    resolve();
                }, 1000);
            }),
        onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    resolve();
                }, 1000);
            }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    resolve();
                }, 1000);
            })
    }}

        />
      </div>;
    }
    return (
      <div>
        {val}
      </div>
    )
  }
}
