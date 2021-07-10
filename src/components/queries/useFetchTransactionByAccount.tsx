import axios from "axios"
import {endpointUrl} from "../Common"
import {useQuery} from "react-query"
import Transaction from "../model/Transaction";

//interfaces in a models dir

const fetchAccountData = async (accountNameOwner:String): Promise<any> => {
    const response = await axios.get(
        endpointUrl() + "/transaction/account/select/" + accountNameOwner,
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

const catchError = ( error:any ) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useFetchTransactionByAccount (accountNameOwner:any) {
    return useQuery(['accounts', accountNameOwner], () => fetchAccountData(accountNameOwner), {onError: catchError})
}
