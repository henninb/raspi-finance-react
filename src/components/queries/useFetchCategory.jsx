import {useCallback} from "react";
import axios from "axios";
import {endpointUrl} from "../Common";
import {useQuery} from "react-query";


const extractedCategoryField = (response) => {
    let categories = []
    response.data.forEach((element) => {
        categories.push(element.category)
    })
    return categories
}

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
    )
    //     const categories: any[] = extracted(response)
    //     // @ts-ignore
    //
    //     return categories
    // } catch (error) {
    //     if (error.response) {
    //         // if (error.response.status === 404) {
    //         // } else {
    //         //     alert("fetchCategoryData" + JSON.stringify(error.response.data))
    //         // }
    //     }
    //     //setOptions([])
    // } finally {
    //
    // }
}

const catchError = (error) => {
    if (error.response) {
        if (error.response.status === 404) {

        }
    }
    //handleError(error, 'fetchAccountData', true)
}

export default function useFetchCategory (accountNameOwner) {
    return useQuery('category', () => fetchCategoryData(), {onError: catchError})
}