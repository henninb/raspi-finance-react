import {endpointUrl} from "../Common";
import axios, { AxiosError } from "axios";
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

export default function useAccountUpdate() {
    const queryClient = useQueryClient()

    return useMutation(['updateAccount'], (variables:any) => updateAccount(variables.oldRow, variables.newRow), {
        onError: (error:AxiosError<any>) => {
        console.log(error ? error: "error is undefined.")
        console.log(error.response ? error.response: "error.response is undefined.")
        console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
    },

        onSuccess: (response, variables) => {
            //let oldData = queryClient.getQueryData('account')
            // //TODO: 7-3-2021 fix this so I do not have branching logic here, the line above should be deprecated
            // let newData = [updatedNewRow, ...oldData]
            //queryClient.setQueryData('account', newData)
        }})
}