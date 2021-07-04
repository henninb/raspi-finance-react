import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchAccountData = () => {
    return axios.get(
        endpointUrl() + '/account/select/active',
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

export default function useFetchAccount () {
    return useQuery('account', () => fetchAccountData(), {onError: catchError})
}