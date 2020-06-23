import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import axios from "axios";
import {useHistory} from "react-router-dom";

export default function SimpleSelect() {

    const [options, setOptions] = useState([]);

    const handleChange = (selectedOption) => {
        history.push('/transactions/' + selectedOption.value);
        history.go(0);
    }

    const history = useHistory();

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/account/select/active');

            let optionList = []
            response.data.forEach(element => {
                optionList = optionList.concat({value: element.accountNameOwner, label: element.accountNameOwner})
            })

            setOptions(optionList);
        } catch (error) {
            if (error.response) {
                alert(JSON.stringify(error.response.data));
            }
        }
    };

    useEffect( () => {

        if( options.length === 0 ) {
            fetchData();
        }

    }, [options]);



    return (
        <div className="select-formatting">
            <Select
                options={options}
                onChange={handleChange}
                placeholder="account name owner..."
            />
        </div>
    );
}
