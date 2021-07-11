import {endpointUrl} from "../Common"
import axios, {AxiosError} from "axios"
import {useMutation, useQueryClient} from "react-query"
import Payment from "../model/Payment";

const setupNewPayment = (payload: any) => {
    return {
        accountNameOwner: payload.accountNameOwner,
        amount: payload.amount,
        transactionDate: payload.transactionDate.toISOString(),
    }
}

const insertPayment = async (payload: Payment): Promise<any> => {
    let endpoint = endpointUrl() + '/payment/insert/'
    let newPayload = setupNewPayment(payload)

    const response = await axios.post(endpoint, newPayload, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
    });
    return response.data;

}

export default function usePaymentInsert() {
    const queryClient = useQueryClient()

    return useMutation(['insertPayment'], (variables: any) => insertPayment(variables.payload), {
        onError: (error: AxiosError<any>) => {
            console.log(error ? error : "error is undefined.")
            console.log(error.response ? error.response : "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response) : "error.response is undefined - cannot stringify.")
        },

        onSuccess: (response, variables) => {
            let oldData: any = queryClient.getQueryData('payment')
            let updatedNewRow = setupNewPayment(variables.payload)
            let newData = [updatedNewRow, ...oldData]
            queryClient.setQueryData('payment', newData)
        }
    })
}