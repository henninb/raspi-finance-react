import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useDescriptionInsert from "./queries/useDescriptionInsert";
import useFetchDescription from "./queries/useFetchDescription";

interface Description {
  descriptionName: string;
}

interface Props {
  onChangeFunction: (value: string | null) => void; // Accepts a string or null
  currentValue: string | null; // Represents the current value, which could be null
}

export default function SelectDescription({
  onChangeFunction,
  currentValue,
}: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>(currentValue);
  const [inputValue, setInputValue] = useState<string>("");

  const { data, isSuccess } = useFetchDescription();
  const { mutate: insertDescription } = useDescriptionInsert();

  useEffect(() => {
    if (isSuccess && data) {
      const descriptions = data.map(
        ({ descriptionName }: Description) => descriptionName
      );
      setOptions(descriptions);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab" && inputValue) {
      const filteredOptions = options.filter((option) =>
        option.includes(inputValue)
      );
      if (filteredOptions.length > 0) {
        const selectedValue = filteredOptions[0]; // Select the first match
        setValue(selectedValue);
        onChangeFunction(selectedValue);
      } else {
        setValue(inputValue);
        onChangeFunction(inputValue);
        insertDescription({ descriptionName: inputValue });
      }
    }
  };

  return (
    <div>
      <Autocomplete
        value={value || ""}
        onChange={(_event, newValue) => {
          setValue(newValue);
          onChangeFunction(newValue);
        }}
        inputValue={inputValue || ""}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        style={{ width: 140 }}
        options={options}
        renderInput={(params) => (
          <TextField {...params} onKeyDown={handleKeyDown} />
        )}
      />
    </div>
  );
}

