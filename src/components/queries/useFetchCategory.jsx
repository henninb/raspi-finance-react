import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchCategoryData = () => {
    return axios.get(
        endpointUrl() + "/category/select/active",
        {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    ).then(response => response.data)
}

const catchError = (error) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useFetchCategory () {
    return useQuery('category', () => fetchCategoryData(), {onError: catchError})
}