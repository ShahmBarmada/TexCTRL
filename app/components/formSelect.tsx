import { ChangeEventHandler } from "react";
import { useField } from "remix-validated-form";

type InputProps = {
  name: string;
  label?: string;
  readonly?: boolean;
  disabled?: boolean;
  type?: string;
  value?: string | number;
  options?: { key: number; value: string }[];
  changeFn?: ChangeEventHandler;
  inputCSS?: string;
  labelCSS?: string;
  divCSS?: string;
};

export const FormSelect = ({
  name,
  label,
  value,
  options,
  changeFn,
  inputCSS,
  divCSS,
  labelCSS,
  disabled,
}: InputProps) => {
  const { getInputProps } = useField(name);
  return (
    <div className={divCSS}>
      <label htmlFor={name} className={labelCSS}>
        {label}
      </label>
      <select
        {...getInputProps({ id: name, value: value, onChange: changeFn, disabled: disabled })}
        className={`border border-slate-300 outline-none rounded focus:border-slate-700 ${inputCSS}`}
      >
        {options?.map((item) => {
          return (
            <option key={item.key} value={item.value}>
              {item.value}
            </option>
          );
        })}
      </select>
    </div>
  );
};
