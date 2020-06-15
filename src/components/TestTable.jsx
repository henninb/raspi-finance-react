import React, { Component } from "react";
import MaterialTable from "material-table";
import NavbarInstance from './NavbarInstance';
import Spinner from './Spinner';
import './master.scss';

export default class TestTable extends Component {
  state = {
    loading: true,
    data: [
        { guid: 1, date: "6/12/2020", transaction: "test.com", category: "online", amount: 5.51, cleared: 1, notes: "none" },
        { guid: 2, date: "6/13/2020", transaction: "Walgreens", category: "", amount: 10.51, cleared: 1, notes: "none" },
        { guid: 3, date: "4/3/2020", transaction: "aliexpress.com", category: "online", amount: 7.71, cleared: 1, notes: "none" },
        { guid: 4, date: "4/3/2020", transaction: "ebay.com", category: "online", amount: 4.43, cleared: 1, notes: "none" },
      ]
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
            search: false
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
