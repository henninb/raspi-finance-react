import {endpointUrl} from "../Common";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import Description from "../model/Description";

const insertDescription = (descriptionName: any) : Promise<any> => {
    let endpoint = endpointUrl() + '/description/insert/'
    let payload = {description: descriptionName, activeStatus:true}

    return axios.post(endpoint, payload, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
    }).then(response => response.data)
}

const catchError = (error:any) => {
    console.log(error.response)
    console.log(JSON.stringify(error.response))
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useDescriptionInsert () {
    const queryClient = useQueryClient()

    return useMutation(['insertDescription'], (variables:any) => insertDescription(variables.descriptionName), {onError: catchError,

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData('description')
            let newData = oldData
            //TODO: add description to the list
            queryClient.setQueryData('description', newData)
        }})
}