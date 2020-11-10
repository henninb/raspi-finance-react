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
    const [fileName, setFileName] = useState('');

    const handleButtonClick = async () => {
        try {
            closeDialog();
        } catch(error) {
            alert("handleButtonClick failure.");
        }
    }

    const getBase64 = (file) => {
       let reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = () => {
         console.log(reader.result);
         return reader.result
       };
       reader.onerror = (error) => {
         console.log('Error: ', error);
       };
    }

//    const extractWordRawText = arrayBuffer => {
//     let mammoth
//      .extractRawText({ arrayBuffer })
//      .then(result => {
//        const text = result.value; // The raw text
//        const messages = result.messages; // Please handle messages
//        //this.setState({ text });
//        setText(text);
//      })
//      .done();
//    };

//    const handleFileChange = file => {
//        const reader = new FileReader();
//        reader.readAsArrayBuffer(file);
//        reader.onload = e => {
//          extractWordRawText(e.target.result);
//        };
//
//        //this.setState({ title: file.name });
//    };

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
      console.log('do something with the file object')
      setFileName(file)
      let b64 = getBase64(file)
      }}
    onError={errMsg => (console.log('do something with the failure'))}
  >
    <button>Upload</button>
  </FilePicker>
  <p>fileName = {fileName.name}</p>
  <p>size = {fileName.size}{fileName.size ? ' bytes' : null}</p>

                <DialogActions>
                    <Button onClick={closeDialog} color="primary">Cancel</Button>
                    <Button onClick={handleButtonClick} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}