import React, {useCallback, useEffect, useState} from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import {endpointUrl} from "./Common";

export default function SelectDescription({onChangeFunction, currentValue}) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(currentValue);
    const [inputValue, setInputValue] = useState('');
    const [keyPressValue, setKeyPressValue] = useState('');

    const fetchDescriptionData = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + '/description/select/all');
            const descriptions = extracted(response);
            setOptions(descriptions);
            return descriptions

        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                } else {
                    alert("fetchDescriptionData" + JSON.stringify(error.response.data));
                }
            }
        }
    }, []);

    const extracted = (response) => {
        let descriptions = []
        response.data.forEach(element => {
            descriptions.push(element.description);
        })
        return descriptions
    }

    useEffect(() => {
        const response = fetchDescriptionData();
        console.log(response);

        setValue(inputValue);
    }, [value, fetchDescriptionData, currentValue, inputValue]);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            const lastValue = options[options.length - 1]
            //TODO: need to refactor
            options.find((state) => {
                if (state.includes(inputValue)) {
                    setKeyPressValue(state)
                    onChangeFunction(state)
                    return state
                }
                console.log('lastValue: ' + lastValue);
                if( lastValue === state) {
                    // TODO: new value should be added to the list of descriptions
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
                    console.log(event.value);
                    setValue(newValue);
                    onChangeFunction(newValue);
                }}

                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    console.log(event.value);
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
