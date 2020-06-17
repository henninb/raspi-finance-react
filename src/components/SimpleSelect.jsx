import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import axios from "axios";

export default function SimpleSelect() {

    const handleChange = (selectedOption) => {
        alert(selectedOption.value);
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios(
                'http://localhost:8080/account/select/active',
            );

            let optionList = []
            response.data.forEach(element => {
                optionList = optionList.concat({value: element.accountNameOwner, label: element.accountNameOwner})
            })

            setOptions(optionList);
        };

        fetchData().then(() => console.log('called fetchData.'));
    }, []);

    const [options, setOptions] = useState([]);

    return (
        <div className="select-formatting">
            <Select
                options={options}
                //onChange={handleSelect}
                placeholder="account name owner..."
            />
        </div>
    );
}
