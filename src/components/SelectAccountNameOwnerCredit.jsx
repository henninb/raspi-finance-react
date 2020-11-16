import React, {useCallback, useEffect, useState} from 'react'
import Select from 'react-select'
import axios from "axios";
import {endpointUrl} from "./Common";

export default function SelectAccountNameOwnerCredit({onChangeFunction, currentValue}) {
    const [selectedOption, setSelectedOption] = useState(currentValue);
    const [accountTypeOptions, setAccountTypeOptions] = useState([]);

    const fetchAccountTypeOptions = useCallback(async () => {
        try {
            const response = await axios.get(endpointUrl() + '/account/select/active');

            let optionList = []
            response.data.forEach(element => {
                if (element.accountType === 'credit') {
                    optionList = optionList.concat({value: element.accountNameOwner, label: element.accountNameOwner})
                }
            })
            if (optionList.length > 0) {
                setAccountTypeOptions(optionList);
            }
        } catch (error) {
            if (error.response) {
                alert("fetchAccountTypeOptions - status: " + error.response.status + " - " + JSON.stringify(error.response.data));
            }
        }
    }, []);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if (accountTypeOptions.length === 0) {
            let response = fetchAccountTypeOptions();
            console.log(response);
        }

        return () => {
            source.cancel();
        }
    }, [accountTypeOptions, fetchAccountTypeOptions]);

    const onSelectChange = ({value}) => {
        setSelectedOption(value);
        onChangeFunction(value);
    }

    return (
        <div className="select-formatting">
            <Select
                name="account-select"
                multi={true}
                value={selectedOption}
                onChange={onSelectChange}
                native={true}
                options={accountTypeOptions}
                placeholder={currentValue}
            />
        </div>
    );
}
