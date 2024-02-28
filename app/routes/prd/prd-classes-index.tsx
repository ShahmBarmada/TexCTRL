import { prisma as orm } from "~/models/prisma.server";
import { useCallback, useRef, useState } from "react";
import { Link, useLoaderData, json, redirect, useNavigate } from "@remix-run/react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export async function loader() {
  const feed = await orm.classes.findMany();
  return json(feed);
}

export interface gridInterface {
  cls_id: number;
  cls_ur: string;
  cls_type: string;
  cls_sku: string;
  cls_desc: string;
  cls_tags: string;
  cls_height: number;
  cls_width: number;
  cls_weight: number;
  cls_mft: string;
}

export default function PrdClassesIndex() {
  const feed = useLoaderData<typeof loader>();
  const gridRef = useRef<AgGridReact<gridInterface>>(null);
  const navigate = useNavigate();

  const [colDefs] = useState<ColDef[]>([
    {
      headerName: "ID",
      field: "cls_id",
      cellDataType: "number",
      maxWidth: 96,
      cellClass: "font-semibold",
      suppressMovable: true,
    },
    {
      headerName: "Ref",
      field: "cls_ur",
      cellDataType: "text",
      maxWidth: 112,
      cellStyle: { cursor: "pointer" },
      onCellClicked: (e) => {
        navigate(`/dashboard/products/classes/${e.value}`);
      },
    },
    {
      headerName: "Type",
      field: "cls_type",
      cellDataType: "text",
      maxWidth: 112,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ["apply", "reset"] },
    },
    {
      headerName: "SKU",
      field: "cls_sku",
      cellDataType: "text",
      maxWidth: 112,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ["apply", "reset"] },
    },
    {
      headerName: "Description",
      field: "cls_desc",
      cellDataType: "text",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ["apply", "reset"] },
    },
    {
      headerName: "Tags",
      field: "cls_tags",
      cellDataType: "text",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ["apply", "reset"] },
    },
    { headerName: "Height", field: "cls_height", cellDataType: "number", maxWidth: 96, cellClass: "text-center" },
    { headerName: "Width", field: "cls_width", cellDataType: "number", maxWidth: 96, cellClass: "text-center" },
    { headerName: "Weight", field: "cls_weight", cellDataType: "number", maxWidth: 96, cellClass: "text-center" },
    { headerName: "MFT", field: "cls_mft", cellDataType: "text" },
  ]);

  const onGridRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
    // gridRef.current?.api.autoSizeAllColumns();
  }, []);

  return (
    <div className="flex flex-col gap-y-2 basis-full">
      <div className="flex justify-between grow-0">
        <h1 className="font-bold text-lg">Classes Index:</h1>
        <div className="flex gap-x-2 mx-4">
          <Link to="new" className="py-1 px-2 bg-slate-400 font-semibold rounded hover:bg-slate-500">
            New
          </Link>
        </div>
      </div>
      <div className="ag-theme-quartz grow">
        <AgGridReact ref={gridRef} columnDefs={colDefs} rowData={feed} onFirstDataRendered={onGridRendered} />
      </div>
    </div>
  );
}
