import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useDescriptionInsert from "./queries/useDescriptionInsert";
import useFetchDescription from "./queries/useFetchDescription";

interface Props {
  onChangeFunction: any;
  currentValue: any;
}

export default function SelectDescription({
  onChangeFunction,
  currentValue,
}: Props) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(currentValue);
  const [inputValue, setInputValue] = useState("");
  const [keyPressValue, setKeyPressValue] = useState("");

  const { data, isSuccess } = useFetchDescription();
  const { mutate: insertDescription } = useDescriptionInsert();

  useEffect(() => {
    if (isSuccess) {
      const descriptions = data.map(
        ({ descriptionName }: any) => descriptionName,
      );
      setOptions(descriptions);
    }
  }, [value, data, currentValue, inputValue, isSuccess]);

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
        setKeyPressValue(inputValue);
        onChangeFunction(inputValue);
        // @ts-ignore
        insertDescription({ descriptionName: inputValue });
        //let response = postDescription(inputValue)
        //console.log(response);
        return inputValue;
      }
    }
  };

  return (
    <div>
      <Autocomplete
        value={value || ""}
        defaultValue={value || ""}
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
          <TextField
            {...params}
            value={""}
            onKeyDown={(e) => handleKeyDown(e)}
          />
        )}
      />
    </div>
  );
}
