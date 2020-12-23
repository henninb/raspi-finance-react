import React, {useCallback, useEffect, useState} from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import axios from "axios"
import {endpointUrl} from "./Common"

interface Props {
    onChangeFunction: any
    currentValue: any
}

export default function SelectCategory({
                                           onChangeFunction,
                                           currentValue,
                                       }: Props) {
    const [options, setOptions] = useState([])
    const [value, setValue] = useState(currentValue)
    const [inputValue, setInputValue] = useState("")
    const [keyPressValue, setKeyPressValue] = useState("")

    const fetchCategoryData = useCallback(async () => {
        try {
            const response = await axios.get(
                endpointUrl() + "/category/select/active"
            )
            const categories: any[] = extracted(response)
            // @ts-ignore
            setOptions(categories)
            return categories
        } catch (error) {
            if (error.response) {
                // if (error.response.status === 404) {
                // } else {
                //     alert("fetchCategoryData" + JSON.stringify(error.response.data))
                // }
            }
            //setOptions([])
        } finally {

        }
    }, [])

    const extracted = (response: any) => {
        let categories: any[] = []
        response.data.forEach((element: any) => {
            categories.push(element.category)
        })
        return categories
    }

    useEffect(() => {
        const response = fetchCategoryData()
        console.log(response)

        setValue(inputValue)
    }, [value, fetchCategoryData, currentValue, inputValue])

    const handleKeyDown = (event: any) => {
        if (event.key === "Tab") {
            let filteredOptions = options.filter((state) => {
                // @ts-ignore
                return state.includes(inputValue)
            })
            if (filteredOptions.length > 0) {
                return filteredOptions.find((state) => {
                    setKeyPressValue(state)
                    onChangeFunction(state)
                    return state
                })
            } else {
                setKeyPressValue(inputValue)
                onChangeFunction(inputValue)
                return inputValue
            }
        }
    }

    return (
        <div>
            <Autocomplete
                defaultValue={value}
                onChange={(_event, newValue) => {
                    setValue(newValue)
                    onChangeFunction(newValue)
                }}
                inputValue={inputValue}
                onInputChange={(_event, newInputValue) => {
                    if (keyPressValue === "") {
                        setInputValue(newInputValue)
                    } else {
                        setInputValue(keyPressValue)
                        setKeyPressValue("")
                    }
                }}
                style={{width: 140}}
                options={options}
                renderInput={(params) => (
                    <TextField {...params} onKeyDown={(e) => handleKeyDown(e)}/>
                )}
            />
        </div>
    )
}
