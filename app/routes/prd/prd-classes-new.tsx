import { prisma as orm } from "~/models/prisma.server";
import { useLoaderData, json } from "@remix-run/react";
import {
  useField,
  useIsSubmitting,
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ActionFunctionArgs } from "@remix-run/node";
import { ChangeEventHandler, useState } from "react";

function fetchData1() {
  return orm.variants.findMany({
    select: { var_id: true, var_str: true, var_abb: true },
    where: { varclasses: { vcs_ur: { equals: "prd_ctg" } } },
  });
}

function fetchData2() {
  const maxRef = orm.classes
    .findMany({ select: { cls_ur: true } })
    .then((res) => {
      if (res.length > 0) {
        const mappedRes = res.map((item) =>
          Number(item.cls_ur.replaceAll(/\D/g, ""))
        );
        return Math.max(...mappedRes);
      } else {
        return 1;
      }
    })

    .catch((error) => {
      console.log(error);
    });
  return maxRef;
}

export async function loader() {
  const [feed1, feed2] = await Promise.all([fetchData1(), fetchData2()]);
  return json({ feed1, feed2 });
}

type InputProps = {
  name: string;
  label?: string;
  readonly?: boolean;
  disabled?: boolean;
  type?: string;
  value?: string | number;
  options?: { key: number; value: string }[];
  changeFn?: ChangeEventHandler;
  maxLength?: number;
  min?: string;
  max?: string;
};

const validationSchema = zfd.formData({
  cls_ur: zfd.text(z.string().toUpperCase().max(12)),
  cls_type: zfd.numeric(),
  cls_type_display: zfd.text(),
  cls_sku: zfd.text(z.string().toUpperCase()),
  cls_sku_input: zfd.text(z.string().max(8, "SKU is limited to 8 Digits")),
  cls_desc: zfd.text(
    z
      .string()
      .max(150, "Max length is 150 characters")
      .min(5, "Description can not be less than 5 characters")
  ),
  cls_tags: zfd.text(z.string().optional()),
  cls_height: zfd.numeric(z.number().min(0).max(900).default(0)),
  cls_width: zfd.numeric(z.number().min(0).max(900).default(0)),
  cls_weight: zfd.numeric(z.number().min(0).max(10000).default(0)),
  cls_mft: zfd.text(z.string().optional()),
});

const cleintValidator = withZod(validationSchema);

// export async function action({ request }: ActionFunctionArgs) {
//   const result = await validator.validate(await request.formData());

//   if (result.error) {
//     console.log("validation error: ", result.error);
//     return validationError(result.error);
//   }

//   const { field1, field2 } = result.data;
//   console.log("result data: ", result.data);
//   return null;
// }

const FormInput = ({
  name,
  label,
  readonly,
  type,
  value,
  changeFn,
  maxLength,
  min,
  max,
  disabled,
}: InputProps) => {
  const { error, getInputProps } = useField(name);

  return (
    <div className="flex felx-row flex-nowrap flex-none gap-x-2 overflow-visible">
      {label ? (
        <label htmlFor={name} className="w-24">
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
          maxLength: maxLength,
          min: min,
          max: max,
        })}
        className="w-48 px-1"
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

const FormSelect = ({ name, label, value, options, changeFn }: InputProps) => {
  const { getInputProps } = useField(name);
  return (
    <div className="flex felx-row flex-nowrap flex-none gap-x-2 overflow-visible">
      <label htmlFor={name} className="w-24">
        {label}
      </label>
      <select
        {...getInputProps({ id: name, value: value, onChange: changeFn })}
        className="w-48 px-1"
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

const FormSubmit = () => {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mx-auto px-2 py-px bg-green-400 font-semibold rounded"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};

export default function PrdClassesNew() {
  const loadedData = useLoaderData<typeof loader>();
  const [ctgValue, setCtgValue] = useState(loadedData.feed1[0].var_str);
  const [skuValue, setSkuValue] = useState("");

  function getClsTypeAbb(value: string) {
    const index = loadedData.feed1.findIndex((e) => e.var_str == value);
    return loadedData.feed1[index].var_abb;
  }

  function getClsTypeID(value: string) {
    const index = loadedData.feed1.findIndex((e) => e.var_str == value);
    return loadedData.feed1[index].var_id;
  }

  return (
    <div>
      <p>Products Classes New</p>
      <div>
        <ValidatedForm validator={cleintValidator} method="post" id="cls_form">
          <div className="flex flex-col gap-y-2 max-w-96 overflow-visible">
            <FormInput
              name="cls_ur"
              label="Unique Ref:"
              type="text"
              readonly={true}
              value={"CLS" + loadedData.feed2.toString().padStart(6, "0")}
            />
            <FormInput
              name="cls_type"
              type="number"
              readonly={true}
              value={getClsTypeID(ctgValue)}
            />
            <FormSelect
              name="cls_type_display"
              label="Type:"
              options={loadedData.feed1.map((item) => {
                return { key: item.var_id, value: item.var_str };
              })}
              value={ctgValue}
              changeFn={(e) =>
                setCtgValue((e.target as HTMLInputElement).value)
              }
            />
            <FormInput
              name="cls_sku"
              label="SKU Gen:"
              type="text"
              readonly={true}
              value={getClsTypeAbb(ctgValue) + skuValue}
            />
            <FormInput
              name="cls_sku_input"
              label="SKU Input:"
              type="text"
              maxLength={8}
              changeFn={(e) =>
                setSkuValue((e.target as HTMLInputElement).value)
              }
            />
            <FormInput
              name="cls_desc"
              label="Description:"
              type="text"
              maxLength={150}
            />
            <FormInput name="cls_tags" label="Tags:" type="text" />
            <FormInput
              name="cls_height"
              label="Height:"
              type="number"
              min="0"
              max="900"
            />
            <FormInput
              name="cls_width"
              label="Width:"
              type="number"
              min="0"
              max="900"
            />
            <FormInput
              name="cls_weight"
              label="Weight:"
              type="number"
              min="0"
              max="10000"
            />
            <FormInput name="cls_mft" label="MFT:" type="number" disabled={true} />
            <FormSubmit />
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
}
