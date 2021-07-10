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

const catchError = (error:any) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchPaymentRequiredData', true)
}

export default function useFetchPaymentRequired () {
    return useQuery('payment_required', () => fetchPaymentRequiredData(), {onError: catchError})
}