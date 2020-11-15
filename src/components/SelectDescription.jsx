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

    const postDescription = async (payload) => {
        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();
        let endpoint = endpointUrl() + '/description/insert/';
        let newPayload = {};
        newPayload['description'] = payload
        newPayload['activeStatus'] = true

        await axios.post(endpoint, newPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'},
            cancelToken: source.token
        });
        return newPayload
    };

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
                    //TODO: swap out alert for another means
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
    };

    useEffect(() => {
        const response = fetchDescriptionData();
        console.log(response);

        setValue(inputValue);
    }, [value, fetchDescriptionData, currentValue, inputValue]);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            let filteredOptions = options.filter((state) => state.includes(inputValue));
            if( filteredOptions.length > 0) {
                return filteredOptions.find((state) => {
                     setKeyPressValue(state);
                     onChangeFunction(state);
                     return state;
                 })
             } else {
                setKeyPressValue(inputValue);
                onChangeFunction(inputValue);
                postDescription(inputValue);
                return inputValue;
             }
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
