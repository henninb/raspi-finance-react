import React, {useEffect, useState} from "react"
import Select from "react-select"
import useFetchAccount from "./queries/useFetchAccount"

export default function SelectAccountNameOwnerCredit({
                                                         onChangeFunction,
                                                         currentValue,
                                                     }) {
    const [selectedOption, setSelectedOption] = useState(currentValue)
    const [accountTypeOptions, setAccountTypeOptions] = useState([])

    const {data, isSuccess} = useFetchAccount()

    useEffect(() => {
        if( isSuccess ) {
            let optionList = []
            data.forEach((element) => {
                            if (element.accountType === "credit") {
                                optionList = optionList.concat({
                                    value: element.accountNameOwner,
                                    label: element.accountNameOwner,
                                })
                            }
                        })
                    if (optionList.length > 0) {
                        setAccountTypeOptions(optionList)
                    }
        }

    }, [data, isSuccess])

    const onSelectChange = ({value}) => {
        setSelectedOption(value)
        onChangeFunction(value)
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
    )
}
