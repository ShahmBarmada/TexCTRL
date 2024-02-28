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
  var_cls: number;
  var_str: string;
  var_abb: string;
  var_num: number;
}

export default function CfgIndex() {
  const loadedData = useLoaderData<typeof loader>();

  const gridRef = useRef<AgGridReact<gridInterface>>(null);

  const [colDefs, setColDefs] = useState<ColDef[]>([
    { headerName: "ID", field: "var_id", cellDataType: "number", cellClass: "font-semibold", suppressMovable: true },
    { headerName: "Ref", field: "var_cls", cellDataType: "number" },
    { headerName: "String", field: "var_str", cellDataType: "text" },
    { headerName: "Abb.", field: "var_abb", cellDataType: "text", cellClass: "text-center" },
    { headerName: "Numeric", field: "var_num", cellDataType: "number", cellClass: "text-center" },
  ]);

  const onGridRendered = useCallback(() => {
    gridRef.current!.api.sizeColumnsToFit();
    // gridRef.current!.api.autoSizeAllColumns();
  }, []);

  const exportGridData = useCallback(() => {
    const result = [];
    const csv = gridRef.current!.api.getDataAsCsv({ suppressQuotes: true });

    if (csv !== undefined) {
      const lines = csv.split("\r\n");
      const keys = lines[0].split(",");
      const obj = {}

      for (let i = 1; i < lines.length; i++) {
        if (lines[i] == undefined || lines[i].trim() == "") {
          continue;
        }
        const values = lines[i].split(",");
        for (let j = 0; j < values.length; j++) {
          obj[keys[j].trim()] = values[j];
        }
        result.push(obj);
      }
      console.log(result)
      // return result;
    }
  }, []);

  const getColumns = useCallback(() => {
    const test = gridRef.current.api.getColumns()
    console.log(test[0].getUserProvidedColDef()?.field)
  }, [])

  return (
    <div>
      <h1>Configs Index</h1>
      <p><button onClick={exportGridData}>Export Data</button></p>
      <p><button onClick={getColumns}>Export Columns</button></p>
      <div className="ag-theme-quartz h-[90vh] w-[40vw]">
        <AgGridReact ref={gridRef} columnDefs={colDefs} rowData={loadedData} onFirstDataRendered={onGridRendered} rowSelection="multiple" />
      </div>
    </div>
  );
}
