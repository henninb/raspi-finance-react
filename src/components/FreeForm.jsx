import React, {useCallback, useEffect, useState} from 'react'
import {v4 as uuidv4} from "uuid"
import {endpointUrl, formatDate} from "./Common"
import axios from "axios"
import os from "os"
import "./master.scss"
import SnackbarBaseline from "./SnackbarBaseline"
import Select from "react-select";

require('datejs') //momentjs - look into this

export default function FreeForm() {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [accountTypeOptions, setAccountTypeOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState('')

    const fetchAccountTypeOptions = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + "/account/select/active")

            let optionList = []
            response.data.forEach((element) => {
                optionList = optionList.concat({
                    value: element.accountNameOwner,
                    label: element.accountNameOwner,
                })
            })
            if (optionList.length > 0) {
                setAccountTypeOptions(optionList)
            }
        } catch (error) {
            if (error.response) {
                alert(
                    "fetchAccountTypeOptions - status: " +
                    error.response.status +
                    " - " +
                    JSON.stringify(error.response.data)
                )
            }
        }
    }, [])

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const transformText = (text) => {
        const year = new Date().getFullYear().toString()
        text = text.replace(/[^\S\r\n]+$/gm, "")
        text = text.replace(/\nHOUSEHOLD/g, "\n")
        text = text.replace(/\nHousehold/g, "\n")
        text = text.replace(/\nFood & drink\s+\$/g, ",")
        text = text.replace(/\nShopping\s+\$/g, ",")
        text = text.replace(/\nGroceries\s+\$/g, ",")
        text = text.replace(/\nPersonal\s+\$/g, ",")
        text = text.replace(/CENTRAL CHECKOUT/g, "TARGET - ")
        text = text.replace(/ 800-591-3869\n\$/g, ",")
        text = text.replace(/\nTARGET.COM,/g, ",TARGET.COM,")
        text = text.replaceAll(" 800-591-3869", "")
        text = text.replaceAll(" 00:00:00", "")
        text = text.replaceAll("See details about this transaction", "")
        text = text.replaceAll(" | ", ",")
        text = text.replaceAll(", " + year, " " + year)
        //text = text.replace(/\s+2020\s+/g, " " + year + ",")
        let re = new RegExp("\\s+" + year + "\\s+", "g")
        text = text.replace(re, " " + year + ",")
        text = text.replace(/[\r\n]{2,}/g, "\n")
        text = text.replaceAll(", ", ",")
        return text
    }

    const handlePaste = (e) => {
        let text = e.clipboardData.getData('Text')
        e.preventDefault();
        document.getElementById("textArea").value = transformText(text).trim()
    }

    const handleCleanUp = () => {
        let text = document.getElementById("textArea").value
        document.getElementById("textArea").value = transformText(text).trim()
        setMessage('data cleaned')
        setOpen(true)
    }

    const handlePrefix = () => {
        let text = document.getElementById("textArea").value.trim()
        let prefixedText = ""

        const prefix = selectedOption

        if (prefix === '') {
            setMessage('fix empty prefix')
            setOpen(true)
            return
        }

        text.split(/\r?\n/).forEach((str) => {
            prefixedText += prefix + "," + str.trim() + "\n"
        })
        document.getElementById("textArea").value = prefixedText.trim()
        setMessage(`prefixed added:  ${prefixedText.trim()}`)
        setOpen(true)
    }

    const validateData = () => {
        let text = document.getElementById("textArea").value.trim()
        let flag = true
        text.split(/\r?\n/).forEach((str) => {
            if (str.split(',').length !== 4) {
                setMessage("invalid record count= " + str.split(',').length + " ='" + str + "'")
                setOpen(true)
                flag = false
            }
        })
        return flag
    }

    const handleError = (error, moduleName, throwIt) => {
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
                handleError(error, 'postCall', false)
            }
        },
        []
    )

    const handleChange = async () => {
        const text = document.getElementById("textArea").value;
        let sanitizedText = text.replace(/\t/g, ',')
        sanitizedText = sanitizedText.toLowerCase()
        const lines = sanitizedText.split(os.EOL)

        if( !validateData() ) {
            return
        }

        for (const line of lines) {
            const columns = line.trim().split(',')
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
                    transactionDate: formatDate(transactionDate),
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
                try {
                    await postCall(transaction)
                } catch (error) {
                    handleError(error, 'handleChange', false)
                }

            } else {
                console.log(`column count off - skipped:${line}`)
            }
        }
    }

    const onSelectChange = ({value}) => {
        setSelectedOption(value)
    }

    useEffect(() => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

        if (accountTypeOptions.length === 0) {
            let response = fetchAccountTypeOptions()
            console.log(response)
        }

        return () => {
            source.cancel()
        }
    }, [accountTypeOptions, fetchAccountTypeOptions])


    return (
        <div className="freeform">

            <div>
                <textarea name="comment" form="transactions" id="textArea" rows="20" cols="180" defaultValue=""
                          onPaste={(event) => handlePaste(event)}/>
                <p>
                    <div style={{width: '300px'}}>
                        <Select
                            name="account-select"
                            multi={true}
                            native={true}
                            options={accountTypeOptions}
                            onChange={onSelectChange}
                        />
                    </div>
                </p>
                <p>
                    <input type="button" value="clean" onClick={() => handleCleanUp()}/>
                    <input type="button" value="prefix" onClick={() => handlePrefix()}/>
                    {/*<input type="button" value="validate" onClick={() => validateData()}/>*/}
                    <input type="submit" value="submit" onClick={() => handleChange()}/>
                </p>
            </div>

            <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
        </div>
    )
}