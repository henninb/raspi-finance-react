import React, {useCallback, useEffect, useState} from 'react'
import Select, {createFilter} from 'react-select'
import axios from "axios";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function TransactionMoveDialog({closeDialog, transactionGuid}) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');

    const handleChange =  (selectedOption) => {
        setValue(selectedOption.value);
    }

    const handleButtonClick = async () => {
        await updateAccountByGuid(value);
        if (value !== undefined && value !== "" ) {
            closeDialog();
        }
    }

    const  updateAccountByGuid = async(accountNameOwner) => {
        let endpoint = 'http://localhost:8080/transaction/update/account';
        let newData = {};
        newData['accountNameOwner'] = accountNameOwner
        newData['guid'] = transactionGuid

        const response = await axios.put(endpoint, JSON.stringify(newData), {
            timeout: 0,
            headers: {'Content-Type': 'application/json'}
        });

        alert(response.data);
    }

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/select/active');

            let optionList = []
            response.data.forEach(element => {
                optionList = optionList.concat({value: element.accountNameOwner, label: element.accountNameOwner});
            })

            setOptions(optionList);
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

        if (options.length === 0) {
            fetchData();
        }

        return () => {
        }

    }, [options, fetchData]);

  return (<div>
      <Button variant="outlined" color="primary" onClick={closeDialog}>Open form dialog</Button>
      <Dialog onClose={closeDialog} aria-labelledby="form-dialog-title" open={true}>
        <DialogTitle id="form-dialog-title">Move a transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the new account {transactionGuid} is moving to.</DialogContentText>
            <Select
                name="account-select"
                //filterOption={createFilter({ matchFrom: ["first", "any"] })}
                filterOption={createFilter({ matchFrom: "first" })}
                onChange={handleChange}
                native={true}
                options={options}
                placeholder={"Select the new account moving to..."}
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