import React, {useCallback, useEffect, useState} from 'react'
import axios from "axios";
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FilePicker } from 'react-file-picker'
import {endpointUrl} from "./Common";

export default function TransactionMove({closeDialog, transactionGuid}) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(options[0]);
    const [inputValue, setInputValue] = useState('');

    const handleButtonClick = async () => {
        try {
            closeDialog();
        } catch(error) {
            alert("handleButtonClick failure.");
        }
    }

//    const  updateAccountByGuid = async(accountNameOwner) => {
//        let endpoint = endpointUrl() + '/transaction/update/account';
//        let newData = {};
//        newData['accountNameOwner'] = accountNameOwner
//        newData['guid'] = transactionGuid
//
//        await axios.put(endpoint, JSON.stringify(newData), {
//            timeout: 0,
//            headers: {'Content-Type': 'application/json'}
//        });
//    }

//    const fetchData = useCallback(async () => {
//        try {
//            const response = await axios.get(endpointUrl() + '/account/select/active');
//
//            let accounts = []
//            response.data.forEach(element => {
//                accounts.push(element.accountNameOwner);
//            })
//
//            setOptions(accounts);
//        } catch (error) {
//            if (error.response) {
//                if (error.response.status === 404) {
//                } else {
//                    alert("fetchData" + JSON.stringify(error.response.data));
//                }
//            }
//        }
//    }, []);

    useEffect(() => {

//        if (options.length === 0) {
//            fetchData();
//        }

        return () => {
        }

    }, []);

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={closeDialog}>Open form dialog</Button>
            <Dialog onClose={closeDialog} aria-labelledby="form-dialog-title" open={true}>
                <DialogTitle id="form-dialog-title">Save a transaction</DialogTitle>

  <FilePicker
    extensions={['md']}
    onChange={FileObject => (/* do something with File object */)}
    onError={errMsg => (/* do something with err msg string */)
  >
    <button>
      Click to upload markdown
    </button>
  </FilePicker>

                <DialogActions>
                    <Button onClick={closeDialog} color="primary">Cancel</Button>
                    <Button onClick={handleButtonClick} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}