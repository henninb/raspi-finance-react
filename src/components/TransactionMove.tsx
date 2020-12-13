import React, {useCallback, useEffect, useState} from "react"
import axios from "axios"
import Button from "@material-ui/core/Button"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import {endpointUrl} from "./Common"
import SnackbarBaseline from "./SnackbarBaseline";

interface Props {
    closeDialog: any
    transactionGuid: any
}

export default function TransactionMove({
                                            closeDialog,
                                            transactionGuid,
                                        }: Props) {
    const [options, setOptions] = useState([])
    const [value, setValue] = useState(options[0])
    const [inputValue, setInputValue] = useState("")
    const [accountType, setAccountType] = useState([])
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

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

    const findAccountTypeForGuid = useCallback(async () => {
        let endpoint = endpointUrl() + "/transaction/select/"

        try {
            let response = await axios.get(endpoint + transactionGuid, {
                timeout: 0,
                headers: {"Content-Type": "application/json"},
            })
            setAccountType(response.data.accountType)
            return response.data
        } catch (error) {
            handleError(error, 'findAccountTypeForGuid', true)
        }
    }, [transactionGuid])

    const fetchActiveAccounts = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + "/account/select/active")
            await findAccountTypeForGuid()
            console.log(accountType)

            let accounts: any[] = []
            response.data.forEach((element: any) => {
                if (element.accountType === accountType) {
                    accounts.push(element.accountNameOwner)
                }
            })
            // @ts-ignore
            setOptions(accounts)
        } catch (error) {
            handleError(error, 'findAccountTypeForGuid', true)
        }
    }, [accountType, findAccountTypeForGuid])

    const updateAccountByGuid = useCallback(
        async (accountNameOwner: any) => {
            let endpoint = endpointUrl() + "/transaction/update/account"
            let newData = {
                accountNameOwner: accountNameOwner,
                guid: transactionGuid,
            }

            try {
                let response = await axios.put(endpoint, JSON.stringify(newData), {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                })

                console.log(response.data)
                return response.data
            } catch (error) {
                handleError(error, 'updateAccountByGuid', true)
            }
        },
        [transactionGuid]
    )

    const handleButtonClick = useCallback(async () => {
        try {
            let response = await updateAccountByGuid(value)
            console.log(response)
            closeDialog()
        } catch (error) {
            handleError(error, 'updateAccountByGuid', true)
        }
    }, [closeDialog, value, updateAccountByGuid])

    useEffect(() => {
        if (options.length === 0) {
            let response = fetchActiveAccounts()
            console.log("accounts: " + response)
        }

        return () => {
        }
    }, [options, fetchActiveAccounts])

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
                <DialogTitle id="form-dialog-title">Move a transaction</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the new account {transactionGuid} is moving to.
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
                    <Button onClick={handleButtonClick} color="primary">
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
