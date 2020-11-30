import React, {useCallback, useState} from 'react';
import {v4 as uuidv4} from "uuid"
import {endpointUrl} from "./Common";
import axios from "axios"
import os from "os";
import "./master.scss"
import Snackbar from "@material-ui/core/Snackbar";
require('datejs') //momentjs - look into this

export default function FreeForm() {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const postCall = useCallback(
        async (payload) => {

            let endpoint = endpointUrl() + "/transaction/insert/"

            try {
                let response = await axios.post(endpoint, payload, {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                })
                
                setOpen(true)
                return response
            } catch(error) {
                console.log(error.response)
                console.log(error.message)
                return ""
            }
        },
        []
    )

    const handleChange = async () => {
        const text = document.getElementById("textArea").value;
        let sanitizedText = text.replace(/\t/g, ',')
        sanitizedText = sanitizedText.toLowerCase()
        const lines = sanitizedText.split(os.EOL)

        for (const line of lines) {
            const columns = line.split(',')
            let accountNameOwner = columns[0]
            let transactionDate = columns[1]
            let description = columns[2]
            let amount = columns[3]

            console.log(`column count: ${columns.length}`)
            if (columns.length === 4) {
                amount = amount.replace(/\$/g, '')

                if( isNaN(parseFloat(amount))) {
                    console.log(`bad amount - skipped:${line}`)
                    continue;
                }

                if( isNaN(Date.parse(transactionDate))) {
                    console.log(`bad date - skipped:${line}`)
                    continue;
                }

                let transaction = {
                    accountNameOwner: accountNameOwner,
                    transactionDate: Date.parse(transactionDate).toISOString().split("T")[0] + "T12:00:00.000",
                    description: description,
                    amount: parseFloat(amount),
                    guid: uuidv4(),
                    category: "none",
                    notes: "",
                    transactionState: "outstanding",
                    activeStatus: true,
                    accountType: "credit",
                    reoccurring: false,
                    reoccurringType:  "undefined",
                }
                console.log(transaction)
                await postCall(transaction)
                console.log(`processed:${line}`)

            } else {
                console.log(`column count off - skipped:${line}`)
            }

        }
        setMessage('all records are submitted.')
        setOpen(true)
    }

    return (
        <div className="freeform">

            <div>
                <textarea name="comment" form="transactions" id="textArea" rows="20" cols="180" defaultValue=""/>
                <input type="submit" onClick={() => handleChange()}/>
            </div>

            <Snackbar
                message={message}
                open={open}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                autoHideDuration={4500}
                onClose={() => {
                    console.log('from onClose close me:' + open)
                    setOpen(false)
                    console.log('from onClose close me:' + open)
                }}
            />
        </div>
    );
}