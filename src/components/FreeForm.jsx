import React, {useCallback, useState} from 'react';
import {v4 as uuidv4} from "uuid"
import {endpointUrl} from "./Common";
import axios from "axios"
import os from "os";
import "./master.scss"
import SnackbarBaseline from "./SnackbarBaseline";

require('datejs') //momentjs - look into this

export default function FreeForm() {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const handleError = (error, moduleName, throwIt) =>  {
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
            } catch (error) {
                handleError(error, 'postCall', true)
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

                if (isNaN(parseFloat(amount))) {
                    console.log(`bad amount - skipped:${line}`)
                    continue;
                }

                if (isNaN(Date.parse(transactionDate))) {
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
                    reoccurringType: "undefined",
                }
                //console.log(transaction)
                try {
                    await postCall(transaction)
                } catch (error) {
                    handleError(error, 'handleChange', false)
                }
                //console.log(`processed:${line}`)

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

            <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
        </div>
    );
}