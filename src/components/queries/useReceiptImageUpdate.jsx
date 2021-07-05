import axios from "axios";
import {endpointUrl} from "../Common";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";

const insertReceiptImage = (currentTransaction, fileContent) => {
    let endpoint = endpointUrl() + "/transaction/update/receipt/image/" + currentTransaction.guid

    return axios.put(endpoint, fileContent, {
            timeout: 0,
            headers: {"Content-Type": "text/plain"},
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

export default function useReceiptImageUpdate () {
    const queryClient = useQueryClient()

    return useMutation(['insertReceiptImage'], (variables) => insertReceiptImage(variables.oldRow, variables.fileContent), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData(getAccountKey(variables.oldRow.accountNameOwner))

            const dataUpdate = [...oldData]
            const index = variables.oldRow.tableData.id
            dataUpdate[index] = variables.oldRow
            dataUpdate[index].receiptImage = variables.fileContent
            let newData = [...dataUpdate]

            queryClient.setQueryData(getAccountKey(variables.oldRow.accountNameOwner), newData)
        }})
}
