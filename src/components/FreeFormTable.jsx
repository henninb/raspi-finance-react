import React, {useState} from 'react'
import DataGrid from 'react-data-grid'
import SnackbarBaseline from "./SnackbarBaseline"
import useTransactionInsert from "./queries/useTransactionInsert"
import {useRouteMatch} from "react-router-dom"

export default function FreeFormTable({data, toggleDisplayList}) {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const routeMatch = useRouteMatch("/transactions/:account")
    const {mutate: insertTransaction} = useTransactionInsert(routeMatch.params["account"])

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

    const handleError = (error, moduleName, throwIt) => {
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
                await insertTransaction({ payload: transaction, isFutureTransaction: false})
                //await postCall(transaction)
            } catch (error) {
                handleError(error, 'handleChange', false)
            }
        }
        toggleDisplayList()
    }

    return (
        <div>
                <div>
                    <DataGrid style={{width: '1024px'}}
                        rows={data}
                        columns={[
                            {
                                header: 'Account Name Owner',
                                name: "accountNameOwner",
                                key: "accountNameOwner",
                                editable: true,
                            },
                            {
                                header: 'Account Name Owner',
                                name: "date",
                                key: "transactionDate",
                                type: "date",
                                editable: true,
                            },
                            {
                                header: "description",
                                name: "description",
                                key: "description",
                                editable: true,
                            },
                            {
                                header: "category",
                                name: "category",
                                key: "category",
                                editable: true,
                            },
                            {
                                header: "Amount",
                                name: "amount",
                                key: "amount",
                                type: "currency",
                                editable: true,
                            },
                            {
                                header: "State",
                                name: "state",
                                key: "transactionState",
                                editable: true,
                            },
                            {
                                header: "",
                                name: "reoccur",
                                key: "reoccurringType",
                                editable: true,
                            },
                            {
                                header: "",
                                name: "notes",
                                key: "notes",
                                editable: true,
                            },
                            {
                                header: "",
                                name: "due",
                                key: "dueDate",
                                type: "date",
                                editable: true,
                            },
                        ]}
                        options={{
                            filtering: true,
                            // selection: true,
                            paging: false,
                            //pageSize: 20,
                            addRowPosition: "first",
                            search: true,
                            paginationPosition: "both",
                            headerStyle: {
                                backgroundColor: "#9965f4",
                                color: "#FFF",
                            },
                        }}

                        actions={[
                        ]}
                    />
                </div>
            <p>
                {/*<input type="button" value="toFreeForm" onClick={() => toggleDisplayList()}/>*/}
                <input type="submit" value="submit" onClick={() => handleChange()}/>
            </p>
            <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
        </div>
    )
}
