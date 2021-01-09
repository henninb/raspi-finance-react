import React, {useCallback, useEffect, useState} from "react"
import axios from "axios"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import {useFilePicker, utils} from "react-sage"
import {endpointUrl} from "./Common"

interface Props {
    closeDialog: any
    transactionGuid: string
}

//TODO: this is an unused component as of 11/19/2020
export default function TransactionMove({
                                            closeDialog,
                                            transactionGuid,
                                        }: Props) {
    const [fileContent, setFileContent] = useState("")
    //const { files, onClick, errors, HiddenFileInput } = useFilePicker({
    const {files, onClick, HiddenFileInput} = useFilePicker({
        //maxFileSize: MAX_FILE_SIZE,
        maxImageWidth: 1000,
        imageQuality: 0.92,
        resizeImage: true,
    })

    const changeReceiptImage = useCallback(async () => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

        const response = await axios.put(
            endpointUrl() + "/transaction/update/receipt/image/" + transactionGuid,
            //fileContent.replace(/^data:image\/[a-z]+;base64,/, ""),
            fileContent,
            {
                cancelToken: source.token,
                timeout: 0,
                headers: {"Content-Type": "text/plain"},
            }
        )
        if (response.data !== "transaction receipt image updated") {
            console.log("changeReceiptImage - failure")
            console.log(response.data)
        }

        return () => {
            source.cancel()
        }
    }, [fileContent, transactionGuid])

    const handleButtonClick = useCallback(async () => {
        try {
            let response = changeReceiptImage()
            console.log(response)
            closeDialog()
        } catch (error) {
            alert("handleButtonClick failure.")
        }
    }, [changeReceiptImage, closeDialog])

    const fetchFileData = useCallback(async (): Promise<void> => {
        // @ts-ignore
        const data = await Promise.all(files.map(utils.loadFile))
        //const strImage = data.replace(/^data:image\/[a-z]+;base64,/, "");
        // @ts-ignore

        setFileContent(data)
    }, [files])

    useEffect(() => {
        let response = fetchFileData()
        console.log(response)

        return () => {
        }
    }, [files, fetchFileData])

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
                <DialogTitle id="form-dialog-title">Save a transaction</DialogTitle>

                <button onClick={onClick}>Upload</button>
                <HiddenFileInput accept=".jpg, .jpeg, .png" multiple={false}/>

                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleButtonClick} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
