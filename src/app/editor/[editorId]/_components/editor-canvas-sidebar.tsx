"use client";
import { EditorCanvasTypes, EditorNodeType } from "@/lib/types";
import { useEditor } from "@/providers/editor-provider";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { onDragStart } from "@/lib/editor-utils";
import EditorCanvasIconHelper from "./editor-canvas-card-icon-hepler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorCanvasDefaultCardTypes } from "@/lib/constants";
import { ReactFlowInstance, getIncomers } from "reactflow";
// import NodeSettings from "./node-settings";
import Papa from "papaparse";
import NodeSettings from "./node-settings";

import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Blocks, Settings } from "lucide-react";

type Props = {
  nodes: EditorNodeType[];
  reactFlowInstance?: ReactFlowInstance;
};

const EditorCanvasSidebar = ({ nodes, reactFlowInstance }: Props) => {
  const { dispatch, state } = useEditor();

  return (
    <aside>
      <div className="flex flex-col m-3">
        <Tabs aria-label="Options">
          <Tab
            key="nodes"
            title={
              <div className="flex items-center space-x-2">
                <Blocks />
                <span>Nodes</span>
              </div>
            }
          >
            {Object.entries(EditorCanvasDefaultCardTypes)
              .filter(
                ([_, cardType]) =>
                  (!nodes.length && cardType.category === "Input") ||
                  (nodes.length && cardType.category !== "Input")
              )
              .map(([cardKey, cardValue]) => (
                <Card
                  key={cardKey}
                  draggable
                  className="w-full cursor-grab my-2 bg-default-100 overflow-hidden"
                  onDragStart={(event) =>
                    onDragStart(event, cardKey as EditorCanvasTypes)
                  }
                  radius="sm"
                  shadow="sm"
                >
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <EditorCanvasIconHelper
                      type={cardKey as EditorCanvasTypes}
                    />
                    <div className="flex flex-col">
                      {cardKey}
                      <p className="text-small text-default-500">
                        {cardValue.description}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </Tab>
          <Tab
            key="settings"
            isDisabled={state.editor.selectedNode.id == ""}
            title={
              <div className="flex items-center space-x-2">
                <Settings />
                <span>Settings</span>
              </div>
            }
          >
            <div className="px-2 py-4 text-center text-xl font-bold">
              {state.editor.selectedNode.data.title}
            </div>
            <div className="px-2 mb-4 text-center text-sm text-default-400">
              {state.editor.selectedNode.data.longDescription}
            </div>
            <NodeSettings reactFlowInstance={reactFlowInstance} />
          </Tab>
        </Tabs>
      </div>
    </aside>
  );
};

export default EditorCanvasSidebar;
