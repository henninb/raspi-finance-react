import {endpointUrl} from "../Common";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";
import {useCallback} from "react";

const setupNewAccount = (payload) => {
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

const insertAccount =  (payload) => {
    let endpoint = endpointUrl() + '/account/insert/'
    let newPayload = setupNewAccount(payload)

    return axios.post(endpoint, newPayload, {
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

export default function useAccountInsert () {
    const queryClient = useQueryClient()
    queryClient.getQueryData('account')

    return useMutation(['insertAccount'], (variables) => insertAccount(variables.payload), {onError: catchError,

        onSuccess: (response, variables) => {
            // let oldData = queryClient.getQueryData('account)
            // let updatedNewRow = setupNewAccount(variables.payload)
            // //TODO: 7-3-2021 fix this so I do not have branching logic here, the line above should be deprecated
            // if( variables.isFutureTransaction ) {
            //    updatedNewRow = response
            // }
            // let newData = [updatedNewRow, ...oldData]
            // queryClient.setQueryData('account, newData)
        }})
}