import React, {useCallback, useEffect, useState} from "react"
import MaterialTable from "material-table"
import Spinner from "./Spinner"
import "./main.scss"
import {useRouteMatch} from "react-router-dom"
import SelectTransactionState from "./SelectTransactionState"
import TransactionMove from "./TransactionMove"
import {currencyFormat, noNaN, typeOf} from "./Common"
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
import useFetchTotalsPerAccount from "./queries/useFetchTotalsPerAccount";
import useReceiptImageUpdate from "./queries/useReceiptImageUpdate";
import {TablePagination} from "@material-ui/core";

export default function TransactionTable() {
    const [loadMoveDialog, setLoadMoveDialog] = useState(false)
    const [currentTransaction, setCurrentTransaction] = useState({})
    const [keyPressed, setKeyPressed] = useState(false)
    const [fileContent, setFileContent] = useState("")
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const routeMatch :any = useRouteMatch("/transactions/:account")
    const {data, isSuccess, isLoading} = useFetchTransactionByAccount(routeMatch.params["account"])
    const {data: totals, isSuccess: isSuccessTotals} = useFetchTotalsPerAccount(routeMatch.params["account"])
    const {mutate: updateTransactionState} = useChangeTransactionState(routeMatch.params["account"])
    const {mutate: updateTransaction} = useTransactionUpdate()
    const {mutate: deleteTransaction} = useTransactionDelete()
    const {mutate: insertReceiptImage} = useReceiptImageUpdate()
    const {mutate: insertTransaction} = useTransactionInsert(routeMatch.params["account"])

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const handleError = (error: any, moduleName: any, throwIt:any ) => {
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

    const storeTheFileContent = useCallback(
        async (file) => {
            let reader :any = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                setFileContent(reader.result.toString())
                return reader.result
            }
            reader.onerror = (error: any) => {
                handleError(error, 'storeTheFile', false)
            }
        },
        []
    )

    const getImageFileContents = useCallback(
        async (currentRow) => {
            console.log("onClick photo-add")

            const fileSelector = document.createElement("input")
            fileSelector.setAttribute("type", "file")
            fileSelector.addEventListener("change", (event:any) => {
                console.log('addEventListener is called.')
                //let file1 : any = event.target.files[0]
                let fileList = event.target.files

                if (fileList[0].size >= 1024 * 1024) {
                    console.log("maximum file size is 1MB")
                    return
                }

                if (fileList[0].type.match('image/jpeg') || fileList[0].type.match('image/png')) {
                    if (fileList[0] instanceof Blob) {
                        // @ts-ignore
                        console.log(`file ${fileList[0].name} is file type ${fileList[0].type}.`)
                        // image/jpeg
                        // image/png
                        // image/gif
                        // image/webp
                        setCurrentTransaction(currentRow)
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

    // const fetchTotals = useCallback(async () => {
    //     const CancelToken = axios.CancelToken
    //     const source = CancelToken.source()
    //     const response = await axios.get(
    //         endpointUrl() + "/transaction/account/totals/" + routeMatch.params["account"],
    //         {cancelToken: source.token}
    //     )
    //     setTotals(response.data)
    // }, [routeMatch])

    const handlerToUpdateTransactionState = useCallback(
        async (guid, accountNameOwner, transactionState) => {
            try {
                await updateTransactionState({ guid: guid, transactionState: transactionState })
                //await fetchTotals()
            } catch (error) {
                console.log(error)
                handleError(error, 'updateTransactionState1', false)
            }
        },
        [updateTransactionState]
    )

    const updateRow = (newData :any, oldData: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await updateTransaction({newRow: newData, oldRow: oldData})
                    // @ts-ignore
                    resolve()
                } catch (error) {
                    handleError(error, 'updateRow', false)
                    reject()
                }
            }, 1000)
        })
    }

    const deleteRow = (oldData: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await deleteTransaction({oldRow: oldData})
                    // @ts-ignore
                    resolve()
                } catch (error) {
                    handleError(error, 'deleteRow', false)
                    reject()
                }
            }, 1000)
        })
    }

    const addRow = (newData: any) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await insertTransaction({newRow: newData, isFutureTransaction: false})
                    // @ts-ignore
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
            } catch (error) {
                handleError(error, 'futureTransactionInsertPostCall', false);
            }
        }, [insertTransaction]
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
            // @ts-ignore
            console.log(`current transactionId = ${currentTransaction.guid}`)
            //const response = insertReceiptImage()
            insertReceiptImage({oldRow: currentTransaction, fileContent: fileContent})

            // @ts-ignore
            let foundObject = data.filter((obj:any) => obj.guid === currentTransaction.guid)
            if (foundObject.length === 1) {
                foundObject[0].receiptImage = {"image": fileContent}
            }
            console.log(`objects found: ${foundObject.length}`)

            setFileContent("")
        }

        return () => {
            window.removeEventListener("keydown", downHandler)
            window.removeEventListener("keyup", upHandler)
        }
    }, [ data, downHandler, upHandler, fileContent, currentTransaction, insertReceiptImage])


    //// "2014-09-08T08:02:17-05:00"
    let dateFormat = 'YYYY-MM-DD'
    //let dateFormat = 'YYYY-MM-DDTHH:mm:ssZ'

    // @ts-ignore
    // @ts-ignore
    return (
        <div>
            {!isLoading && isSuccess && isSuccessTotals ? (
                <div className="table-formatting">
                    <MaterialTable
                        columns={[
                            {
                                title: "date",
                                field: "transactionDate",
                                sorting: true,
                                type: "date",
                                //initialEditValue: moment(new Date().toDateString()).format(dateFormat),
                                initialEditValue: moment().format(dateFormat),
                                cellStyle: {whiteSpace: "nowrap"},
                                editComponent: (props) => (
                                    <div>
                                        <MuiPickersUtilsProvider
                                            utils={MomentUtils}
                                            //locale={props.dateTimePickerLocalization}
                                        >
                                            <DatePicker
                                                //format="yyyy-MM-dd"
                                                value={props.value
                                                    ? moment(props.value).format(dateFormat) : moment().format(dateFormat)}
                                                onChange={props.onChange}
                                                //clearable
                                                readOnly={false}
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
                                                    return (props.value) ? props.value : 'undefined'
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
                                                    return (props.value) ? props.value : 'none'
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
                                                    return (props.value) ? props.value : 'outstanding'
                                                }}
                                            />
                                        </>
                                    )
                                },
                            },
                            {
                                title: "reoccur",
                                field: "reoccurringType",
                                //TODO: Look into these options
                                //defaultSort: "asc",
                                //customSort: (a, b): number => a.remaining - b.remaining,
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
                                                <Button style={{width: 50}} onClick={() => handleButtonClickLink(rowData)}>
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

                                    <MuiPickersUtilsProvider
                                        utils={MomentUtils}
                                    >
                                        <DatePicker
                                            value={props.value ? moment(props.value).format(dateFormat) : ""}
                                            onChange={props.onChange}
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

                        components={{
                            Pagination: (props) => {
                                return (
                                    <td className="right">
                                    <TablePagination
                                    component="div"
                                    count={props.count}
                                    page={props.page}
                                    rowsPerPage={props.rowsPerPage}
                                    rowsPerPageOptions={[25, 50, 75, 100]}
                                    onChangeRowsPerPage={props.onChangeRowsPerPage}
                                    onChangePage={props.onChangePage}
                                    onPageChange={props.onChangePage}
                                />
                                    </td>
                                )
                            }
                        }}

                        options={{
                            filtering: true,
                            // selection: true,
                            paging: true,
                            pageSize: 25,
                            pageSizeOptions : [25, 50, 75, 100],
                            addRowPosition: "first",
                            search: true,
                            toolbar: true,
                            paginationPosition: "both",
                            emptyRowsWhenPaging: false,
                            headerStyle: {
                                backgroundColor: "#9965f4",
                                color: "#FFF",
                            },

                            rowStyle: (rowData ) :any => {
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
                                    setCurrentTransaction(rowData)
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
                    {/*</Paper>*/}
                    {loadMoveDialog ? (
                        <TransactionMove
                            closeDialog={() => {
                                setLoadMoveDialog(false)
                                //console.log('delete guid:' + currentTransaction)
                                //const newData = data.filter((obj) => obj.guid !== currentTransaction)
                                //setData(newData)
                            }}
                            currentTransaction={currentTransaction}
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