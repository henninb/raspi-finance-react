import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";

const setupNewAccount = (payload: any) => {
    const now = new Date()
    payload.cleared = 0.0
    payload.future = 0.0
    payload.outstanding = 0.0
    payload.dateClosed = 0
    payload.dateAdded = Math.round(now.getTime())
    payload.dateUpdated = Math.round(now.getTime())
    payload.activeStatus = true
    return payload
}

const insertAccount =  (payload : any) => {
    let endpoint = endpointUrl() + '/account/insert/'
    let newPayload = setupNewAccount(payload)

    return axios.post(endpoint, newPayload, {
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

export default function useAccountInsert () {
    const queryClient = useQueryClient()

    return useMutation(['insertAccount'], (variables:any) => insertAccount(variables.payload), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData: any = queryClient.getQueryData('account')
            let updatedNewRow = setupNewAccount(variables.payload)
            let newData = [updatedNewRow, ...oldData]
            queryClient.setQueryData('account', newData)
        }})
}