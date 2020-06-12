import React, {Component} from 'react';
import './TransactionTable.css';
import './Loader.scss';

class TransactionTable extends Component {
  state = {
    loading: true,
    table: [
      ["guid", "date", "transactionName", "category", "amount"],
      [1, "6/12/2020", "test.com", "online", "5.50"],
      [2, "6/10/2020", "test.com", "online", "7.62"],
      [3, "5/12/2020", "test.com", "online", "4.35"],
      [4, "5/15/2020", "test.com", "online", "15.71"],
      [5, "4/11/2020", "Walgreens", "none", "25.22"],
    ]
  }

  addRow = row => {
    const table = this.state.table.slice()
    table.push(row)
    this.setState({ table })
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
    const headers = this.state.table.slice(0, 1)[0]
    const rows = this.state.table.slice(1)
    const {loading} = this.state;

    return (
            loading ? (<Loading/>) :(
      <div>
        <table>
          <TableHeaders headers={headers} />
          <tbody>
            {
              rows.map(row => <TableRow row={row}/>)
            }
          </tbody>
        </table>
        <AddRowButton addRow={this.addRow} />
      </div>)
    )
  }
}

const Loading =()=>
  <div class="loading"></div>

const TableHeaders = ({ headers }) =>
  <thead>
    <tr>
      { headers.map(header => <th>{ header }</th>) }
    </tr>
  </thead>

const TableRow = ({ row }) =>
  <tr>
    { row.map(cell => <td>{cell}</td>) }
  </tr>

const AddRowButton = ({ addRow }) =>
  <button onClick={() => addRow(['test','test','test','test','test'])}>
    ADD ROW
  </button>


export default TransactionTable;
