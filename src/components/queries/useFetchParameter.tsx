import axios from "axios";
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

const catchError = (error:any) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchParameterData', true)
}

export default function useFetchParameter (parameterName:any) {
    console.log(parameterName)
    return useQuery(['parameter', parameterName], () => fetchParameterData(parameterName), {onError: catchError})
}