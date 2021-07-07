import React, {useEffect, useState} from 'react'
import {v4 as uuidv4} from "uuid"
import os from "os"
import "./main.scss"
import SnackbarBaseline from "./SnackbarBaseline"
import Select from "react-select";
import FreeFormTable from "./FreeFormTable";
import useFetchAccount from "./queries/useFetchAccount";
import moment from "moment";

require('datejs') //momentjs - look into this

export default function FreeForm() {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [accountTypeOptions, setAccountTypeOptions] = useState([])
    const [selectedOption, setSelectedOption] = useState('')
    const [loadFreeFormTable, setLoadFreeFormTable] = useState(false)
    const [data, setData] = useState([])

    const {data: dataAccount, isSuccess: accountSuccess} = useFetchAccount()

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const toggleDisplayList = () => {
        setLoadFreeFormTable(!loadFreeFormTable)
    }

    const transformText = (text: any) => {
        const year = new Date().getFullYear().toString()
        text = text.replace(/[^\S\r\n]+$/gm, "")
        text = text.replace(/\nHOUSEHOLD/g, "\n")
        text = text.replace(/\nHousehold/g, "\n")
        text = text.replace(/SQ \*/g, "\n")
        text = text.replace(/MCDONALD'S/g, "McDonalds")
        text = text.replace(/MIKE'S DISCOUNT FOODS/g, "Mikes Discount Foods")
        text = text.replace(/LADYBUG'S BLING/g, "Ladybugs Bling")
        text = text.replace(/\nFood & drink\s+\$/g, ",")
        text = text.replace(/\nBills & utilities\s+\$/g, ",")
        text = text.replace(/\nShopping\s+\$/g, ",")
        text = text.replace(/\nGroceries\s+\$/g, ",")
        text = text.replace(/\nHome\s+\$/g, ",")
        text = text.replace(/\s+Pay with My Chase Plan./g, "")
        text = text.replace(/\nTravel\s+\$/g, ",")
        text = text.replace(/\nAutomotive\s+\$/g, ",")
        text = text.replace(/\nGifts & donations\s+\$/g, ",")
        text = text.replace(/\nGas\s+\$/g, ",")
        text = text.replace(/\nEntertainment\s+\$/g, ",")
        text = text.replace(/\nHealth & wellness\s+\$/g, ",")
        text = text.replace(/\nPersonal\s+\$/g, ",")
        text = text.replace(/CENTRAL CHECKOUT/g, "TARGET - ")
        text = text.replace(/ 800-591-3869\n\$/g, ",")
        text = text.replace(/\nTARGET.COM,/g, ",TARGET.COM,")
        text = text.replace(/[0-9]+:[0-9][0-9] [AP]M/g, "")
        text = text.replace(/\nTARGET 3991\n\$/g, "TARGET.COM,")
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

    const handlePaste = (e: any) => {
        let text = e.clipboardData.getData('Text')
        e.preventDefault();
        // @ts-ignore
        document.getElementById("textArea").value = transformText(text).trim()
    }

    const handlePrefix = () => {
        // @ts-ignore
        let text = document.getElementById("textArea").value.trim()
        let prefixedText = ""

        const prefix = selectedOption

        if (prefix === '') {
            setMessage('fix empty prefix')
            setOpen(true)
            return
        }

        text.split(/\r?\n/).forEach((str: any) => {
            prefixedText += prefix + "," + str.trim() + "\n"
        })

        // @ts-ignore
        document.getElementById("textArea").value = prefixedText.trim()
        setMessage(`prefixed added:  ${prefixedText.trim()}`)
        setOpen(true)
    }

    const validateData = () => {
        // @ts-ignore
        let text = document.getElementById("textArea").value.trim()
        let flag = true
        text.split(/\r?\n/).forEach((str: any) => {
            if (str.split(',').length !== 4) {
                setMessage("invalid record count= " + str.split(',').length + " ='" + str + "'")
                setOpen(true)
                flag = false
            }
        })
        return flag
    }

    const handleChange = async () => {
        // @ts-ignore
        const text = document.getElementById("textArea").value;
        let sanitizedText = text.replace(/\t/g, ',')
        sanitizedText = sanitizedText.toLowerCase()
        const lines = sanitizedText.split(os.EOL)
        let transactions :any = []

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

                // @ts-ignore
                if (isNaN(Date.parse(transactionDate))) {
                    console.log(`bad date - skipped:${line}`)
                    continue;
                }

                let dateFormat = 'YYYY-MM-DD'

                let transaction = {
                    accountNameOwner: accountNameOwner,
                    //transactionDate: Date.parse(transactionDate).toISOString(),
                    transactionDate: moment(transactionDate).format(dateFormat),
                    description: description,
                    amount: parseFloat(amount),
                    guid: uuidv4(),
                    category: "none",
                    notes: "",
                    transactionState: "outstanding",
                    activeStatus: true,
                    accountType: "credit",
                    reoccurringType: "onetime",
                }
                transactions.push(transaction)
            } else {
                console.log(`column count off - skipped:${line}`)
            }
        }
        setData(transactions)
        setLoadFreeFormTable(true)
    }

    const onSelectChange = ({value} : any) => {
        setSelectedOption(value)
    }

    useEffect(() => {
        if( accountSuccess  && accountTypeOptions.length === 0 ) {
            let optionList : any = []
            dataAccount.forEach((element: any) => {
                optionList = optionList.concat({
                    value: element.accountNameOwner,
                    label: element.accountNameOwner,
                })
            })
            if (optionList.length > 0) {
                setAccountTypeOptions(optionList)
            }
        }
    }, [accountSuccess, accountTypeOptions, dataAccount])

    return (
        <div>
            {!loadFreeFormTable ? (
        <div className="freeform">

            <div>
                {/*<textarea name="comment" form="transactions" id="textArea" rows="20" cols="180" defaultValue=""*/}
                <textarea name="comment" form="transactions" id="textArea" defaultValue=""
                          onPaste={(event) => handlePaste(event)}/>

                    <div style={{width: '300px'}}>
                        <Select
                            name="account-select"
                            multi={true}
                            native={true}
                            options={accountTypeOptions}
                            onChange={onSelectChange}
                        />
                    </div>
                    <div>
                    <input type="button" value="prefix" onClick={() => handlePrefix()}/>
                    <input type="submit" value="submit" onClick={() => handleChange()}/>
                    </div>
            </div>
            <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
        </div>) : (<div className="freeform">
                <FreeFormTable
                toggleDisplayList={toggleDisplayList}
                data={data}
                   />

             </div>) }
        </div>
    )
}
