import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchAccountData = (accountNameOwner) => {
    return axios.get(
        endpointUrl() + "/transaction/account/select/" + accountNameOwner,
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

export default (accountNameOwner) => {
    return useQuery(['accounts', accountNameOwner], () => fetchAccountData(accountNameOwner), {onError: catchError})
}
