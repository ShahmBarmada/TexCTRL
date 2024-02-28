import { prisma as orm } from "~/models/prisma.server";
import { useLoaderData, json, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { useIsSubmitting, ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { FormInput } from "~/components/formInput";
import { FormSelect } from "~/components/formSelect";

function fetch1() {
  return orm.variants.findMany({
    select: { var_id: true, var_str: true, var_abb: true },
    where: { varclasses: { vcs_ur: { equals: "prd_ctg" } } },
  });
}

function fetch2() {
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

const schemaValidator = zfd.formData({
  cls_ur: zfd.text(z.string().toUpperCase().max(12)),
  cls_type: zfd.numeric(),
  cls_sku: zfd.text(z.string().toUpperCase()),
  cls_sku_input: zfd.text(z.string().max(8, "SKU is limited to 8 Digits")),
  cls_desc: zfd.text(z.string().max(150, "Max length is 150 characters").min(5, "Description can not be less than 5 characters")),
  cls_tags: zfd.text(z.string().optional()),
  cls_height: zfd.numeric(z.number().min(0).max(900).default(0)),
  cls_width: zfd.numeric(z.number().min(0).max(900).default(0)),
  cls_weight: zfd.numeric(z.number().min(0).max(10000).default(0)),
  cls_mft: zfd.numeric(z.number().optional()),
});
const clientValidator = withZod(schemaValidator);

export async function loader() {
  const [feed1, feed2] = await Promise.all([fetch1(), fetch2()]);
  return json({ feed1, feed2 });
}

export async function action({ request }: ActionFunctionArgs) {
  const serverValidator = withZod(
    schemaValidator
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

  await orm.classes.create({
    data: {
      cls_ur: result.data.cls_ur,
      cls_type: result.data.cls_type,
      cls_sku: result.data.cls_sku,
      cls_desc: result.data.cls_desc,
      cls_tags: result.data.cls_tags
        ?.split("-")
        .map((item) => item.trim())
        .filter((item) => item.trim().length > 0),
      cls_height: result.data.cls_height,
      cls_width: result.data.cls_width,
      cls_weight: result.data.cls_weight,
      cls_mft: result.data.cls_mft,
    },
  });

  return redirect(`/dashboard/products/classes/${result.data.cls_ur}`);
}

const FormSubmit = () => {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="mx-auto p-1 bg-slate-400 font-semibold rounded hover:bg-slate-500"
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};

export default function PrdClassesNew() {
  const feed = useLoaderData<typeof loader>();
  const resp = useActionData<typeof action>();
  const [ctgValue, setCtgValue] = useState(feed.feed1[0].var_str);
  const [skuValue, setSkuValue] = useState("");

  console.log(resp?.fieldErrors)

  function getClsTypeAbb(value: string) {
    const index = feed.feed1.findIndex((e) => e.var_str == value);
    return feed.feed1[index].var_abb;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="font-bold text-xl">New Class Card:</h1>
      <ValidatedForm validator={clientValidator} method="post" id="cls_form">
        <div className="flex flex-col gap-y-2 max-w-fit">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2 p-2 border-slate-600 rounded border">
              <h2 className="font-bold text-lg">Meta Data</h2>
              <FormInput
                name="cls_ur"
                label="Unique Ref:"
                type="text"
                inputCSS="ml-2 w-[136px] bg-gray-200"
                divCSS="flex justify-between"
                readonly={true}
                value={"CLS" + (feed.feed2 + 1).toString().padStart(6, "0")}
              />
              <FormSelect
                name="cls_type"
                label="Type:"
                inputCSS="ml-2 w-[136px]"
                divCSS="flex justify-between"
                options={feed.feed1.map((item) => {
                  return { key: item.var_id, value: item.var_str };
                })}
                value={ctgValue}
                changeFn={(e) => setCtgValue((e.target as HTMLInputElement).value)}
              />
              <div className="flex justify-end">
                <p className="mr-auto">SKU:</p>
                <FormInput name="cls_sku" type="hidden" readonly={true} value={getClsTypeAbb(ctgValue) + skuValue} />
                <FormInput
                  name="cls_sku_ext"
                  type="text"
                  inputCSS="ml-2 rounded-r-none w-10 bg-gray-200"
                  divCSS="flex justify-between"
                  readonly={true}
                  value={getClsTypeAbb(ctgValue)}
                />
                <FormInput
                  name="cls_sku_input"
                  type="text"
                  inputCSS="rounded-l-none w-24"
                  divCSS="flex justify-between"
                  maxLength={8}
                  changeFn={(e) => setSkuValue((e.target as HTMLInputElement).value)}
                />
              </div>
              <p className="text-justify text-sm mt-auto">SKU extinsion is auto-generated based on class type</p>
            </div>
            <div className="flex flex-col gap-y-2 p-2 border-slate-600 rounded border">
              <h2 className="font-bold text-lg">Data</h2>
              <FormInput
                name="cls_desc"
                label="Description:"
                type="text"
                inputCSS="ml-2 w-60"
                maxLength={150}
                divCSS="flex justify-between"
              />
              <FormInput name="cls_tags" label="Tags:" type="text" inputCSS="ml-2 w-60" divCSS="flex justify-between" />
              <FormInput
                name="cls_mft"
                label="MFT:"
                type="number"
                inputCSS="ml-2 w-60"
                divCSS="flex justify-between"
                disabled={true}
              />
              <p className="text-justify text-sm mt-auto">
                Seperate tags by using &quot; - &quot; (dash)
                <br />
                Description is limited to 150 chars
              </p>
            </div>
            <div className="flex flex-col gap-y-2 p-2 border-slate-600 rounded border">
              <h2 className="font-bold text-lg">Dimensions</h2>
              <div className="flex justify-end">
                <p className="mr-auto">Height x Width:</p>
                <FormInput
                  name="cls_height"
                  type="number"
                  min="0"
                  max="900"
                  inputCSS="ml-2 w-20"
                  divCSS="flex justify-between"
                />
                <FormInput
                  name="cls_width"
                  type="number"
                  min="0"
                  max="900"
                  inputCSS="ml-2 w-20"
                  divCSS="flex justify-between"
                />
              </div>
              <div className="flex justify-between">
                <p>Weight:</p>
                <div className="flex bg-white border rounded">
                  <p className="px-1 bg-gray-200">gram</p>
              <FormInput
                name="cls_weight"
                type="number"
                min="0"
                max="10000"
                inputCSS="w-20"
                divCSS="flex justify-between"
              /></div></div>
              <p className="text-justify text-sm mt-auto">Input values in Centimeter, defaults are Zero</p>
            </div>
          </div>
          <div className="self-end">
            <FormSubmit />
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
