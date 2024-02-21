import { prisma as orm } from "~/models/prisma.server";
import { useCallback, useRef, useState } from "react";
import { useLoaderData, json } from "@remix-run/react";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export async function loader() {
  const dataFeed = await orm.variants.findMany();
  return json(dataFeed);
}

export interface gridInterface {
  var_id: number;
  var_cls: string;
  var_str: string;
  var_abb: string;
  var_num: number;
}

export default function CfgIndex() {
  const loadedData = useLoaderData<typeof loader>();

  const gridRef = useRef<AgGridReact<gridInterface>>(null);

  const [colDefs, setColDefs] = useState<ColDef[]>([
    { headerName: "ID", field: "var_id", cellDataType: "number", cellClass: "font-semibold", suppressMovable: true },
    { headerName: "Ref", field: "var_cls", cellDataType: "text" },
    { headerName: "String", field: "var_str", cellDataType: "text" },
    { headerName: "Abb.", field: "var_abb", cellDataType: "text", cellClass: "text-center" },
    { headerName: "Numeric", field: "var_num", cellDataType: "number", cellClass: "text-center" },
  ]);

  const onGridRendered = useCallback(() => {
    gridRef.current?.api.sizeColumnsToFit();
    gridRef.current?.api.autoSizeAllColumns();
  }, []);

  return (
    <div>
      <h1>Configs Index</h1>
      <div className="ag-theme-quartz h-[90vh] w-[40vw]">
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
