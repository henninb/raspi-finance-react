import {endpointUrl} from "../Common"
import {useQuery} from "react-query"
import axios from "axios"

const fetchTotals = (accountNameOwner) => {
    return axios.get(
        endpointUrl() + "/transaction/account/totals/" + accountNameOwner,
        {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    )
}

const catchError = (error) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useFetchTotals (accountNameOwner) {
    return useQuery(['totals', accountNameOwner], () => fetchTotals(accountNameOwner), {onError: catchError})
}