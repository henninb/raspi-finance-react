import React, { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

interface Props {
  onChangeFunction: any;
  currentValue: any;
}

export default function SelectTransactionState({
  onChangeFunction,
  currentValue,
}: Props) {
  const [value, setValue] = useState(currentValue);
  const [inputValue, setInputValue] = useState("undefined");
  const [keyPressValue, setKeyPressValue] = useState("undefined");

  const options = ["future", "outstanding", "cleared"];

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      let filteredOptions = options.filter((state) =>
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
        defaultValue={value ? value : "undefined"}
        value={value ? value : "undefined"}
        onChange={(_event, newValue) => {
          console.log(`onChange newValue: '${newValue}'`);
          setValue(newValue);
          onChangeFunction(newValue);
        }}
        inputValue={inputValue || "undefined"}
        onInputChange={(_event, newInputValue) => {
          if (keyPressValue === "undefined") {
            setInputValue(newInputValue);
          } else {
            setInputValue(keyPressValue);
            setKeyPressValue("undefined");
          }
        }}
        style={{ width: 140 }}
        options={options}
        renderInput={(params) => {
          return <TextField {...params} onKeyDown={(e) => handleKeyDown(e)} />;
        }}
      />
    </div>
  );
}
