import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";

const setupNewPayment = (payload) => {
    return {
        accountNameOwner: payload.accountNameOwner,
        amount: payload.amount,
        transactionDate: payload.transactionDate.toISOString(),
    }
}

const insertPayment =  (payload) => {
    let endpoint = endpointUrl() + '/payment/insert/'
    let newPayload = setupNewPayment(payload)

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
    //handleError(error, 'fetchPaymentData', true)
}

export default function usePaymentInsert () {
    const queryClient = useQueryClient()
    queryClient.getQueryData('payment')

    return useMutation(['insertPayment'], (variables) => insertPayment(variables.payload), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData('payment')
            let updatedNewRow = setupNewPayment(variables.payload)
            let newData = [updatedNewRow, ...oldData]
            queryClient.setQueryData('payment', newData)
        }})
}