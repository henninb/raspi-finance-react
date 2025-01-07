import React, { useEffect, useState, KeyboardEvent } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import useFetchCategory from "./queries/useFetchCategory";

// Define the category type
interface Category {
  categoryName: string;
}

interface Props {
  onChangeFunction: (value: string) => void; // specify the type of the onChange function
  currentValue: string;
}

export default function SelectCategory({
  onChangeFunction,
  currentValue,
}: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [value, setValue] = useState<string>(currentValue);
  const [inputValue, setInputValue] = useState<string>("");
  const [keyPressValue, setKeyPressValue] = useState<string>("");

  const { data, isSuccess, isError } = useFetchCategory();

  // Handling API response and populating the options
  useEffect(() => {
    if (isSuccess && Array.isArray(data)) {
      const categories = data
        .filter((category: Category) => category.categoryName)
        .map(({ categoryName }: Category) => categoryName);
      setOptions(categories);
    }
  }, [data, isSuccess]);

  // Error handling
  if (isError) {
    return <div>Error fetching categories. Please try again later.</div>;
  }

  // Key down handler with type for event
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      const filteredOptions = options.filter((option) =>
        option.includes(inputValue)
      );
      if (filteredOptions.length > 0) {
        const selectedOption = filteredOptions[0]; // Select the first match
        setKeyPressValue(selectedOption);
        onChangeFunction(selectedOption);
      } else {
        setKeyPressValue(inputValue);
        onChangeFunction(inputValue);
      }
    }
  };

  return (
    <div>
      <Autocomplete
        value={value || ""}
        onChange={(_event, newValue) => {
          setValue(newValue || "");
          onChangeFunction(newValue || "");
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
          <TextField {...params} onKeyDown={handleKeyDown} />
        )}
      />
    </div>
  );
}