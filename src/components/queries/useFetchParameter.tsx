import axios, { AxiosError } from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";

const fetchParameterData = async (parameterName:any) : Promise<any> => {
    console.log('parm select called: ' + parameterName)
    const response = await axios.get(
        endpointUrl() + "/parm/select/" + parameterName,
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

export default function useFetchParameter (parameterName:any) {
    console.log(parameterName)
    return useQuery(['parameter', parameterName], () => fetchParameterData(parameterName), {
        onError: (error: AxiosError<any>) => {
            console.log(error ? error: "error is undefined.")
            console.log(error.response ? error.response: "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
        },
    })
}