import React, {useEffect, useState} from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function SelectTransactionState({onChangeFunction, currentValue}) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(currentValue);
    const [inputValue, setInputValue] = useState('');
    const [keyPressValue, setKeyPressValue] = useState('');

    useEffect(() => {
        setOptions(['future', 'outstanding', 'cleared']);
        if (value === '') {
            setValue(currentValue);
        }
    }, [currentValue]);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            options.find((state) => {
                if( state.startsWith(inputValue)) {
                    setKeyPressValue(state);
                    return state
                }
                return ""
            })
        }
    }

    return (
        <div>
            <Autocomplete
                getOptionLabel={(options) => options}
                defaultValue={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    onChangeFunction(newValue);
                }}

                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    if( keyPressValue === '') {
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
