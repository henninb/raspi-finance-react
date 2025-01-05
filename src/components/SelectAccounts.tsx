import React, { useEffect, useState } from "react";
import Select, { SingleValue, ActionMeta } from "react-select";
import { useNavigate } from "react-router-dom";
import useFetchAccount from "./queries/useFetchAccount";

interface Account {
  accountNameOwner: string;
}

export default function SelectAccounts() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const history = useNavigate();
  const { data, isSuccess, isError } = useFetchAccount();

  // Adjust the handleChange function to accept the correct type
  const handleChange = (
    newValue: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    if (newValue) {
      history("/transactions/" + newValue.value);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      // Validate that the data structure is as expected
      const optionList = data
        .filter((account: Account) => account.accountNameOwner) // Filter out any empty or null accounts
        .map(({ accountNameOwner }: Account) => ({
          value: accountNameOwner,
          label: accountNameOwner,
        }));

      if (optionList.length > 0) {
        setOptions(optionList);
      }
    }
  }, [isSuccess, data]);

  if (isError) {
    return <div>Error fetching accounts. Please try again.</div>;
  }

  if (!isSuccess || options.length === 0) {
    return <div>No accounts available or loading...</div>;
  }

  return (
    <div className="select-formatting" data-test-id="account-name-owner-select">
      <Select
        options={options}
        onChange={handleChange}
        placeholder="Select account name owner..."
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "#9965f4",
            primary: "#ffffff",
          },
        })}
        aria-label="Select an account"
      />
    </div>
  );
}
