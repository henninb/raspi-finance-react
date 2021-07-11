import {endpointUrl} from "../Common";
import axios, {AxiosError} from "axios";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";
import Transaction from "../model/Transaction";


const deleteTransaction = async (payload: Transaction): Promise<any> => {
    let endpoint = endpointUrl() + "/transaction/delete/" + payload.guid

    const response = await axios.delete(endpoint, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
    });
    return response.data;
}

export default function useTransactionDelete() {
    const queryClient = useQueryClient()

    return useMutation(['deleteTransaction'], (variables: any) => deleteTransaction(variables.oldRow), {
        onError: (error: AxiosError<any>) => {
            console.log(error ? error : "error is undefined.")
            console.log(error.response ? error.response : "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response) : "error.response is undefined - cannot stringify.")
        },

        onSuccess: (response, variables) => {
            let oldData: any = queryClient.getQueryData(getAccountKey(variables.oldRow.accountNameOwner))
            const dataDelete = [...oldData]
            const index = variables.oldRow.tableData.id
            dataDelete.splice(index, 1)
            let newData = [...dataDelete]

            queryClient.setQueryData(getAccountKey(variables.oldRow.accountNameOwner), newData)
        }
    })
}