import { prisma as orm } from "~/models/prisma.server";
import { useLoaderData, json } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useIsSubmitting, ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { FormInput } from "~/components/formInput";
import { FormSelect } from "~/components/formSelect";

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
        const mappedRes = res.map((item) => Number(item.cls_ur.replaceAll(/\D/g, "")));
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

const validationSchema = zfd.formData({
  cls_ur: zfd.text(z.string().toUpperCase().max(12)),
  cls_type: zfd.numeric(),
  cls_type_display: zfd.text(),
  cls_sku: zfd.text(z.string().toUpperCase()),
  cls_sku_input: zfd.text(z.string().max(8, "SKU is limited to 8 Digits")),
  cls_desc: zfd.text(z.string().max(150, "Max length is 150 characters").min(5, "Description can not be less than 5 characters")),
  cls_tags: zfd.text(z.string().optional()),
  cls_height: zfd.numeric(z.number().min(0).max(900).default(0)),
  cls_width: zfd.numeric(z.number().min(0).max(900).default(0)),
  cls_weight: zfd.numeric(z.number().min(0).max(10000).default(0)),
  cls_mft: zfd.numeric(z.number().optional()),
});

const cleintValidator = withZod(validationSchema);

export async function loader() {
  const [feed1, feed2] = await Promise.all([fetchData1(), fetchData2()]);
  return json({ feed1, feed2 });
}

export async function action({ request }: ActionFunctionArgs) {
  const serverValidator = withZod(
    validationSchema
      .refine(
        async (data) => {
          const check_ur = await orm.classes.findUnique({ where: { cls_ur: data.cls_ur } });
          return !check_ur;
        },
        { message: "Class Unique Ref is already in the database!", path: ["cls_ur"] }
      )
      .refine(
        async (data) => {
          const check_sku = await orm.classes.findUnique({ where: { cls_sku: data.cls_sku } });
          return !check_sku;
        },
        { message: "Class SKU is already used!", path: ["cls_sku"] }
      )
  );

  const result = await serverValidator.validate(await request.formData());

  if (result.error) return validationError(result.error);

  // const {cls_ur, cls_type, cls_sku, cls_desc, cls_tags, cls_height, cls_width, cls_weight, cls_mft} = result.data

  const submitData = await orm.classes.create({
    data: {
      cls_ur: result.data.cls_ur,
      cls_type: result.data.cls_type,
      cls_sku: result.data.cls_sku,
      cls_desc: result.data.cls_desc,
      // cls_tags: result.data.cls_tags,
      cls_height: result.data.cls_height,
      cls_width: result.data.cls_width,
      cls_weight: result.data.cls_weight,
      cls_mft: result.data.cls_mft,
    },
  });

  return null;
}

const FormSubmit = () => {
  const isSubmitting = useIsSubmitting();

  return (
    <button type="submit" disabled={isSubmitting} className="mx-auto p-1 bg-slate-400 font-semibold rounded hover:bg-slate-500">
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};

export default function PrdClassesNew() {
  // const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const [ctgValue, setCtgValue] = useState(loaderData.feed1[0].var_str);
  const [skuValue, setSkuValue] = useState("");

  function getClsTypeAbb(value: string) {
    const index = loaderData.feed1.findIndex((e) => e.var_str == value);
    return loaderData.feed1[index].var_abb;
  }

  function getClsTypeID(value: string) {
    const index = loaderData.feed1.findIndex((e) => e.var_str == value);
    return loaderData.feed1[index].var_id;
  }

  return (
    <div>
      <p>Products Classes New</p>
      <div>
        <ValidatedForm validator={cleintValidator} method="post" id="cls_form">
          <div className="flex">
            <div className="flex flex-col gap-y-2 max-w-96 p-2 m-2 border-slate-600 rounded border">
              <h2 className="font-bold text-lg">Meta Data</h2>
              <FormInput
                name="cls_ur"
                label="Unique Ref:"
                type="text"
                inputCSS="ml-2 w-28"
                divCSS="flex justify-between"
                readonly={true}
                value={"CLS" + (loaderData.feed2 + 1).toString().padStart(6, "0")}
              />
              <FormInput name="cls_type" label="Type Gen:" type="number" inputCSS="ml-2 w-28" divCSS="flex justify-between" readonly={true} value={getClsTypeID(ctgValue)} />
              <FormSelect
                name="cls_type_display"
                label="Type Select:"
                inputCSS="ml-2 w-28"
                divCSS="flex justify-between"
                options={loaderData.feed1.map((item) => {
                  return { key: item.var_id, value: item.var_str };
                })}
                value={ctgValue}
                changeFn={(e) => setCtgValue((e.target as HTMLInputElement).value)}
              />
              <FormInput
                name="cls_sku"
                label="SKU Gen:"
                type="text"
                inputCSS="ml-2 w-28"
                divCSS="flex justify-between"
                readonly={true}
                value={getClsTypeAbb(ctgValue) + skuValue}
              />
              <FormInput
                name="cls_sku_input"
                label="SKU Input:"
                type="text"
                inputCSS="ml-2 w-28"
                divCSS="flex justify-between"
                maxLength={8}
                changeFn={(e) => setSkuValue((e.target as HTMLInputElement).value)}
              />
            </div>
            <div className="flex flex-col gap-y-2 max-w-96 p-2 m-2 border-slate-600 rounded border">
              <h2 className="font-bold text-lg">Data</h2>
              <FormInput name="cls_desc" label="Description:" type="text" inputCSS="ml-2 w-60" maxLength={150} divCSS="flex justify-between" />
              <FormInput name="cls_tags" label="Tags:" type="text" inputCSS="ml-2 w-60" divCSS="flex justify-between" />
              <FormInput name="cls_mft" label="MFT:" type="number" inputCSS="ml-2 w-60" divCSS="flex justify-between" disabled={true} />
            </div>
            <div className="flex flex-col gap-y-2 max-w-96 p-2 m-2 border-slate-600 rounded border">
              <h2 className="font-bold text-lg">Dimensions</h2>
              <FormInput name="cls_height" label="Height:" type="number" min="0" max="900" inputCSS="ml-2 w-24" divCSS="flex justify-between" />
              <FormInput name="cls_width" label="Width:" type="number" min="0" max="900" inputCSS="ml-2 w-24" divCSS="flex justify-between" />
              <FormInput name="cls_weight" label="Weight:" type="number" min="0" max="10000" inputCSS="ml-2 w-24" divCSS="flex justify-between" />
            </div>
          </div>
          <FormSubmit />
        </ValidatedForm>
      </div>
    </div>
  );
}
