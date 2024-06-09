import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEditor } from "@/providers/editor-provider";
import React from "react";
import { ReactFlowInstance } from "reactflow";
import Papa from "papaparse";
import { result } from "lodash";

type Props = {
  reactFlowInstance?: ReactFlowInstance;
};

const CSVInputSettigns = (props: Props) => {
  const { dispatch, state } = useEditor();

  function inferDataType(value: any) {
    if (!isNaN(Number(value))) {
      return "number";
    } else if (
      value.toLowerCase() === "true" ||
      value.toLowerCase() === "false" ||
      value.toLowerCase() === "yes" ||
      value.toLowerCase() === "no"
    ) {
      return "boolean";
    } else if (Date.parse(value)) {
      return "date";
    } else {
      return "string";
    }
  }

  // function determineColumnTypes(csvData: any) {
  //   const columnTypes = {};
  //   const rows = csvData.data;
  //   const columnNames = Object.keys(rows[0]);

  //   // Initialize column types
  //   columnNames.forEach((column) => {
  //     columnTypes[column] = "string"; // Default type
  //   });

  //   rows.forEach((row) => {
  //     columnNames.forEach((column) => {
  //       const value = row[column];
  //       const inferredType = inferDataType(value);

  //       // Upgrade type if necessary
  //       if (columnTypes[column] === "string" && inferredType !== "string") {
  //         columnTypes[column] = inferredType;
  //       } else if (
  //         columnTypes[column] === "boolean" &&
  //         inferredType === "number"
  //       ) {
  //         columnTypes[column] = "number";
  //       }
  //     });
  //   });

  //   return columnTypes;
  // }

  const changeHandler = (event: any) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results: any) {
        if (
          state.editor.selectedNode.data.metadata.inputData.data.length === 0
        ) {
          state.editor.selectedNode.data.metadata.meta.fileName =
            event.target.files[0].name;
          state.editor.selectedNode.data.metadata.meta.rowCount =
            results.data.length;
          state.editor.selectedNode.data.metadata.inputData.data = results.data;

          state.editor.selectedNode.data.metadata.outputData.data =
            results.data;

          state.editor.selectedNode.data.metadata.outputData.columns =
            results.meta.fields;

          state.editor.selectedNode.data.metadata.inputData.columns =
            results.meta.fields;
        }
      },
    });
  };

  return (
    <>
      <Accordion type="multiple">
        <AccordionItem value="Expected Output" className="px-2">
          <AccordionTrigger className="!no-underline">Action</AccordionTrigger>
          <AccordionContent>
            {state.editor.selectedNode.data.metadata.inputData.data.length ===
              0 && (
              <input type="file" accept=".csv" onChange={changeHandler}></input>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="multiple">
        <AccordionItem value="Expected Output" className="px-2">
          <AccordionTrigger className="!no-underline">
            File Details
          </AccordionTrigger>
          <AccordionContent className="text-xs ">
            {!state.editor.selectedNode.data.metadata?.meta && (
              <>
                <p>
                  <span className="font-bold">Filename: </span>
                  {state.editor.selectedNode.data.metadata?.meta?.fileName}
                </p>
                <p className="font-bold">Fields: </p>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default CSVInputSettigns;
