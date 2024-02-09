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
  varid: number;
  varref: string;
  vardesc: string;
  varstring: string;
  varabb: string;
  varnumeric: number;
}

export default function CfgIndex() {
  const loadedData = useLoaderData<typeof loader>();

  const gridRef = useRef<AgGridReact<gridInterface>>(null);

  const [colDefs, setColDefs] = useState<ColDef[]>([
    // const colDefs: ColDef[] = [
    { headerName: "ID", field: "varid", cellDataType: "number", cellClass: "font-semibold", suppressMovable: true },
    { headerName: "Ref", field: "varref", cellDataType: "text" },
    { headerName: "Description", field: "vardesc", cellDataType: "text" },
    { headerName: "String", field: "varstring", cellDataType: "text" },
    { headerName: "Abb.", field: "varabb", cellDataType: "text", cellClass: "text-center" },
    { headerName: "Numeric", field: "varnumeric", cellDataType: "number", cellClass: "text-center" },
    // ];
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
