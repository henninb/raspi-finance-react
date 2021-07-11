import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchPaymentRequiredData = async () : Promise<any> => {
    const response = await axios.get(
        endpointUrl() + "/transaction/payment/required",
        {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    );
    return response.data;
}

export default function useFetchPaymentRequired () {
    return useQuery('payment_required', () => fetchPaymentRequiredData(), {
        onError: (error: any) => {
            console.log(error ? error: "error is undefined.")
            console.log(error.response ? error.response: "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
        },
    })
}