import {
  useField,
  useIsSubmitting,
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ActionFunctionArgs } from "@remix-run/node";

type InputProps = {
  name: string;
  label: string;
};

export const validator = withZod(
  z.object({
    field1: z.string().min(1, { message: "field 1 is required" }),
    field2: z.string().min(1, { message: "field 2 is required" }),
  })
);

export const InputComponent = ({ name, label }: InputProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input {...getInputProps({ id: name })} />
      {error && <span>{error}</span>}
    </div>
  );
};

export const SubmitComponent = () => {
  const isSubmitting = useIsSubmitting();

  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};

export async function action({ request }: ActionFunctionArgs) {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    console.log("validation error: ", result.error);
    return validationError(result.error);
  }

  const { field1, field2 } = result.data;
  console.log("result data: ", result.data);
  return null;
}

export default function PrdClassesNew() {
  return (
    <div>
      <p>Products Classes New</p>
      <div>
        <ValidatedForm validator={validator} method="post">
          <InputComponent name="field1" label="field 1 label" />
          <InputComponent name="field2" label="field 2 label" />
          <SubmitComponent />
        </ValidatedForm>
      </div>
    </div>
  );
}
