import Select from "react-select";
interface MultiSelectProps {
  options: any;
}
function MultiSelect({ options }: MultiSelectProps) {
  return (
    <Select
      options={options}
      className={`w-[93%] block mx-auto rounded-[15px]`}
      placeholder={`Attributes`}
      isMulti
      closeMenuOnSelect={false}
    />
  );
}

export default MultiSelect;
