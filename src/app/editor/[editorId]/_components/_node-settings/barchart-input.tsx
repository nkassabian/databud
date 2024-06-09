import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Select, SelectItem } from "@nextui-org/react";

import { useEditor } from "@/providers/editor-provider";
import { Input } from "postcss";
import React from "react";
import { ReactFlowInstance, getIncomers } from "reactflow";

type Props = {
  reactFlowInstance?: ReactFlowInstance;
};

const BarchartInput = ({ reactFlowInstance }: Props) => {
  const { state } = useEditor();

  let nodess = reactFlowInstance
    ?.getNodes()
    ?.filter((x) => x.id === state.editor.selectedNode.id);

  let incomers = null;

  if (nodess && nodess.length > 0) {
    const nodes = reactFlowInstance?.getNodes();
    const edges = reactFlowInstance?.getEdges();

    if (nodes && edges) {
      incomers = getIncomers(state.editor.selectedNode, nodes, edges);
    } else {
      console.error("Nodes or edges are undefined");
    }
  } else {
    console.error("No matching nodes found or getNodes returned undefined");
  }

  const onColumnChange = (value: string) => {
    state.editor.selectedNode.data.metadata.meta.fileName = value;
  };

  return (
    <>
      {incomers && incomers?.length > 0 && (
        <Accordion type="multiple">
          <AccordionItem value="Column Selection" className="px-2">
            <AccordionTrigger className="!no-underline">
              Column Selection
            </AccordionTrigger>
            <AccordionContent>
              <Select
                label="Select a column"
                onChange={(e) => onColumnChange(e.target.value)}
              >
                {state.editor.selectedNode.data.metadata.inputData?.columns?.map(
                  (field: any) => (
                    <SelectItem key={field}>{field}</SelectItem>
                  )
                )}
              </Select>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
};

export default BarchartInput;
