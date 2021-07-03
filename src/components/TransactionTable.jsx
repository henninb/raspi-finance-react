import React, {useCallback, useEffect, useState} from "react"
import MaterialTable from "material-table"
import axios from "axios"
import Spinner from "./Spinner"
import "./main.scss"
import {useRouteMatch} from "react-router-dom"
import SelectTransactionState from "./SelectTransactionState"
import TransactionMove from "./TransactionMove"
import {currencyFormat, endpointUrl, fetchTimeZone, noNaN, typeOf} from "./Common"
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded'
import SelectCategory from "./SelectCategory"
import SelectDescription from "./SelectDescription"
import SnackbarBaseline from "./SnackbarBaseline"
import ToggleButtons from "./ToggleButtons"
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import DatePicker from "react-datepicker"
import moment from "moment"
import SelectReoccurringType from "./SelectReoccurringType"
import Button from "@material-ui/core/Button"
import useFetchTransactionByAccount from "./queries/useFetchTransactionByAccount";
import useChangeTransactionState from "./queries/useTransactionStateUpdate";
import useTransactionUpdate from "./queries/useTransactionUpdate";
import useTransactionDelete from "./queries/useTransactionDelete";
import useTransactionInsert from "./queries/useTransactionInsert";

export default function TransactionTable() {
    const [loadMoveDialog, setLoadMoveDialog] = useState(false)
    const [currentGuid, setCurrentGuid] = useState("")
    const [totals, setTotals] = useState([])
    const [keyPressed, setKeyPressed] = useState(false)
    const [fileContent, setFileContent] = useState("")
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    let routeMatch = useRouteMatch("/transactions/:account")
    const {data, isSuccess, isLoading} = useFetchTransactionByAccount(routeMatch.params["account"])
    const {mutate: updateTransactionState} = useChangeTransactionState(routeMatch.params["account"])
    const {mutate: updateTransaction} = useTransactionUpdate(routeMatch.params["account"])
    const {mutate: deleteTransaction} = useTransactionDelete(routeMatch.params["account"])
    const {mutate: insertTransaction} = useTransactionInsert(routeMatch.params["account"])

    const handleSnackbarClose = () => {
        setOpen(false);
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
                }
            )

            console.log(response.data)

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

                if (fileList[0].type.match('image/jpeg') || fileList[0].type.match('image/png')) {
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

    const fetchTotals = useCallback(async () => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()
        const response = await axios.get(
            endpointUrl() + "/transaction/account/totals/" + routeMatch.params["account"],
            {cancelToken: source.token}
        )
        setTotals(response.data)
        return () => {
            source.cancel()
        }
    }, [routeMatch])

    const handlerToUpdateTransactionState = useCallback(
        async (guid, accountNameOwner, transactionState) => {
            try {
                await updateTransactionState({ guid: guid, transactionState: transactionState })
                fetchTotals()
            } catch (error) {
                console.log(error)
                handleError(error, 'updateTransactionState1', false)
            }
        },
        [updateTransactionState, fetchTotals]
    )

    const updateRow = (newData, oldData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await updateTransaction({newRow: newData, oldRow: oldData})
                    await fetchTotals()
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
                try {
                    deleteTransaction({oldRow: oldData})
                    await fetchTotals()
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
                    await insertTransaction({newRow: newData, isFutureTransaction: false})
                    await fetchTotals()
                    resolve()
                } catch (error) {
                    handleError(error, 'addRow', false);
                    reject()
                }
            }, 1000)
        })
    }

    const handleButtonClickLink = useCallback(
        async (newData) => {
            try {
                await insertTransaction({newRow: newData, isFutureTransaction: true})
                await fetchTotals()
            } catch (error) {
                handleError(error, 'futureTransactionInsertPostCall', false);
            }
        }, [insertTransaction, fetchTotals]
    )

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

        if (fileContent !== "") {
            console.log(`current transactionId = ${currentGuid}`)
            const response = insertReceiptImage()
            console.log(response)

            let foundObject = data.filter((obj) => obj.guid === currentGuid)
            if (foundObject.length === 1) {
                foundObject[0].receiptImage = {"image": fileContent}
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
    }, [totals, data, fetchTotals, downHandler, upHandler, fileContent, currentGuid, insertReceiptImage])

    let today = moment(new Date().toDateString()).format('YYYY-MM-DD')

    return (
        <div>
            {!isLoading && isSuccess ? (
                <div className="table-formatting">

                    <MaterialTable
                        columns={[
                            {
                                title: "date",
                                field: "transactionDate",
                                type: "date",
                                initialEditValue: today,
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => (

                                    <div>
                                        <MuiPickersUtilsProvider utils={MomentUtils}
                                                                 locale={props.dateTimePickerLocalization}>
                                            <DatePicker
                                                placeholderText='yyyy-MM-dd'
                                                format="yyyy-MM-dd"
                                                selected={moment(props.value).tz(fetchTimeZone()).toDate()}
                                                value={props.value
                                                    ? moment(props.value).format('YYYY-MM-DD') : moment(new Date().toDateString()).format('YYYY-MM-DD')}
                                                onChange={props.onChange}
                                                clearable
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                ),
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
                                    return (
                                        <>
                                            <ToggleButtons
                                                transactionState={rowData.transactionState}
                                                guid={rowData.guid}
                                                accountNameOwner={rowData.accountNameOwner}
                                                handlerToUpdateTransactionState={handlerToUpdateTransactionState}
                                            />
                                        </>
                                    )
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
                                field: "reoccurringType",
                                cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    if (rowData.reoccurringType === 'onetime' || rowData.reoccurringType === 'undefined') {
                                        return (
                                            <>
                                                {rowData.reoccurringType}
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                {rowData.reoccurringType}
                                                <Button
                                                    styles={{width: 50}}
                                                    onClick={() =>
                                                        handleButtonClickLink(rowData)
                                                    }
                                                >
                                                    <ChevronRightRoundedIcon/>
                                                </Button>
                                            </>
                                        )
                                    }
                                },
                                editComponent: (props) => {
                                    return (
                                        <>
                                            <SelectReoccurringType
                                                newAccountType={props.rowData.accountType}
                                                onChangeFunction={props.onChange}
                                                currentValue={() => {
                                                    if (props.value) {
                                                        return props.value
                                                    } else {
                                                        return "onetime"
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "notes",
                                field: "notes",
                                cellStyle: {whiteSpace: "nowrap"},
                            },
                            {
                                title: "due",
                                field: "dueDate",
                                type: "date",
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => (

                                    <MuiPickersUtilsProvider utils={MomentUtils}
                                                             locale={props.dateTimePickerLocalization}>
                                        <DatePicker
                                            placeholderText='yyyy-MM-dd'
                                            format="yyyy-MM-dd"
                                            selected={moment(props.value).tz(fetchTimeZone()).toDate()}
                                            value={props.value ? moment(props.value).format('YYYY-MM-DD') : ""}
                                            onChange={props.onChange}
                                            clearable
                                        />
                                    </MuiPickersUtilsProvider>
                                )
                            },
                            {
                                title: "image",
                                field: "receiptImage",
                                editable: "never",
                                filtering: false,
                                cellStyle: {whiteSpace: "nowrap"},
                                render: (rowData) => {
                                    let image = ""
                                    if (rowData['receiptImage'] !== undefined) {
                                        if (rowData['receiptImage'].thumbnail === undefined) {
                                            rowData['receiptImage'].thumbnail = rowData['receiptImage'].image
                                        }

                                        if (rowData.receiptImage.image.startsWith("data")) {
                                            image = rowData.receiptImage.thumbnail
                                        } else {
                                            const formatType = rowData.receiptImage.imageFormatType
                                            console.log('formatType=' + formatType)
                                            image = 'data:image/' + formatType + ';base64,' + rowData.receiptImage.thumbnail
                                        }
                                        console.log('typeOf image=' + typeOf(image))
                                    } else {
                                        // setMessage(`issue loading the image`)
                                        // console.log(`issue loading the image`)
                                        // setOpen(true)
                                    }

                                    return (
                                        <div>
                                            {rowData['receiptImage'] !== undefined ?
                                                <img className="receipt-image" alt="receipt"
                                                     src={image}/> : null}
                                        </div>
                                    )
                                }
                                ,
                            },
                        ]}
                        data={data}
                        title={`[${routeMatch.params["account"]}] [ $${currencyFormat(noNaN(totals["totals"]))} ] [ $${currencyFormat(noNaN(totals["totalsCleared"]))} ]  [ $${currencyFormat(noNaN(totals["totalsOutstanding"]))} ] [ $${currencyFormat(noNaN(totals["totalsFuture"]))} ]`}
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
                                if (rowData.transactionState !== null) {
                                    if (rowData.transactionState === "cleared") {
                                        return {fontSize: ".6rem"}
                                    } else if (rowData.transactionState === "future") {
                                        return {
                                            fontSize: ".6rem",
                                            fontWeight: "bold",
                                            backgroundColor: "#5800f9",
                                            color: "#FFF",
                                        }
                                    } else if (rowData.transactionState === "outstanding") {
                                        return {
                                            fontSize: ".6rem",
                                            fontWeight: "bold",
                                            backgroundColor: "#4000f1",
                                            color: "#FFF",
                                        }
                                    } else {
                                        return {
                                            fontSize: ".6rem",
                                            fontWeight: "bold",
                                            backgroundColor: "#000000",
                                            color: "#FFF",
                                        }
                                    }
                                } else {
                                    console.log("rowData.transactionState is a null value.")
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
                                //const newData = data.filter((obj) => obj.guid !== currentGuid)
                                //setData(newData)
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
