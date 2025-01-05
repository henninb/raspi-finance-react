import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import useFetchAccount from "./queries/useFetchAccount";

export type Props = {
  onChangeFunction: (value: string) => void;
  currentValue: string;
};

type OptionType = {
  value: string;
  label: string;
}

export default function SelectAccountNameOwnerDebit({
  onChangeFunction,
  currentValue,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);
  const [accountTypeOptions, setAccountTypeOptions] = useState<{ value: string; label: string }[]>([]);

  const { data, isSuccess } = useFetchAccount();

  useEffect(() => {
    if (isSuccess) {
      const optionList: OptionType[] = data
        .filter(({ accountType }: any) => accountType === "debit")
        .map(({ accountNameOwner }: any) => ({
          value: accountNameOwner,
          label: accountNameOwner,
        }));

      setAccountTypeOptions(optionList);

      // Pre-select the currentValue if it exists in the options
      const initialOption = optionList.find((option: OptionType) => option.value === currentValue);
      setSelectedOption(initialOption || null);
    }
  }, [data, isSuccess, currentValue]);

  const onSelectChange = (option: SingleValue<OptionType>) => {
    setSelectedOption(option);
    onChangeFunction(option?.value || ""); // Pass the value or an empty string
  };

  return (
    <div className="select-formatting" data-testid="accounts-debit">
      <Select
        name="account-select"
        value={selectedOption} // Pass the selected option object
        onChange={onSelectChange}
        options={accountTypeOptions} // Provide the options
        placeholder="Select an account" // Updated placeholder
        isClearable
      />
    </div>
  );
}
