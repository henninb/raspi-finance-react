import {endpointUrl} from "../Common"
import {useQuery} from "react-query"
import axios from "axios"

const fetchTotalsPerAccount = async (accountNameOwner:any) : Promise<any> => {
    const response = await axios.get(
        endpointUrl() + "/transaction/account/totals/" + accountNameOwner,
        {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    )
    return response.data
}

const catchError = (error:any) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useFetchTotalsPerAccount (accountNameOwner:any) {
    return useQuery(['totals', accountNameOwner], () => fetchTotalsPerAccount(accountNameOwner), {onError: catchError})
}