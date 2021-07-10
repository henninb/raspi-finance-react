import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import Payment from "../model/Payment";

const deletePayment = async (payload:Payment) : Promise<String> => {
    let endpoint = endpointUrl() + "/payment/delete/" + payload.paymentId

    const response = await axios.delete(endpoint, {
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
    //handleError(error, 'fetchPaymentData', true)
}

export default function usePaymentDelete() {
    const queryClient = useQueryClient()

    return useMutation(['deletePayment'], (variables:any) => deletePayment(variables.oldRow), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData : any = queryClient.getQueryData('payment')
            const dataDelete : any = [...oldData]
            const index = variables.oldRow.tableData.id
            dataDelete.splice(index, 1)
            let newData = [...dataDelete]
            queryClient.setQueryData('payment', newData)
        }})
}