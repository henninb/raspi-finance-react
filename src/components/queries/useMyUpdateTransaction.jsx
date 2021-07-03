import axios from "axios";
import {endpointUrl} from "../Common";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";

const updateTransaction = (newData, oldData) => {
    console.log("updateTransaction called.")
    let endpoint = endpointUrl() + "/transaction/update/" + oldData.guid
    delete newData["tableData"]

    if (newData.receiptImage !== undefined) {
        newData['receiptImage'].image = newData['receiptImage'].image.replace(/^data:image\/[a-z]+;base64,/, "")
    }
    console.log("newData:" + newData)

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

export default (accountNameOwner) => {
    const queryClient = useQueryClient()
    queryClient.getQueryData(getAccountKey(accountNameOwner))

    return useMutation(['updateTransaction'], (variables) => updateTransaction(variables.newRow, variables.oldRow), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData(getAccountKey(accountNameOwner))
            const dataUpdate = [...oldData]
            const index = variables.oldRow.tableData.id
            dataUpdate[index] = variables.newRow
            let newData = [...dataUpdate]

            queryClient.setQueryData(getAccountKey(accountNameOwner), newData)
        }})
}
