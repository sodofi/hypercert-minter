"use client";

import Select from "react-select";
interface MultiSelectProps {
  options: any;
  placeholder: string;
  multi?: boolean;
  id: string;
  disabled: boolean;
  handleChange: (inputId: any) => void;
}
function DSelect({
  options,
  placeholder,
  multi,
  handleChange,
  id,
  disabled,
}: MultiSelectProps) {
  return (
    <Select
      inputId={id}
      name={id}
      isDisabled={disabled}
      options={options}
      isSearchable={false}
      onChange={handleChange}
      styles={{
        container: () => ({
          width: "100%",
          position: "relative",
        }),
        menuList: () => ({
          width: "100%",
          position: "absolute",
          backgroundColor: "white",
          color: "black",
        }),
        multiValueRemove: () => ({
          color: "black",
        }),
        //@ts-ignore
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "white",
          ":focus": {
            outline: "hidden",
          },
        }),
        //@ts-ignore
        singleValue: (baseStyles, state) => ({
          ...baseStyles,
          color: "black",
        }),
      }}
      placeholder={placeholder}
      closeMenuOnSelect={!multi}
      isMulti={multi}
    />
  );
}

export default DSelect;
