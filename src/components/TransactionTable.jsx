import React, {useCallback, useEffect, useState} from "react"
import MaterialTable from "material-table"
import axios from "axios"
import {v4 as uuidv4} from "uuid"
import Spinner from "./Spinner"
import "./master.scss"
import {useRouteMatch} from "react-router-dom"
import SelectTransactionState from "./SelectTransactionState"
import TransactionMove from "./TransactionMove"
import {currencyFormat, endpointUrl, typeOf} from "./Common"
import Checkbox from "@material-ui/core/Checkbox"
import SelectCategory from "./SelectCategory"
import SelectDescription from "./SelectDescription"
import SnackbarBaseline from "./SnackbarBaseline";
//require('exif-stripper')

export default function TransactionTable() {
    const [loadSpinner, setLoadSpinner] = useState(true)
    const [loadMoveDialog, setLoadMoveDialog] = useState(false)
    const [currentGuid, setCurrentGuid] = useState("")
    const [totals, setTotals] = useState([])
    const [data, setData] = useState([])
    const [keyPressed, setKeyPressed] = useState(false)
    const [fileContent, setFileContent] = useState("")
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    let match = useRouteMatch("/transactions/:account")

    const handleSnackbarClose = () => {
        setOpen(false);
    };

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

    const insertReceiptImage = useCallback(
        async () => {
            const CancelToken = axios.CancelToken
            const source = CancelToken.source()
            const response = await axios.put(
                endpointUrl() + "/transaction/update/receipt/image/" + currentGuid,
                fileContent,
                {
                    cancelToken: source.token,
                    timeout: 0,
                    headers: {"Content-Type": "text/plain"},
                    //headers: {"Content-Type": "base64/QUOTED-PRINTABLE"}
                }
            )

            if (response.data !== "transaction receipt image updated") {
                console.log("changeReceiptImage - failure")
                console.log(response.data)
            } else {
                console.log("transaction receipt image updated")
            }

            return () => {
                source.cancel()
            }
        },
        [fileContent, currentGuid]
    )

    const storeTheFileContent = useCallback(
        async (file) => {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setFileContent(reader.result.toString())

                //data["receiptImage"] = 'blah'
                return reader.result
            }
            reader.onerror = (error) => {
                handleError(error, 'storeTheFile', false)
            }
        },
        []
    )

    const getImageFileContents = useCallback(
        async (guid) => {
            console.log("onClick photo-add")

            const fileSelector = document.createElement("input")
            fileSelector.setAttribute("type", "file")
            fileSelector.addEventListener("change", (event) => {
                console.log('addEventListener is called.')
                //let file1 : any = event.target.files[0]
                let fileList = event.target.files

                if (fileList[0].size >= 1024 * 1024) {
                    console.log("maximum file size is 1MB")
                    return
                }

                //if (fileList[0].type.match('image.*')) {
                if (fileList[0].type.match('image/jpeg')) {
                    if (fileList[0] instanceof Blob) {
                        console.log(`file ${fileList[0].name} is file type ${fileList[0].type}.`)
                        // image/jpeg
                        // image/png
                        // image/gif
                        // image/webp
                        setCurrentGuid(guid)
                        let response = storeTheFileContent(fileList[0])
                        console.log(response)

                    } else {
                        console.log(`file ${fileList[0].name} is not a blob.`)
                    }
                } else {
                    console.log(`file ${fileList[0].name} is not an image.`)

                }
            })
            fileSelector.click()
        },
        [storeTheFileContent]
    )

    const changeTransactionStateToCleared = useCallback(async (guid) => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()
        try {
            const response = await axios.put(
                endpointUrl() + "/transaction/state/update/" + guid + "/Cleared",
                {cancelToken: source.token}
            )

            if( response.data['transactions'] !== undefined && JSON.parse(response.data['transactions']) !== undefined ) {
                const transactions = JSON.parse(response.data['transactions'])
                if( transactions.length === 2 ) {
                    data.unshift(transactions[1])
                    setData(data)
                    // TODO: the code in comments below is not working
                    //setData(    [transactions[1], ...data])
                    setMessage(`inserted new record: ${JSON.stringify(transactions[1])}`)
                    setOpen(true)
                } else {
                    setMessage(`response: ${response.data.message}`)
                    setOpen(true)
                }
            } else {
                setMessage(`response from the server: ${response.data}`)
                setOpen(true)
            }
        } catch( error) {
            handleError(error, 'changeTransactionStateToCleared', true)
        }
        return () => {
            source.cancel()
        }
    }, [data])

    const fetchTotals = useCallback(async () => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()
        const response = await axios.get(
            endpointUrl() + "/transaction/account/totals/" + match.params["account"],
            {cancelToken: source.token}
        )
        setTotals(response.data)
        return () => {
            source.cancel()
        }
    }, [match])

    const handlerForUpdatingTransactionState = useCallback(
        async (guid) => {
            try {
                await changeTransactionStateToCleared(guid)
                let map = data.map((element) => {
                    if (element["guid"] === guid) {
                        fetchTotals()
                        // @ts-ignore
                        return {...element, transactionState: "cleared"}
                    } else {
                        return element
                    }
                })
                // @ts-ignore
                setData(map)
            } catch (error) {
                handleError(error, 'updateTransactionState', false)
            }
        },
        [data, changeTransactionStateToCleared, fetchTotals]
    )

    const changeTransactionReoccurringStatus = useCallback(
        async (guid, reoccurring) => {
            const CancelToken = axios.CancelToken
            const source = CancelToken.source()
            const response = await axios.put(
                endpointUrl() +
                "/transaction/reoccurring/update/" +
                guid +
                "/" +
                reoccurring,
                {cancelToken: source.token}
            )

            return () => {
                source.cancel()
            }
        },
        []
    )

    const toggleReoccurring = useCallback(
        async (guid, reoccurring) => {
            try {
                await changeTransactionReoccurringStatus(guid, !reoccurring)
                let map = data.map((elem) => {
                    if (elem["guid"] === guid) {
                        // @ts-ignore
                        return {...elem, reoccurring: !elem.reoccurring}
                    } else {
                        return elem
                    }
                })
                // @ts-ignore
                setData(map)
            } catch (error) {
                handleError(error, 'toggleReoccurring', false)
            }
        },
        [data, changeTransactionReoccurringStatus]
    )

    const fetchAccountData = useCallback(async () => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()

        try {
            const response = await axios.get(
                endpointUrl() + "/transaction/account/select/" + match.params["account"],
                {
                    cancelToken: source.token,
                    timeout: 0,
                    headers: {
                        "Content-Type": "application/json",
                        //"Accept": "application/json; charset=utf-8"
                        "Accept": "application/json"
                    },
                }
            )

            setData(response.data)

        } catch (error) {
            handleError(error, 'fetchAccountData', true)
        } finally {
            setLoadSpinner(false)
        }
        return () => {
            source.cancel()
        }
    }, [match])

    const putCall = useCallback(async (newData, oldData) => {
        let endpoint = endpointUrl() + "/transaction/update/" + oldData.guid
        delete newData["tableData"]

        //TODO: do I need this?
        if (oldData.transactionState === undefined) {
            newData["transactionState"] = "undefined"
        }

        //newData["dateUpdated"] = toEpochDateAsMillis(new Date())
        //TODO: ought not use set the dateAdded()
        //newData["dateAdded"] = toEpochDateAsMillis(new Date())

        await axios.put(endpoint, JSON.stringify(newData), {
            timeout: 0,
            headers: {"Content-Type": "application/json"},
        })
    }, [])

    const updateRow = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const dataUpdate = [...data]
                const index = oldData.tableData.id
                dataUpdate[index] = newData
                try {
                    await putCall(newData, oldData)
                    await fetchTotals()
                    setData([...dataUpdate])
                    resolve()
                } catch (error) {
                    handleError(error, 'updateRow', false)
                    reject()
                }
            }, 1000)
        })
    }

    const deleteRow = (oldData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const dataDelete = [...data]
                const index = oldData.tableData.id
                dataDelete.splice(index, 1)
                try {
                    await deleteCall(oldData)
                    await fetchTotals()
                    setData([...dataDelete])
                    resolve()
                } catch (error) {
                    handleError(error, 'deleteRow', false)
                    reject()
                }
            }, 1000)
        })
    }

    const addRow = (newData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const newPayload = await postCall(newData)
                    setData([newPayload, ...data])
                    await fetchTotals()
                    resolve()
                } catch (error) {
                    handleError(error, 'addRow', false);
                    reject()
                }
            }, 1000)
        })
    }

    const deleteCall = useCallback(async (payload) => {
        let endpoint = endpointUrl() + "/transaction/delete/" + payload.guid

        let response = await axios.delete(endpoint, {
            timeout: 0,
            headers: {"Content-Type": "application/json"},
        })
        console.log(response.data)
    }, [])

    const postCall = useCallback(
        async (payload) => {
            let endpoint = endpointUrl() + "/transaction/insert/"

            //TODO: bh 8/28/2020 - need to address any date conversion issues
            //TODO: bh 10/31/2020 - set a timezone based on a parameter
            let buildTransactionDateString =
                payload.transactionDate.toISOString().split("T")[0] + "T12:00:00.000"
            let newPayload = {
                guid: uuidv4(),
                transactionDate: buildTransactionDateString,
                description: payload.description,
                category: payload.category === undefined ? "undefined" : payload.category,
                notes: payload.notes === undefined ? "" : payload.notes,
                amount: payload.amount,
                transactionState:
                    payload.transactionState === undefined
                        ? "outstanding"
                        : payload.transactionState,
                activeStatus: true,
                accountType: "undefined",
                reoccurring: payload.reoccurring === undefined ? false : payload.reoccurring,
                reoccurringType:
                    payload.reoccurringType === undefined
                        ? "undefined"
                        : payload.reoccurringType,
                accountNameOwner: match.params["account"],
            }

            await axios.post(endpoint, newPayload, {
                timeout: 0,
                headers: {"Content-Type": "application/json"},
            })
            return newPayload
        },
        [match.params]
    )

    // const unwrapImage = async (rowData) => {
    //     let response  = fetchImage(rowData['receiptImageId'])
    //     return await response.then(async (result) => {
    //             return result
    //         }
    //     )
    // }

    const downHandler = useCallback(
        ({key}) => {
            if (key === "Escape") {
                console.log(`escape key pressed: ${keyPressed}`)
                setKeyPressed(true)
            }

            // if (key === 'Enter') {
            //     alert('me - enter')
            //     // document.getElementById('Cancel').click()
            //     setKeyPressed(true)
            // }
        },
        [keyPressed]
    )

    const upHandler = useCallback(({key}) => {
        if (key === "Escape") {
            setKeyPressed(false)
        }
    }, [])

    useEffect(() => {
        window.addEventListener("keydown", downHandler)
        window.addEventListener("keyup", upHandler)

        if (data.length === 0) {
            let response = fetchAccountData()
            console.log(response)
        }

        if (fileContent !== "") {
            console.log(`current transactionId = ${currentGuid}`)
            const response = insertReceiptImage()
            console.log(response)

            let foundObject = data.filter((obj) => obj.guid === currentGuid)
            if (foundObject.length === 1) {
                foundObject[0].receiptImage = {"jpgImage": fileContent}
            }
            console.log(`objects found: ${foundObject.length}`)

            setFileContent("")
        }

        if (totals.length === 0) {
            let response = fetchTotals()
            console.log(response)
        }

        return () => {
            window.removeEventListener("keydown", downHandler)
            window.removeEventListener("keyup", upHandler)
        }
    }, [totals, data, fetchTotals, fetchAccountData, downHandler, upHandler, fileContent, currentGuid, insertReceiptImage])

    //SELECT octet_length(receipt_image) FROM t_transaction where receipt_image is not null;
    //select encode(receipt_image::bytea, 'hex') from t_transaction where guid='6c7fda78-5f87-4a67-8870-29b2fbf9ebee';

    return (
        <div>
            {!loadSpinner ? (
                <div className="table-formatting">

                    <MaterialTable
                        columns={[
                            {
                                title: "date",
                                field: "transactionDate",
                                type: "date",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "description",
                                field: "description",
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectDescription
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "undefined"
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "category",
                                field: "category",
                                cellStyle: {whiteSpace: "nowrap"},

                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectCategory
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "none"
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "amount",
                                field: "amount",
                                type: "currency",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "state",
                                field: "transactionState",
                                cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    if (rowData.transactionState === "cleared") {
                                        return <div>{rowData.transactionState}</div>
                                    } else {
                                        return (
                                            <div>
                                                <Checkbox
                                                    checked={false}
                                                    style={{color: "#9965f4"}}
                                                    onChange={() =>
                                                        handlerForUpdatingTransactionState(rowData.guid)
                                                    }
                                                />
                                                {rowData.transactionState}
                                            </div>
                                        )
                                    }
                                },
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectTransactionState
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "outstanding"
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "reoccur",
                                field: "reoccurring",
                                cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    return (
                                        <Checkbox
                                            checked={rowData.reoccurring}
                                            style={{color: "#9965f4"}}
                                            onChange={() =>
                                                toggleReoccurring(rowData.guid, rowData.reoccurring)
                                            }
                                        />
                                    )
                                },
                                editComponent: (props) => {
                                    return (
                                        <Checkbox
                                            checked={props.rowData.reoccurring}
                                            style={{color: "#9965f4"}}
                                            onChange={(e) => {
                                                props.onChange(e.target.checked)
                                                props.rowData.reoccurring = e.target.checked
                                                console.log("state:", e.target.checked)
                                            }}
                                        />
                                    )
                                },
                            },
                            {
                                title: "notes",
                                field: "notes",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "receipt",
                                field: "receiptImage",
                                editable: "never",
                                filtering: false,
                                cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    //let receiptImage = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
                                    let receiptImage = ""
                                    //let receiptImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMYfj/HwAEVwJUeAAUQgAAAABJRU5ErkJggg=="
                                    if (rowData['receiptImage'] !== undefined ) {
                                        receiptImage = rowData.receiptImage.jpgImage
                                        //data.receiptImage.jpgImage =
                                        console.log('typeOf receiptImage=' + typeOf(receiptImage))
                                        console.log('receiptImageValue=' + receiptImage)
                                    }
                                    //
                                    //<a href={receiptImage} title="click here to see the full sized image"><img src={receiptImage} alt="your alt description here" /></a>

                                    return (
                                        <div>
                                            {rowData['receiptImage'] !== undefined ?
                                                <img className="receipt-image" alt="receipt"
                                                     src={receiptImage}/> : null}
                                        </div>
                                    )
                                }
                                ,
                            },
                        ]}
                        data={data}
                        title={`[${match.params["account"]}] [ $${currencyFormat(
                            totals["totalsCleared"]
                        )} ], [ $${currencyFormat(totals["totals"])} ]`}
                        options={{
                            filtering: true,
                            // selection: true,
                            paging: true,
                            pageSize: 20,
                            addRowPosition: "first",
                            search: true,
                            paginationPosition: "both",
                            headerStyle: {
                                backgroundColor: "#9965f4",
                                color: "#FFF",
                            },
                            rowStyle: (rowData) => {
                                if (rowData.transactionState === "cleared") {
                                    return {fontSize: ".6rem"}
                                } else if (rowData.transactionState === "future") {
                                    return {
                                        fontSize: ".6rem",
                                        fontWeight: "bold",
                                        backgroundColor: "#5800f9",
                                        color: "#FFF",
                                    }
                                } else {
                                    return {
                                        fontSize: ".6rem",
                                        fontWeight: "bold",
                                        backgroundColor: "#4000f1",
                                        color: "#FFF",
                                    }
                                }
                            },
                        }}
                        editable={{
                            onRowAdd: addRow,
                            onRowUpdate: updateRow,
                            onRowDelete: deleteRow,
                        }}
                        actions={[
                            {
                                icon: "send",
                                tooltip: "Move",
                                onClick: (_event, rowData) => {
                                    setCurrentGuid(rowData.guid)
                                    setLoadMoveDialog(true)
                                },
                            },
                            {
                                icon: "add_a_photo",
                                tooltip: "Photo-Add",
                                onClick: (_event, rowData) => {
                                    console.log('Photo-Add clicked.')

                                    let response = getImageFileContents(rowData.guid)
                                    console.log(response)
                                },
                            },
                        ]}
                    />
                    {loadMoveDialog ? (
                        <TransactionMove
                            closeDialog={() => {
                                setLoadMoveDialog(false)
                                console.log('delete guid:' + currentGuid)
                                const newData = data.filter((obj) => obj.guid !== currentGuid)
                                setData(newData)
                            }}
                            transactionGuid={currentGuid}
                        />
                    ) : null}
                    <div>
                        <SnackbarBaseline message={message} state={open} handleSnackbarClose={handleSnackbarClose}/>
                    </div>
                </div>
            ) : (
                <div className="centered">
                    <Spinner/>
                </div>
            )}
        </div>
    )
}
