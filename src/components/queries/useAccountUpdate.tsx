import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import Account from "../model/Account";

const updateAccount =  async (oldRow:Account, newRow:Account) : Promise<any> => {
    let endpoint = endpointUrl() + "/account/update/" + oldRow.accountNameOwner

    const response = await axios.put(endpoint, JSON.stringify(newRow), {
        timeout: 0,
        headers: { "Content-Type": "application/json" },
    });
    return response.data;

}

const catchError = (error:any) => {
    console.log(error.response)
    console.log(JSON.stringify(error.response))
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useAccountUpdate() {
    const queryClient = useQueryClient()

    return useMutation(['updateAccount'], (variables:any) => updateAccount(variables.oldRow, variables.newRow), {onError: catchError,

        onSuccess: (response, variables) => {
            //let oldData = queryClient.getQueryData('account')
            // //TODO: 7-3-2021 fix this so I do not have branching logic here, the line above should be deprecated
            // let newData = [updatedNewRow, ...oldData]
            //queryClient.setQueryData('account', newData)
        }})
}