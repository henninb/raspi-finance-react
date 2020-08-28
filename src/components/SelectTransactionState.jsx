import React, {useState} from 'react'
import Select from 'react-select'

export default function SelectTransactionState({onChangeFunction, currentValue}) {
    const [selectedOption, setSelectedOption] = useState(currentValue);

    // const accountTypeOptions = [
    //     {value: '-1', label: 'future', chipLabel: "negative"},
    //     {value: '0', label: 'outstanding'},
    //     {value: '1', label: 'cleared'}
    // ];

    const accountStateOptions = [
        {value: 'future', label: 'future'},
        {value: 'outstanding', label: 'outstanding'},
        {value: 'cleared', label: 'cleared'},
        {value: 'undefined', label: 'undefined'}
    ];

    const onSelectChange = ({value}) => {
        setSelectedOption(value);
        onChangeFunction(value);
    }

    return (
        <div>
            <Select
                value={selectedOption}
                onChange={onSelectChange}
                native={true}
                options={accountStateOptions}
                placeholder={currentValue}
                defaultValue={currentValue}
            />
        </div>
    );
}
