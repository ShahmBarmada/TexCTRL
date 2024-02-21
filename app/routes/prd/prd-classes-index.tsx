import { prisma as orm } from "~/models/prisma.server";
import { useCallback, useRef, useState } from "react";
import { useLoaderData, json } from "@remix-run/react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export async function loader() {
  const dataFeed = await orm.classes.findMany();
  return json(dataFeed);
}

export interface gridInterface {
  cls_id: number,
  cls_ur: string,
  cls_type: string,
  cls_sku: string,
  cls_desc: string,
  cls_tags: string,
  cls_height: number,
  cls_width: number,
  cls_weight: number,
  cls_mft: string,
}

export default function PrdClassesIndex() {
  const loadedData = useLoaderData<typeof loader>();
  const gridRef = useRef<AgGridReact<gridInterface>>(null);
  const [colDefs] = useState<ColDef[]>([
    { headerName: "ID", field: "cls_id", cellDataType: "number", cellClass: "font-semibold", suppressMovable: true },
    { headerName: "Ref", field: "cls_ur", cellDataType: "text" },
    { headerName: "Type", field: "cls_type", cellDataType: "text" },
    { headerName: "SKU", field: "cls_sku", cellDataType: "text" },
    { headerName: "Description", field: "cls_desc", cellDataType: "text" },
    { headerName: "Tags", field: "cls_tags", cellDataType: "text" },
    { headerName: "Height", field: "cls_height", cellDataType: "number", cellClass: "text-center" },
    { headerName: "Width", field: "cls_width", cellDataType: "number", cellClass: "text-center" },
    { headerName: "Weight", field: "cls_weight", cellDataType: "number", cellClass: "text-center" },
    { headerName: "MFT", field: "cls_mft", cellDataType: "text" },
  ]);

  const onGridRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
    gridRef.current?.api.autoSizeAllColumns();
  }, []);

  return (
    <div>
      <h1>Products Classes Index</h1>
      <div className="ag-theme-quartz h-[90vh] w-full">
        <AgGridReact
          ref={gridRef}
          columnDefs={colDefs}
          rowData={loadedData}
          onFirstDataRendered={onGridRendered}
        />
      </div>
    </div>
  );
}