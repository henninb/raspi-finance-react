import {endpointUrl} from "../Common"
import {useQuery} from "react-query"
import axios from "axios"

const fetchTotals = async () : Promise<any> => {
    const response = await axios.get(
        endpointUrl() + "/account/totals",
        {
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }
    )
    return response.data
}

export default function useFetchTotals () {
    return useQuery(['all_totals'], () => fetchTotals(), {
            onError: (error: any) => {
                console.log(error ? error: "error is undefined.")
                console.log(error.response ? error.response: "error.response is undefined.")
                console.log(error.response ? JSON.stringify(error.response): "error.response is undefined - cannot stringify.")
            },
    }
    )
}