import React, {useEffect, useState} from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import useFetchCategory from "./queries/useFetchCategory";

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

    const {data, isSuccess} = useFetchCategory()

    const extractedCategoryField = (response: any) => {
        let categories: any[] = []
        response.data.forEach((element: any) => {
            categories.push(element.category)
        })
        return categories
    }

    useEffect(() => {
        if( isSuccess ) {
            const response: any = extractedCategoryField(data) //fetchCategoryData()
            //console.log(response)
            setOptions(response)
        }

        setValue(inputValue)
    }, [value, data, currentValue, inputValue, isSuccess])

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
