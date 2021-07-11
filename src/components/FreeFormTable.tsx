import React, {useState} from 'react'
import DataGrid from 'react-data-grid'
import SnackbarBaseline from "./SnackbarBaseline"
import useTransactionInsert from "./queries/useTransactionInsert"

export default function FreeFormTable({data, toggleDisplayList}: any) {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const {mutate: insertTransaction} = useTransactionInsert(data[0].accountNameOwner)

    // const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    //     this.setState(state => {
    //         const rows = state.rows.slice();
    //         for (let i = fromRow; i <= toRow; i++) {
    //             rows[i] = { ...rows[i], ...updated };
    //         }
    //         return { rows };
    //     });
    // };

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const handleError = (error: any, moduleName: any, throwIt: any) => {
        if (error.response) {
            setMessage(`${moduleName}: ${error.response.status} and ${JSON.stringify(error.response.data)}`)
            console.log(`${moduleName}: ${error.response.status} and ${JSON.stringify(error.response.data)}`)
            setOpen(true)
        } else {
            setMessage(`${moduleName}: failure`)
            console.log(`${moduleName}: failure`)
            setOpen(true)
            if (throwIt) {
                throw  error
            }
        }
    }

    const handleChange = async () => {
        for (const transaction of data) {
            try {
                console.log("transaction:" + JSON.stringify(transaction))
                insertTransaction({
                    accountNameOwner: transaction.accountNameOwner,
                    newRow: transaction,
                    isFutureTransaction: false
                })
            } catch (error) {
                handleError(error, 'handleChange', false)
            }
        }
        toggleDisplayList()
    }

    // @ts-ignore
    return (
        <div>
            <div>
                <DataGrid style={{width: '1024px'}}
                          rows={data}
                          columns={[
                              {
                                  name: "accountNameOwner",
                                  key: "accountNameOwner",
                                  editable: true,
                              },
                              {
                                  name: "date",
                                  key: "transactionDate",
                                  editable: true,
                              },
                              {
                                  name: "description",
                                  key: "description",
                                  editable: true,
                              },
                              {
                                  name: "category",
                                  key: "category",
                                  editable: true,
                              },
                              {
                                  name: "amount",
                                  key: "amount",
                                  editable: true,
                              },
                              {
                                  name: "state",
                                  key: "transactionState",
                                  editable: true,
                              },
                              {
                                  name: "reoccur",
                                  key: "reoccurringType",
                                  editable: true,
                              },
                              {
                                  name: "notes",
                                  key: "notes",
                                  editable: true,
                              },
                              {
                                  name: "due",
                                  key: "dueDate",
                                  editable: true,
                              },
                          ]}
                />
            </div>
            <div>
                {/*<input type="button" value="toFreeForm" onClick={() => toggleDisplayList()}/>*/}
                <input type="submit" value="submit" onClick={() => handleChange()}/>
            </div>
            <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
        </div>
    )
}
