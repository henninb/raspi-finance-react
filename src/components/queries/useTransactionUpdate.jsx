import axios from "axios";
import {endpointUrl} from "../Common";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";

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
            } else {
                const dataDelete = [...oldData]
                const index = variables.oldRow.tableData.id
                dataDelete.splice(index, 1)
                newData = [...dataDelete]
                //TODO: add to other accountNameOwner list
            }

            queryClient.setQueryData(getAccountKey(variables.oldRow.accountNameOwner), newData)
        }})
}
