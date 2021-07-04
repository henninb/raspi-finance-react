import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";

const deleteAccount = (payload) => {
    let endpoint = endpointUrl() + "/account/delete/" + payload.accountNameOwner

    return axios.delete(endpoint, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
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

export default function useAccountDelete() {
    const queryClient = useQueryClient()
    //queryClient.getQueryData('account')

    return useMutation(['deleteAccount'], (variables) => deleteAccount(variables.oldRow), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData('account')
            const dataDelete = [...oldData]
            const index = variables.oldRow.tableData.id
            dataDelete.splice(index, 1)
            let newData = [...dataDelete]
            queryClient.setQueryData('account', newData)
        }})
}