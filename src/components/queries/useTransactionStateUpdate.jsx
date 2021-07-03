import axios from "axios";
import {endpointUrl} from "../Common";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";


const changeTransactionState =  (guid, newTransactionState) => {
    console.log('guid:' + guid)
    console.log('newTransactionState:' + newTransactionState)

    return axios.put(
        endpointUrl() + "/transaction/state/update/" + guid + "/" + newTransactionState, "{}", {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    ).then(response => response.data)
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

export default function useTransactionStateUpdate (accountNameOwner) {
    const queryClient = useQueryClient()
    console.log('update cache for accountNameOwner: ' + accountNameOwner)
    queryClient.getQueryData(getAccountKey(accountNameOwner))

    return useMutation(['transactionState'], (variables) => changeTransactionState(variables.guid, variables.transactionState), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData(getAccountKey(accountNameOwner))

            let newData = oldData.map((element) => {
                if (element["guid"] === variables.guid) {
                    return {...element, transactionState: variables.transactionState}
                } else {
                    return element
                }
            })

            queryClient.setQueryData(getAccountKey(accountNameOwner), newData)
        }})
}