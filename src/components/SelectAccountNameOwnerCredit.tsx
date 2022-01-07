import React, { useEffect, useState } from "react";
import Select from "react-select";
import useFetchAccount from "./queries/useFetchAccount";

export default function SelectAccountNameOwnerCredit({
  onChangeFunction,
  currentValue,
}: any) {
  const [selectedOption, setSelectedOption] = useState(currentValue);
  const [accountTypeOptions, setAccountTypeOptions] = useState([]);

  const { data, isSuccess } = useFetchAccount();

  useEffect(() => {
    if (isSuccess) {
      const optionList = data
        .filter(({ accountType }: any) => accountType === "credit")
        .map(({ accountNameOwner }: any) => {
          return {
            value: accountNameOwner,
            label: accountNameOwner,
          };
        });

      if (optionList.length > 0) {
        setAccountTypeOptions(optionList);
      }
    }
  }, [data, isSuccess]);

  const onSelectChange = ({ value }: any) => {
    setSelectedOption(value);
    onChangeFunction(value);
  };

  return (
    <div className="select-formatting" data-testid="accounts-credit">
      <Select
        name="account-select"
        value={selectedOption}
        onChange={onSelectChange}
        options={accountTypeOptions}
        placeholder={currentValue}
      />
    </div>
  );
}
