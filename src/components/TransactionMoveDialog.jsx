//import React from 'react';
import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function TransactionMoveDialog({showDialog, closeDialog, transactionGuid}) {

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
          <TextField
            autoFocus
            margin="dense"
            id="account_name_owner"
            label="account_name_owner"
            fullWidth
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