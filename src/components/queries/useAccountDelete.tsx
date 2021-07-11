import {endpointUrl} from "../Common";
import axios, {AxiosError} from "axios";
import {useMutation, useQueryClient} from "react-query";

const deleteAccount = async (payload: any): Promise<any> => {
    let endpoint = endpointUrl() + "/account/delete/" + payload.accountNameOwner

    const response = await axios.delete(endpoint, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
    });
    return response.data;
}

export default function useAccountDelete() {
    const queryClient = useQueryClient()

    return useMutation(['deleteAccount'], (variables: any) => deleteAccount(variables.oldRow), {
        onError: (error: AxiosError<any>) => {
            console.log(error ? error : "error is undefined.")
            console.log(error.response ? error.response : "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response) : "error.response is undefined - cannot stringify.")
        },

        onSuccess: (response, variables) => {
            let oldData: any = queryClient.getQueryData('account')
            const dataDelete = [...oldData]
            const index = variables.oldRow.tableData.id
            dataDelete.splice(index, 1)
            let newData = [...dataDelete]
            queryClient.setQueryData('account', newData)
        }
    })
}