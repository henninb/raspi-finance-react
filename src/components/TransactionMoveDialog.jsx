import React, {useCallback, useEffect, useState} from 'react'
import Select from 'react-select'
import axios from "axios";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function TransactionMoveDialog({closeDialog, transactionGuid}) {
    const [options, setOptions] = useState([]);

    const handleChange = (selectedOption) => {
        alert(selectedOption);
    }

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/select/active');

            let optionList = []
            response.data.forEach(element => {
                optionList = optionList.concat({value: element.accountNameOwner, label: element.accountNameOwner});
            })

            //if( response.data.length > 0 ) {
            setOptions(optionList);
            //}
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

        //if (options.length === 0) {
            fetchData();
        //}

        return () => {

        }

    }, [options, fetchData]);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={closeDialog}>
        Open form dialog
      </Button>
      <Dialog onClose={closeDialog} aria-labelledby="form-dialog-title" open={true}>
        <DialogTitle id="form-dialog-title">Move a transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new account {transactionGuid} is moving to.
          </DialogContentText>
{/*           <TextField */}
{/*             autoFocus */}
{/*             margin="dense" */}
{/*             id="account_name_owner" */}
{/*             label="account_name_owner" */}
{/*             fullWidth */}
{/*           /> */}
            <Select
//                 value={"blah"}
                onChange={handleChange}
//                 native={true}
                options={options}
                placeholder={"Select the account moving to..."}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={closeDialog} color="primary">
            Move
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}