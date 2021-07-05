import React, {useCallback, useEffect, useState} from "react"
import Button from "@material-ui/core/Button"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import SnackbarBaseline from "./SnackbarBaseline";
import useFetchAccount from "./queries/useFetchAccount";
import useTransactionUpdate from "./queries/useTransactionUpdate";

interface Props {
    closeDialog: any
    currentTransaction: any
}

export default function TransactionMove({
                                            closeDialog,
                                            currentTransaction,
                                        }: Props) {
    const [options, setOptions] = useState([])
    const [value, setValue] = useState(options[0])
    const [inputValue, setInputValue] = useState("")
    const [accountType, setAccountType] = useState("")
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const {data, isSuccess} = useFetchAccount()
    const {mutate: updateTransaction} = useTransactionUpdate()

    const handleError = (error: any, moduleName: string, throwIt: boolean) => {
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

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const handleButtonClick = useCallback(async (currentTransaction) => {
        try {
            let newTransaction = Object.assign({}, currentTransaction)
            newTransaction.accountNameOwner = value
            // @ts-ignore
            updateTransaction({oldRow: currentTransaction, newRow: newTransaction})
            closeDialog()
        } catch (error) {
            handleError(error, 'updateAccountByGuid', true)
        }
    }, [value, updateTransaction, closeDialog])

    useEffect( () => {
        if( isSuccess) {
            setAccountType(currentTransaction.accountType)
            let accounts: any[] = []
            data.forEach((element: any) => {
                if (element.accountType === accountType) {
                    accounts.push(element.accountNameOwner)
                }
            })
            // @ts-ignore
            setOptions(accounts)
        }

    }, [accountType, currentTransaction, data, isSuccess])

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={closeDialog}>
                Open form dialog
            </Button>
            <Dialog
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
                open={true}
            >
                <DialogTitle id="form-dialog-title">Move a transaction from one account to another</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the new account {currentTransaction.guid} is moving to.
                    </DialogContentText>
                    <Autocomplete
                        value={value}
                        onChange={(_event, newValue) => {
                            // @ts-ignore
                            setValue(newValue)
                        }}
                        inputValue={inputValue}
                        onInputChange={(_event, newInputValue) => {
                            setInputValue(newInputValue)
                        }}
                        options={options}
                        renderInput={(params) => (
                            <TextField {...params} label="Accounts" variant="outlined"/>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleButtonClick(currentTransaction)} color="primary">
                        Move
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
            </div>
        </div>
    )
}
