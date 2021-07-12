import axios, {AxiosError} from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchValidationAccountData = async (accountNameOwner: String): Promise<any> => {
    const response = await axios.get(
        endpointUrl() + "/validation/amount/select/" + accountNameOwner,
        {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    )
    console.debug(JSON.stringify(response.data))
    return response.data;
}

export default function useFetchValidationAccount(accountNameOwner: String) {
    return useQuery(['validationAccount', accountNameOwner],
        () => fetchValidationAccountData(accountNameOwner),
        {
            onError: (error: AxiosError<any>) => {
                console.log(error ? error : "error is undefined.")
                console.log(error.response ? error.response : "error.response is undefined.")
                console.log(error.response ? JSON.stringify(error.response) : "error.response is undefined - cannot stringify.")
            },
        }
    )
}