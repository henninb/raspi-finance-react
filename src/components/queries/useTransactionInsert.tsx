import {endpointUrl} from "../Common";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";

const setupNewTransaction = (payload:any, accountNameOwner:string) => {

    let newPayload: any = {
        guid: uuidv4(),
        transactionDate: payload.transactionDate,
        description: payload.description,
        category: payload.category ? payload.category : 'undefined',
        notes: payload.notes === undefined ? "" : payload.notes,
        amount: payload.amount,
        transactionState:  payload.transactionState ? payload.transactionState : 'outstanding',
        activeStatus: true,
        accountType: payload.accountType ? payload.accountType : "undefined",
        reoccurringType: payload.reoccurringType  ?  payload.reoccurringType : 'onetime',
        accountNameOwner: accountNameOwner,
    }

    if (payload['dueDate'] === "") {
        delete payload['dueDate']
    }

    if (payload['dueDate'] !== "") {
        newPayload['dueDate'] = payload.dueDate
    }
    return newPayload
}

const insertTransaction = (accountNameOwner:any, payload:any, isFutureTransaction: Boolean) => {
    let endpoint = endpointUrl() + "/transaction/insert/"
    if( isFutureTransaction) {
        endpoint = endpointUrl() + "/transaction/future/insert/"
        console.log("will insert futureTransaction")
    }

    let newPayload = setupNewTransaction(payload, accountNameOwner)

    return axios.post(endpoint, newPayload, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
    }).then(response => response.data)
}

const catchError = (error: any) => {
    console.log(error ? error: "error is undefined.")
    console.log(error.response ? error.response: "error.response is undefined.")
    console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
    //handleError(error, 'fetchAccountData', true)
}

export default function useTransactionInsert (accountNameOwner: any) {
    const queryClient = useQueryClient()

    return useMutation(['insertTransaction'], (variables : any) => insertTransaction( accountNameOwner, variables.newRow, variables.isFutureTransaction ), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData : any = queryClient.getQueryData(getAccountKey(accountNameOwner))
            let updatedNewRow = setupNewTransaction(variables.newRow, accountNameOwner)
            //TODO: 7-3-2021 fix this so I do not have branching logic here, the line above should be deprecated
            if( variables.isFutureTransaction ) {
               updatedNewRow = response
            }
            if( oldData ) {
                let newData = [updatedNewRow, ...oldData]
                queryClient.setQueryData(getAccountKey(accountNameOwner), newData)
            }
        }})
}