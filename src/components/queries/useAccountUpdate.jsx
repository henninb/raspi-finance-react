import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";

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
    queryClient.getQueryData('account')

    return useMutation(['updateAccount'], (variables) => updateAccount(variables.oldRow, variables.newRow), {onError: catchError,

        onSuccess: (response, variables) => {
            // let oldData = queryClient.getQueryData(getAccountKey(accountNameOwner))
            // let updatedNewRow = setupNewAccount(variables.payload)
            // //TODO: 7-3-2021 fix this so I do not have branching logic here, the line above should be deprecated
            // if( variables.isFutureTransaction ) {
            //    updatedNewRow = response
            // }
            // let newData = [updatedNewRow, ...oldData]
            // queryClient.setQueryData(getAccountKey(accountNameOwner), newData)
        }})
}