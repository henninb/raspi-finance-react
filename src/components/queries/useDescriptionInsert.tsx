import {endpointUrl} from "../Common";
import axios, {AxiosError} from "axios";
import {useMutation, useQueryClient} from "react-query";

const insertDescription = async (descriptionName: any): Promise<any> => {
    let endpoint = endpointUrl() + '/description/insert/'
    let payload = {description: descriptionName, activeStatus: true}

    const response = await axios.post(endpoint, payload, {
        timeout: 0,
        headers: {"Content-Type": "application/json"},
    });
    return response.data;
}

export default function useDescriptionInsert() {
    const queryClient = useQueryClient()

    return useMutation(['insertDescription'], (variables: any) => insertDescription(variables.descriptionName), {
        onError: (error: AxiosError<any>) => {
            console.log(error ? error : "error is undefined.")
            console.log(error.response ? error.response : "error.response is undefined.")
            console.log(error.response ? JSON.stringify(error.response) : "error.response is undefined - cannot stringify.")
        },

        onSuccess: (response, variables) => {
            let oldData = queryClient.getQueryData('description')
            let newData = oldData
            //TODO: add description to the list
            queryClient.setQueryData('description', newData)
        }
    })
}