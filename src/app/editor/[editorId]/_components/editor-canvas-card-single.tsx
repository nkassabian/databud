import { EditorCanvasCardType } from "@/lib/types";
import { useEditor } from "@/providers/editor-provider";
import { useEffect, useMemo, useState } from "react";
import { Position, useNodeId } from "reactflow";
import EditorCanvasIconHelper from "./editor-canvas-card-icon-hepler";
import CustomHandle from "./custom-handle";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import Barchart from "./barchart";

const EditorCanvasCardSingle = ({ data }: { data: EditorCanvasCardType }) => {
  const { dispatch, state } = useEditor();
  const nodeId = useNodeId();
  const [isSelected, setIsSelected] = useState(false);
  const logo = useMemo(() => {
    return <EditorCanvasIconHelper type={data.type} />;
  }, [data]);

  useEffect(() => {
    if (state.editor.selectedNode.id === nodeId) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
    console.log(state.editor.selectedNode);
  }, [state.editor.selectedNode.id, nodeId]);

  return (
    <>
      {data.category !== "Input" && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          const val = state.editor.elements.find((n) => n.id === nodeId);
          if (val)
            dispatch({
              type: "SELECTED_ELEMENT",
              payload: {
                element: val,
              },
            });
        }}
      >
        <Card
          className={clsx(
            "relative border-2 max-w-[400px]  p-2 bg-default-100",
            isSelected ? "border-default-300" : "border-default-100"
          )}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div>{logo}</div>
            <div>
              <p className="text-md">{data.title}</p>
              <p>
                <p className="mb-3 text-sm text-default-500">
                  {data.description}
                </p>
              </p>
            </div>
          </CardHeader>
          {data.title === "Barchart" && (
            <p className="p-0 py-2">
              <div className="h-[300px] w-full p-0">
                <Barchart data={data} />
              </div>
            </p>
          )}

          <Badge
            variant="secondary"
            className={clsx("absolute right-2 top-2 bg-default-200")}
          >
            {data.category}
          </Badge>
          <div
            className={clsx("absolute left-3 top-4 h-2 w-2 rounded-full")}
          ></div>
        </Card>
      </div>
      {data.hasOutput && (
        <CustomHandle type="source" position={Position.Bottom} id="a" />
      )}
    </>
  );
};

export default EditorCanvasCardSingle;
