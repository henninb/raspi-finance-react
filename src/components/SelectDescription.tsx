import React, {useCallback, useEffect, useState} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import {endpointUrl} from "./Common";

interface Props {
    onChangeFunction: any,
    currentValue: any
}

export default function SelectDescription({onChangeFunction, currentValue}: Props) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(currentValue);
    const [inputValue, setInputValue] = useState('');
    const [keyPressValue, setKeyPressValue] = useState('');

    const postDescription = useCallback(async (payload: any) => {
        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();
        let endpoint = endpointUrl() + '/description/insert/';
        let newPayload = {
            description: payload,
            activeStatus: true
        };

        let response = await axios.post(endpoint, newPayload, {
            timeout: 0,
            headers: {'Content-Type': 'application/json'},
            cancelToken: source.token
        });
        console.log(response.data)
        return newPayload;
    }, []);

    const fetchDescriptionData = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + '/description/select/all',
                {
                    timeout: 0,
                    headers: {"Content-Type": "application/json"},
                }
                )
            const descriptions = extracted(response)
            // @ts-ignore
            setOptions(descriptions)
            return descriptions
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                } else {
                    //TODO: swap out alert for another means
                    alert("fetchDescriptionData" + JSON.stringify(error.response.data))
                }
            }
        }
    }, [])

    const extracted = (response: any) => {
        // @ts-ignore
        let descriptions: any[] = []
        response.data.forEach((element: any) => {
            descriptions.push(element.description)
        })
        return descriptions
    };

    useEffect(() => {
        const response = fetchDescriptionData()
        console.log(response)

        setValue(inputValue)
    }, [value, fetchDescriptionData, currentValue, inputValue])

    const handleKeyDown = (event: any) => {
        if (event.key === 'Tab') {
            // @ts-ignore
            let filteredOptions = options.filter((state) => state.includes(inputValue));
            if (filteredOptions.length > 0) {
                return filteredOptions.find((state) => {
                    setKeyPressValue(state);
                    onChangeFunction(state);
                    return state;
                })
            } else {
                setKeyPressValue(inputValue);
                onChangeFunction(inputValue);
                let response = postDescription(inputValue);
                console.log(response);
                return inputValue;
            }
        }
    }

    return (
        <div>
            <Autocomplete
                defaultValue={value}
                onChange={(_event, newValue) => {
                    setValue(newValue);
                    onChangeFunction(newValue);
                }}

                inputValue={inputValue}
                onInputChange={(_event, newInputValue) => {
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
