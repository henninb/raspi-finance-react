import React, {useState} from 'react'
import Select from 'react-select'

export default function SelectTransactionState({onChangeFunction, currentValue}) {
    //const [selectedOption, setSelectedOption] = useState(currentValue);



    // const accountStateOptions = [
    //     {value: 'future', label: 'future'},
    //     {value: 'outstanding', label: 'outstanding'},
    //     {value: 'cleared', label: 'cleared'},
    //     {value: 'undefined', label: 'undefined'}
    // ];


    const transactionStateOptions = () => {
        return [
            {value: 'future', label: 'future'},
            {value: 'outstanding', label: 'outstanding'},
            {value: 'cleared', label: 'cleared'},
            {value: 'undefined', label: 'undefined'}
        ]
    }


    const onSelectChange = ({value}) => {
        //setSelectedOption(value);
        onChangeFunction(value);
    }

    return (
        <div>
            <Select
                value={transactionStateOptions().find(op => {
                    if( currentValue === undefined ) {
                        return op.value === 'outstanding'
                    }
                    return op.value === currentValue
                })}
                onChange={onSelectChange}
                options={transactionStateOptions()}
                //placeholder={currentValue}
                //defaultValue={currentValue}
            />
        </div>
    );
}
