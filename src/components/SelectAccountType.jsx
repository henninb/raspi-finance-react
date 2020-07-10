import React, {useState} from 'react'
import Select from 'react-select'


export default function SelectAccountType({onChangeFunction, currentValue}) {


    const [selectedOption, setSelectedOption] = useState(currentValue);

    const accountTypeOptions = [
        {value: 'credit', label: 'credit'},
        {value: 'debit', label: 'debit'}
    ];

    const onSelectChange = ({value}) => {
        setSelectedOption(value);
        onChangeFunction(value);
    }

    // notes
    // const object = { value: 'credit', label: 'credit' }
    // const val = object.value
    // const {value} = object //destructuring

    return (
        <div>
            <Select
                value={selectedOption}
                onChange={onSelectChange}
                native={true}
                //defaultValue={{ value: 'credit', label: 'credit' }}
                options={accountTypeOptions}
                placeholder={currentValue}
            />
        </div>
    );
}
