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
        console.log('transactionState - inputValue ' + inputValue);
        console.log('transactionState - value ' + value);
        setValue(inputValue);
    }, [currentValue, inputValue, value]);

    const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
            console.log('transactionState - tab pressed');
            options.find((state) => {
                if (state.includes(inputValue)) {
                    setKeyPressValue(state)
                    onChangeFunction(state)
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
                    if( keyPressValue === '') {
                        setInputValue(newInputValue);
                    } else {
                        setInputValue(keyPressValue);
                        setKeyPressValue('');
                    }
                }}
                style={{width: 140}}
                options={options}

                renderInput={(params) => <TextField {...params} onKeyDown={(e) => handleKeyDown(e)}/>}
            />
        </div>
    );
}
