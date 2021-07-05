import axios from "axios";
import {capitalizeFirstChar, endpointUrl, noNaN} from "../Common";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey, getTotalsKey} from "./KeyFile";

const updateTransaction = (newData, oldData) => {
    let endpoint = endpointUrl() + "/transaction/update/" + oldData.guid
    delete newData["tableData"]

    if (newData.receiptImage !== undefined) {
        newData['receiptImage'].image = newData['receiptImage'].image.replace(/^data:image\/[a-z]+;base64,/, "")
    }
    console.log("newData:" + JSON.stringify(newData))

    return axios.put(endpoint, JSON.stringify(newData), {
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    }).then(response => response.data)
}

const catchError = (error) => {
    console.log(error.response)
    console.log(JSON.stringify(error.response))
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useTransactionUpdate () {
    const queryClient = useQueryClient()

    return useMutation(['updateTransaction'], (variables) => updateTransaction(variables.newRow, variables.oldRow), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData(getAccountKey(variables.oldRow.accountNameOwner))
            let newData
            if( variables.oldRow.accountNameOwner === variables.newRow.accountNameOwner ) {
                const dataUpdate = [...oldData]
                const index = variables.oldRow.tableData.id
                dataUpdate[index] = variables.newRow
                newData = [...dataUpdate]
                //TODO: update accountTotals if amounts are different
                if( variables.oldRow.amount !== variables.newRow.amount ) {
                    let totals = queryClient.getQueryData(getTotalsKey(variables.newRow.accountNameOwner))
                    let oldTransactionStateKey = "totals" + capitalizeFirstChar(variables.oldRow.transactionState)
                    let newTransactionStateKey = "totals" + capitalizeFirstChar(variables.newRow.transactionState)
                    const difference = variables.newRow.amount - variables.oldRow.amount
                    totals.totals += difference
                    if( variables.newRow.transactionState === variables.oldRow.transactionState) {
                        totals[newTransactionStateKey] += difference
                        queryClient.setQueryData(getTotalsKey(variables.newRow.accountNameOwner), totals)
                    } else {
                        totals[oldTransactionStateKey] = (noNaN(totals[oldTransactionStateKey])) - (variables.oldRow.amount)
                        totals[newTransactionStateKey] = (noNaN(totals[newTransactionStateKey])) + (variables.oldRow.amount) + (difference)
                        console.log(JSON.stringify(totals))
                        queryClient.setQueryData(getTotalsKey(variables.newRow.accountNameOwner), totals)
                    }
                }
            } else {
                const dataDelete = [...oldData]
                const index = variables.oldRow.tableData.id
                dataDelete.splice(index, 1)
                newData = [...dataDelete]
                //TODO: add to other accountNameOwner list
                //TODO: update accountTotals (subtract)

            }

            queryClient.setQueryData(getAccountKey(variables.oldRow.accountNameOwner), newData)
        }})
}
