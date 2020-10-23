import React, {useCallback, useEffect, useState} from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import {endpointUrl} from "./Common";

export default function SelectCategory({onChangeFunction, currentValue}) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(currentValue);
    const [inputValue, setInputValue] = useState('');
    const [keyPressValue, setKeyPressValue] = useState('');

    const fetchCategoryData = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + '/category/select/active');
            const categories = extracted(response);
            setOptions(categories);
            return categories

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                } else {
                    alert("fetchCategoryData" + JSON.stringify(error.response.data));
                }
            }
        }
    }, []);

    const extracted = (response) => {
        let categories = []
        response.data.forEach(element => {
            categories.push(element.category);
        })
        return categories
    }

    useEffect(() => {
        const response = fetchCategoryData();
        console.log(response);

        setValue(inputValue);
    }, [value, fetchCategoryData, currentValue, inputValue]);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            const lastValue = options[options.length - 1]
            options.find((state) => {
                if (state.includes(inputValue)) {
                    setKeyPressValue(state)
                    onChangeFunction(state)
                    return state
                }
                console.log('lastValue: ' + lastValue);
                if( lastValue === state) {
                    // TODO: new value should be added to the list of categories
                    setKeyPressValue(inputValue)
                    onChangeFunction(inputValue)
                    return inputValue
                }
            })
        }
    }

    return (
        <div>
            <Autocomplete
                defaultValue={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    onChangeFunction(newValue);
                }}

                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    if (keyPressValue === '') {
                        setInputValue(newInputValue);
                    } else {
                        setInputValue(keyPressValue)
                        setKeyPressValue('')
                    }
                }}
                style={{width: 140}}
                options={options}

                renderInput={(params) => <TextField {...params} onKeyDown={(e) => handleKeyDown(e)}/>}
            />
        </div>
    );
}
