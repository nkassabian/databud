"use client";
import { EditorCanvasTypes, EditorNodeType } from "@/lib/types";
import { useEditor } from "@/providers/editor-provider";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { onDragStart } from "@/lib/editor-utils";
import EditorCanvasIconHelper from "./editor-canvas-card-icon-hepler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorCanvasDefaultCardTypes } from "@/lib/constants";
import Papa from "papaparse";
import { ReactFlowInstance, getIncomers } from "reactflow";
import { Zap } from "lucide-react";
import FilterNodeSettings from "./_node-settings/filter-node-settings";
import CSVInputSettigns from "./_node-settings/csv-file-input";
import BarchartInput from "./_node-settings/barchart-input";

type Props = {
  reactFlowInstance?: ReactFlowInstance;
};

const NodeSettings = ({ reactFlowInstance }: Props) => {
  const { dispatch, state } = useEditor();

  let selectedNode = state.editor.selectedNode;

  switch (selectedNode.type) {
    case "Filter":
      return <FilterNodeSettings reactFlowInstance={reactFlowInstance} />;
    case "CSVInput":
      return <CSVInputSettigns reactFlowInstance={reactFlowInstance} />;
    case "Barchart":
      return <BarchartInput reactFlowInstance={reactFlowInstance} />;
    default:
      return <Zap className="flex-shrink-0" size={30} />;
  }
};

export default NodeSettings;
