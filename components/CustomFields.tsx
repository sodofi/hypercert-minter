"use client";
import { ISOToUNIX } from "@/actions/hypercerts";
import { useField } from "formik";

function DateField(props: any) {
  const [field, meta, helpers] = useField(props.name);
  const { value, ...rest } = field;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    let newDate = ISOToUNIX(new Date(value));
  };
  return (
    <input
      {...rest}
      {...props}
      onChange={handleChange}
      className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
    />
  );
}

export { DateField };
