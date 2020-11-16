import React, {useEffect, useState} from 'react'
import axios from "axios";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FilePicker } from 'react-file-picker'
import {endpointUrl} from "./Common";

export default function TransactionMove({closeDialog, transactionGuid}) {
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');

    const handleButtonClick = async () => {
        try {
            let response = changeReceiptImage()
            console.log(response);
            closeDialog();
        } catch(error) {
            alert("handleButtonClick failure.");
        }
    }

    const changeReceiptImage = async () => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const response = await axios.put(endpointUrl() + '/transaction/update/receipt/image/' + transactionGuid, fileContent, {
            cancelToken: source.token,
            timeout: 0,
            headers: {'Content-Type': 'text/plain'}
        });
        if (response.data !== 'transaction receipt image updated') {
            console.log('changeReceiptImage - failure');
            console.log(response.data);
        }
        return () => {
            source.cancel();
        };
    };

    useEffect(() => {
        return () => {
        }

    }, []);

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={closeDialog}>Open form dialog</Button>
            <Dialog onClose={closeDialog} aria-labelledby="form-dialog-title" open={true}>
                <DialogTitle id="form-dialog-title">Save a transaction</DialogTitle>

  <FilePicker
    extensions={['jpg', 'png', 'jpeg']}
    onChange={ file => {
         let reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => {
           setFileContent(reader.result)
         };
      setFileName(file)
      }}
    onError={_errMsg => (console.log('do something with the failure'))}
  >
    <button>Upload</button>
  </FilePicker>
  <p>fileName = {fileName.name}</p>
  <p>size = {fileName.size}{fileName.size ? ' bytes' : null}</p>
  <p>content = {fileContent}{fileContent ? ' content' : null}</p>

                <DialogActions>
                    <Button onClick={closeDialog} color="primary">Cancel</Button>
                    <Button onClick={handleButtonClick} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}
