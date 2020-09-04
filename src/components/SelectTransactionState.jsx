import React, {useEffect, useState} from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

export default function SelectTransactionState({onChangeFunction, currentValue}) {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(currentValue);
    const [inputValue, setInputValue] = useState('');
    const [keyPressValue, setKeyPressValue] = useState('');

    // const transactionStateOptions = () => {
    //     return ['future', 'outstanding', 'cleared', 'undefined']
    // }

    // const onSelectChange = ({value}) => {
    //     onChangeFunction(value);
    // }

    // const newOptions = [
    //     { title: 'future'},
    //     { title: 'outstanding'},
    //     { title: 'cleared'}
    // ]

    useEffect(() => {
        setOptions(['future', 'outstanding', 'cleared']);
        //setOptions(newOptions);
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
            // alert(x)
            // if (inputValue.startsWith("o")) {
            //     await setKeyPressValue('outstanding');
            // } else if (inputValue.startsWith("c")) {
            //     await setKeyPressValue('cleared');
            // } else if (inputValue.startsWith("f")) {
            //     await setKeyPressValue('future');
            // }
            //alert(inputValue + " " + value);
        }
    }

    return (
        <div>
            <Autocomplete
                getOptionLabel={(options) => options}
                // value={value}
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
