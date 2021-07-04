import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";

const deletePayment = (payload) => {
    let endpoint = endpointUrl() + "/payment/delete/" + payload.paymentId

    return axios.delete(endpoint, {
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

export default function usePaymentDelete() {
    const queryClient = useQueryClient()
    queryClient.getQueryData('payment')

    return useMutation(['deletePayment'], (variables) => deletePayment(variables.oldRow), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData('payment')
            const dataDelete = [...oldData]
            const index = variables.oldRow.tableData.id
            dataDelete.splice(index, 1)
            let newData = [...dataDelete]
            queryClient.setQueryData('payment', newData)
        }})
}