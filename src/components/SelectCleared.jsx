import React, {useState} from 'react'
import Select from 'react-select'

export default function SelectCleared({onChangeFunction, currentValue}) {
    const [selectedOption, setSelectedOption] = useState(currentValue);

    const accountTypeOptions = [
        {value: '-1', label: 'future'},
        {value: '0', label: 'outstanding'},
        {value: '1', label: 'cleared'}
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
                options={accountTypeOptions}
                placeholder={currentValue}
            />
        </div>
    );
}
