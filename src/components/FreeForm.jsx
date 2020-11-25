import React, {useCallback} from 'react';
import {v4 as uuidv4} from "uuid"
import {endpointUrl} from "./Common";
import axios from "axios"
require('datejs')

export default function FreeForm() {


    const postCall = useCallback(
        async (payload) => {
            let endpoint = endpointUrl() + "/transaction/insert/"



            await axios.post(endpoint, payload, {
                timeout: 0,
                headers: {"Content-Type": "application/json"},
            })
            return payload
        },
        []
    )

    const handleChange = () => {
        let os = require('os');

        const text = document.getElementById("textArea").value;
        let sanitizedText = text.replace(/\t/g, ',')
        const lines = sanitizedText.split(os.EOL);

        lines.forEach(line => {
            const columns = line.split(',')
            if (columns.length === 4) {
                if( isNaN(parseFloat(columns[3]))) {
                    console.log('skipped:' + line)
                    return
                }

                if( isNaN(parseFloat(columns[1]))) {
                    console.log('skipped:' + line)
                    return
                }

                let transaction = {
                    accountNameOwner: columns[0],
                    transactionDate: Date.parse(columns[1]).toISOString().split("T")[0] + "T12:00:00.000",
                    description: columns[2],
                    amount: parseFloat(columns[3]),
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
                postCall(transaction)
                console.log('processed:' + line)
            } else {
                console.log('skipped:' + line)
            }
        })
    }

    return (
        <div className="freeform">

            <div>
                <textarea name="comment" form="transactions" id="textArea" rows="20" cols="180" defaultValue=""/>
                <input type="submit" onClick={() => handleChange()}/>
            </div>
        </div>

    );
}