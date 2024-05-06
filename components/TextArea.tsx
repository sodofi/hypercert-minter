import { MyMetadata } from "@/actions/hypercerts";

interface TextAreaProps {
  name: string;
  displayText: string;
  setDisplayText: React.Dispatch<React.SetStateAction<string>>;
  setStoredValues: React.Dispatch<React.SetStateAction<string[]>>;
  formValues: MyMetadata;
  setFormValues: React.Dispatch<React.SetStateAction<MyMetadata>>;
  label: string;
  required?: boolean;
  placeolder?: string;
}

function TextArea({
  name,
  label,
  displayText,
  setDisplayText,
  setStoredValues,
  formValues,
  required,
  placeolder,
  setFormValues,
}: TextAreaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = event.target;
    setDisplayText(value);
    const SplitedWords = value.split(",");
    const newSplitedWords = SplitedWords.map((word) => word.trim());
    setStoredValues(newSplitedWords);
    console.log(newSplitedWords);
    setFormValues({
      ...formValues,
      [name]: newSplitedWords,
    });
  };
  return (
    <fieldset className={`w-[100%]`}>
      <label
        htmlFor={name}
        className={`text-white font-bold text-[16px] block mb-1`}
      >
        {label}
      </label>
      <textarea
        name={name}
        value={displayText}
        required={required}
        id={name}
        placeholder={placeolder}
        onChange={handleChange}
        className={`w-[100%] h-[150px] ps-2 bg-white/50 peer placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
      />
      <p className={`text-red-600 italic invisible peer-required:visible`}>*</p>
    </fieldset>
  );
}

export default TextArea;

export function convertArrayToDisplayText(wordArray: any[]) {
  return wordArray.join(", ");
}
