import React, {useCallback, useEffect, useState} from 'react'
import Select from 'react-select'
import axios from "axios";
import {useHistory} from "react-router-dom";

export default function SelectAccounts() {

    const [options, setOptions] = useState([]);

    const handleChange = (selectedOption) => {
        history.push('/transactions/' + selectedOption.value);
        history.go(0);
    }

    const history = useHistory();

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/select/active');

            let optionList = []
            response.data.forEach(element => {
                optionList = optionList.concat({value: element.accountNameOwner, label: element.accountNameOwner});
            })

            //if( response.data.length > 0 ) {
            setOptions(optionList);
            //}
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                } else {
                    alert("fetchData" + JSON.stringify(error.response.data));
                }
            }
        }
    }, []);

    useEffect(() => {

        if (options.length === 0) {
            fetchData();
        }

        return () => {

        }

    }, [options, fetchData]);

    return (
        <div className="select-formatting">
            <Select
                options={options}
                onChange={handleChange}
                placeholder="account name owner..."
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        text: 'red',
                        // primary50: 'red',
                        primary25: '#9965f4',
                        primary: '#FFF',
                    }
                })}
            />
        </div>
    );
}
