import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";


const deleteTransaction = (payload : any) => {
    let endpoint = endpointUrl() + "/transaction/delete/" + payload.guid

    return axios.delete(endpoint, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
    }).then(response => response.data)
}

const catchError = (error:any) => {
    console.log(error ? error: "error is undefined.")
    console.log(error.response ? error.response: "error.response is undefined.")
    console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
    //handleError(error, 'fetchAccountData', true)
}

export default function useTransactionDelete() {
    const queryClient = useQueryClient()

    return useMutation(['deleteTransaction'], (variables:any) => deleteTransaction(variables.oldRow), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData : any = queryClient.getQueryData(getAccountKey(variables.oldRow.accountNameOwner))
            const dataDelete = [...oldData]
            const index = variables.oldRow.tableData.id
            dataDelete.splice(index, 1)
            let newData = [...dataDelete]

            queryClient.setQueryData(getAccountKey(variables.oldRow.accountNameOwner), newData)
        }})
}