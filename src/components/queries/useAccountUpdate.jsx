import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";

const updateAccount =  (oldRow, newRow) => {
    let endpoint = endpointUrl() + "/transaction/update/" + oldRow.guid
    delete newRow["tableData"]

    return axios.put(endpoint, JSON.stringify(newRow), {
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

//TODO: not used
export default function useAccountUpdate() {
    const queryClient = useQueryClient()
    //queryClient.getQueryData('account')

    return useMutation(['updateAccount'], (variables) => updateAccount(variables.oldRow, variables.newRow), {onError: catchError,

        onSuccess: (response, variables) => {
            //let oldData = queryClient.getQueryData('account')
            // //TODO: 7-3-2021 fix this so I do not have branching logic here, the line above should be deprecated
            // let newData = [updatedNewRow, ...oldData]
            //queryClient.setQueryData('account', newData)
        }})
}