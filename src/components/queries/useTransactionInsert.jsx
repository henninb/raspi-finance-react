import {endpointUrl} from "../Common";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";


const setupNewTransaction = (payload, accountNameOwner) => {

    let newPayload = {
        guid: uuidv4(),
        transactionDate: payload.transactionDate,
        description: payload.description,
        category: payload.category === undefined ? "undefined" : payload.category,
        //dueDate: payload.dueDate = payload.dueDate,
        notes: payload.notes === undefined ? "" : payload.notes,
        amount: payload.amount,
        transactionState:
            payload.transactionState === undefined
                ? "outstanding"
                : payload.transactionState,
        activeStatus: true,
        accountType: "undefined",
        reoccurring: payload.reoccurring === undefined ? false : payload.reoccurring,
        reoccurringType:
            payload.reoccurringType === undefined
                ? "onetime"
                : payload.reoccurringType,
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

const insertTransaction = (accountNameOwner, payload, isFutureTransaction) => {
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

const catchError = (error) => {
    console.log(error.response)
    console.log(JSON.stringify(error.response))
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useTransactionInsert (accountNameOwner) {
    const queryClient = useQueryClient()
    //queryClient.getQueryData(getAccountKey(accountNameOwner))

    return useMutation(['insertTransaction'], (variables) => insertTransaction(accountNameOwner, variables.newRow, variables.isFutureTransaction), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData(getAccountKey(accountNameOwner))
            let updatedNewRow = setupNewTransaction(variables.newRow, accountNameOwner)
            //TODO: 7-3-2021 fix this so I do not have branching logic here, the line above should be deprecated
            if( variables.isFutureTransaction ) {
               updatedNewRow = response
            }
            let newData = [updatedNewRow, ...oldData]
            queryClient.setQueryData(getAccountKey(accountNameOwner), newData)
        }})
}