import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

interface Props {
  newAccountType: any;
  onChangeFunction: any;
  currentValue: any;
}

export default function SelectReoccurringType({
  newAccountType,
  onChangeFunction,
  currentValue,
}: Props) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(currentValue);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accountType, setAccountType] = useState(newAccountType);
  const [inputValue, setInputValue] = useState("");
  const [keyPressValue, setKeyPressValue] = useState("");

  useEffect(() => {
    // @ts-ignore
    const debitOptions: any = ["fortnightly", "monthly", "onetime"];
    const creditOptions: any = [
      "annually",
      "biannually",
      "fortnightly",
      "monthly",
      "quarterly",
      "onetime",
    ];
    if (accountType === "debit") {
      setOptions(debitOptions);
    } else {
      setOptions(creditOptions);
    }
  }, [accountType, currentValue, inputValue, value]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      // @ts-ignore
      const filteredOptions = options.filter((state: any) =>
        state.includes(inputValue),
      );
      if (filteredOptions.length > 0) {
        return filteredOptions.find((state) => {
          setKeyPressValue(state);
          onChangeFunction(state);
          return state;
        });
      } else {
        setKeyPressValue("undefined");
        onChangeFunction(inputValue);
        return inputValue;
      }
    }
  };

  return (
    <div>
      <Autocomplete
        value={value || ""}
        // defaultValue={value || ''}
        onChange={(_event, newValue) => {
          setValue(newValue);
          onChangeFunction(newValue);
        }}
        inputValue={inputValue || ""}
        onInputChange={(_event, newInputValue) => {
          if (keyPressValue === "") {
            setInputValue(newInputValue);
          } else {
            setInputValue(keyPressValue);
            setKeyPressValue("");
          }
        }}
        style={{ width: 140 }}
        options={options}
        renderInput={(params) => (
          <TextField {...params} onKeyDown={(e) => handleKeyDown(e)} />
        )}
      />
    </div>
  );
}
