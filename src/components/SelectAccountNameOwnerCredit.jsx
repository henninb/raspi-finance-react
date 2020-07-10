import React, {useCallback, useEffect, useState} from 'react'
import Select from 'react-select'
import axios from "axios";

export default function SelectAccountNameOwnerCredit({onChangeFunction, currentValue}) {
    const [selectedOption, setSelectedOption] = useState(currentValue);
    const [accountTypeOptions, setaccountTypeOptions] = useState([]);

    const fetchAccountTypeOptions = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/select/active');

            let optionList = []
            response.data.forEach(element => {
                if (element.accountType === 'credit') {
                    optionList = optionList.concat({value: element.accountNameOwner, label: element.accountNameOwner})
                }
            })
            if (optionList.length > 0) {
                setaccountTypeOptions(optionList);
            }
            alert(optionList);
        } catch (error) {
            if (error.response) {
                alert(JSON.stringify(error.response.data));
            }
        }
    }, []);

    useEffect(() => {
        if (accountTypeOptions.length === 0) {
            fetchAccountTypeOptions();
        }
    }, [accountTypeOptions, fetchAccountTypeOptions]);

    const onSelectChange = ({value}) => {
        setSelectedOption(value);
        onChangeFunction(value);
    }

    return (
        <div className="select-formatting">
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
