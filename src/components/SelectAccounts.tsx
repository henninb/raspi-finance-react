import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import useFetchAccount from "./queries/useFetchAccount";

export default function SelectAccounts() {
  const [options, setOptions] = useState([]);

  const handleChange = (selectedOption: any) => {
    history.push("/transactions/" + selectedOption.value);
    history.go(0);
  };

  const history = useHistory();
  const { data, isSuccess } = useFetchAccount();

  useEffect(() => {
    if (isSuccess) {
      let optionList: any = [];
      data.forEach((element: any) => {
        optionList = optionList.concat({
          value: element.accountNameOwner,
          label: element.accountNameOwner,
        });
      });
      if (optionList.length > 0) {
        setOptions(optionList);
      }
    }
  }, [isSuccess, data]);

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
            text: "red",
            // primary50: 'red',
            primary25: "#9965f4",
            primary: "#FFF",
          },
        })}
      />
    </div>
  );
}
