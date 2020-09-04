import React, {useCallback, useEffect, useState} from 'react'
//import Select, {createFilter} from 'react-select'
import axios from "axios";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {endpointUrl} from "./Common"

export default function TransactionMoveDialog({closeDialog, transactionGuid}) {

    const [optionsNew, setOptionsNew] = useState([]);
    const [value1, setValue1] = useState(optionsNew[0]);
    const [inputValue, setInputValue] = useState('');

    const handleButtonClick = async () => {
        try {
          await updateAccountByGuid(value1);
          closeDialog();
        } catch(error) {
          alert("handleButtonClick failure.");
        }
    }

    const  updateAccountByGuid = async(accountNameOwner) => {
        let endpoint = endpointUrl() + '/transaction/update/account';
        let newData = {};
        newData['accountNameOwner'] = accountNameOwner
        newData['guid'] = transactionGuid

        await axios.put(endpoint, JSON.stringify(newData), {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });
    }

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + '/account/select/active');

            let accounts = []
            response.data.forEach(element => {
                accounts.push(element.accountNameOwner);
            })

            //setOptions(optionList);
            setOptionsNew(accounts);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                } else {
                    alert("fetchData" + JSON.stringify(error.response.data));
                }
            }
        }
    }, []);

    useEffect(() => {

        if (optionsNew.length === 0) {
            fetchData();
        }

        return () => {
        }

    }, [optionsNew, fetchData]);

  return (<div>
      <Button variant="outlined" color="primary" onClick={closeDialog}>Open form dialog</Button>
      <Dialog onClose={closeDialog} aria-labelledby="form-dialog-title" open={true}>
        <DialogTitle id="form-dialog-title">Move a transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the new account {transactionGuid} is moving to.</DialogContentText>

            <Autocomplete
               value={value1}
               onChange={(event, newValue) => {
                  setValue1(newValue);
               }}
               inputValue={inputValue}
               onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
               }}
               options={optionsNew}
               renderInput={(params) => <TextField {...params} label="Accounts" variant="outlined" />}
            />

        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">Cancel</Button>
          <Button onClick={handleButtonClick} color="primary">Move</Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}