import { useField } from "remix-validated-form";

type InputProps = {
  name: string;
  label?: string;
  readonly?: boolean;
  disabled?: boolean;
  type?: string;
  value?: string | number;
  options?: { key: number; value: string }[];
  changeFn?: React.ChangeEventHandler;
  blurFn?: React.FocusEventHandler;
  maxLength?: number;
  min?: string;
  max?: string;
  inputCSS?: string;
  labelCSS?: string;
  divCSS?: string;
};

export const FormInput = ({
  name,
  label,
  readonly,
  type,
  value,
  changeFn,
  blurFn,
  maxLength,
  min,
  max,
  disabled,
  inputCSS,
  labelCSS,
  divCSS,
}: InputProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <div>
      <div className={divCSS}>
        {label ? (
          <label htmlFor={name} className={labelCSS}>
            {label}
          </label>
        ) : null}
        <input
          {...getInputProps({
            id: name,
            type: type,
            value: value,
            readOnly: readonly,
            disabled: disabled,
            onChange: changeFn,
            onBlur: blurFn,
            maxLength: maxLength,
            min: min,
            max: max,
          })}
          className={`px-1 border outline-none focus:border-slate-700 rounded ${inputCSS} ${error ? `border-red-300` : `border-slate-300`}`}
        />
      </div>
      {/* {error && <i className="text-red-500 text-sm">{error}</i>} */}
    </div>
  );
};
