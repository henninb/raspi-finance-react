import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchPaymentData = async () : Promise<any> => {
    const response = await axios.get(
        endpointUrl() + '/payment/select',
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

export default function useFetchPayment () {
    return useQuery('payment', () => fetchPaymentData(), {
        onError: (error: any) => {
            console.log(error ? error: "error is undefined.")
            console.log(error.response ? error.response: "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
        },
    })
}