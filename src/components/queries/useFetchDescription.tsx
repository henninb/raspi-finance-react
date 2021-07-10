import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchDescriptionData = async () : Promise<any> => {
    const response = await axios.get(
        endpointUrl() + '/description/select/all',
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
    //handleError(error, 'fetchAccountData', true)
}

export default function useFetchDescription () {
    return useQuery('description', () => fetchDescriptionData(), {onError: catchError})
}