import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchDescriptionData = () => {
    return axios.get(
        endpointUrl() + '/description/select/all',
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

export default function useFetchDescription (accountNameOwner) {
    return useQuery('description', () => fetchDescriptionData(), {onError: catchError})
}