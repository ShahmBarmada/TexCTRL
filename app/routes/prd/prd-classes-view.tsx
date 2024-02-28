import { prisma as orm } from "~/models/prisma.server";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FormInput } from "~/components/formInput";
import { FormSelect } from "~/components/formSelect";
import { ValidatedForm } from "remix-validated-form";
import { useState } from "react";

// export async function loader({ params }) {
//   const data = await orm.classes.findUnique
// }

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const clsCategories = await orm.variants.findMany({
    select: { var_id: true, var_str: true, var_abb: true },
    where: { varclasses: { vcs_ur: { equals: "prd_ctg" } } },
  });
  const clsData = await orm.classes.findUnique({ where: { cls_ur: params.clsref } });
  const clsProducts = await orm.products.findMany({ where: { prd_cls: clsData?.cls_id } });
  return json({ clsCategories, clsData, clsProducts });
};

export default function PrdClassesView() {
  const feed = useLoaderData<typeof loader>();
  const [ctgValue, setCtgValue] = useState(feed.clsData?.cls_type);
  const [skuValue, setSkuValue] = useState(feed.clsData?.cls_sku.substring(2));
  const [desc, setDesc] = useState(feed.clsData?.cls_desc)
  const [tags, setTags] = useState(feed.clsData?.cls_tags)

  function getClsTypeAbb(value: string) {
    const index = feed.clsCategories.findIndex((e) => e.var_str == value);
    return feed.clsCategories[index].var_abb;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">{`Product Class: ${feed.clsData?.cls_ur} - ${feed.clsData?.cls_sku}`}</h1>
      <ValidatedForm id="cls_form">
        <FormSelect
          name="cls_type"
          label="Type:"
          inputCSS="ml-2 w-24"
          // divCSS="flex justify-between"
          options={feed.clsCategories.map((item) => {
            return { key: item.var_id, value: item.var_str };
          })}
          value={ctgValue}
          changeFn={(e) => setCtgValue((e.target as HTMLInputElement).value)}
          disabled={true}
        />
        <div className="flex">
          <p>SKU:</p>
          <FormInput name="cls_sku" type="hidden" readonly={true} value={getClsTypeAbb(ctgValue) + skuValue} />
          <FormInput
            name="cls_sku_ext"
            value={getClsTypeAbb(ctgValue)}
            inputCSS="rounded-r-none w-10 ml-2"
            readonly={true}
            type="text"
          />
          <FormInput
            name="cls_sku_input"
            value={skuValue}
            changeFn={(e) => setSkuValue((e.target as HTMLInputElement).value)}
            maxLength={8}
            inputCSS="rounded-l-none w-24"
            readonly={true}
            type="text"
          />
        </div>
      </ValidatedForm>
    </div>
  );
}
