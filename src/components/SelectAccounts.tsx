import React, { useEffect, useState } from "react";
import Select, { SingleValue, ActionMeta } from "react-select";
import { useNavigate } from "react-router-dom";
import useFetchAccount from "./queries/useFetchAccount";

interface Account {
  accountNameOwner: string;
}

interface Option {
  value: string;
  label: string;
}

export default function SelectAccounts() {
  const [options, setOptions] = useState<Option[]>([]);
  const navigate = useNavigate();
  const { data, isSuccess, isError, error } = useFetchAccount();

  const handleChange = (
    newValue: SingleValue<Option>,
    _actionMeta: ActionMeta<Option>
  ) => {
    if (newValue) {
      navigate(`/transactions/${newValue.value}`);
    }
  };

  useEffect(() => {
    if (isSuccess && Array.isArray(data)) {
      const optionList = data
        .filter((account: Account) => typeof account.accountNameOwner === "string" && account.accountNameOwner.trim() !== "")
        .map(({ accountNameOwner }: Account) => ({
          value: accountNameOwner,
          label: accountNameOwner,
        }));

      setOptions(optionList);
    }
  }, [isSuccess, data]);

  if (isError) {
    return (
      <div className="error-message">
        <p>Error fetching accounts. Please try again.</p>
        <pre>{JSON.stringify(error, null, 2)}</pre> {/* Display error details if available */}
      </div>
    );
  }

  if (!isSuccess || options.length === 0) {
    return <div>Loading accounts or no accounts available...</div>;
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

