import axios, { AxiosError } from "axios";
import {endpointUrl} from "../Common";
import {useMutation, useQueryClient} from "react-query";
import {getAccountKey} from "./KeyFile";
import {TransactionState} from "../model/TransactionState";


const changeTransactionState =  async (guid : String, newTransactionState: TransactionState) : Promise<any> => {
    console.log('guid:' + guid)
    console.log('newTransactionState:' + newTransactionState)

    const response = await axios.put(
        endpointUrl() + "/transaction/state/update/" + guid + "/" + newTransactionState, "{}", {
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    }
    );
    return response.data;
}

export default function useTransactionStateUpdate (accountNameOwner: String) {
    const queryClient = useQueryClient()

    return useMutation(['transactionState'], (variables: any) => changeTransactionState(variables.guid, variables.transactionState), {
        onError: (error: AxiosError<any>) => {
            console.log(error ? error: "error is undefined.")
            console.log(error.response ? error.response: "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
        },

        onSuccess: (response, variables) => {
            let oldData :any = queryClient.getQueryData(getAccountKey(accountNameOwner))

            let newData = oldData.map((element: any) => {
                if (element["guid"] === variables.guid) {
                    return {...element, transactionState: variables.transactionState}
                } else {
                    return element
                }
            })

            queryClient.setQueryData(getAccountKey(accountNameOwner), newData)
        }})
}