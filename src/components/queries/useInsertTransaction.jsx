import {endpointUrl} from "../Common";
import {v4 as uuidv4} from "uuid";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";

const insertTransaction = (accountNameOwner, payload) => {
    let endpoint = endpointUrl() + "/transaction/insert/"

    if (payload['dueDate'] === "") {
        delete payload['dueDate']
    }

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

    if (payload['dueDate'] !== "") {
        newPayload['dueDate'] = payload.dueDate
    }

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

export default (accountNameOwner) => {
    const queryClient = useQueryClient()
    queryClient.getQueryData(getAccountKey(accountNameOwner))

    return useMutation(['insertTransaction'], (variables) => insertTransaction(variables.accountNameOwner, variables.newRow), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData(getAccountKey(accountNameOwner))
            let newData = [variables.newRow, ...oldData]
            queryClient.setQueryData(getAccountKey(accountNameOwner), newData)
        }})
}