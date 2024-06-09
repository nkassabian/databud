"use client";
import { EditorCanvasCardType, EditorNodeType } from "@/lib/types";
import { useEditor } from "@/providers/editor-provider";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
  ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { v4 } from "uuid";
import { EditorCanvasDefaultCardTypes } from "@/lib/constants";
import EditorCanvasSidebar from "./editor-canvas-sidebar";
import EditorCanvasCardSingle from "./editor-canvas-card-single";

type Props = {};

const initialNodes: EditorNodeType[] = [];

const initialEdges: { id: string; source: string; target: string }[] = [];

const EditorCanvas = (props: Props) => {
  const { dispatch, state } = useEditor();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();
  const pathname = usePathname();

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      //@ts-ignore
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      //@ts-ignore
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const flownodes = reactFlowInstance?.getNodes();

      const sourceNode = reactFlowInstance
        ?.getNodes()
        ?.find((node) => node.id === params.source);

      if (sourceNode) {
        sourceNode.data.metadata.connected = true;
      }

      const targetNode = reactFlowInstance
        ?.getNodes()
        ?.find((node) => node.id === params.target);

      if (targetNode) {
        targetNode.data.metadata.connected = true;
        targetNode.data.metadata.inputData =
          sourceNode?.data.metadata.outputData;
        targetNode.data.metadata.outputData.columns =
          sourceNode?.data.metadata.inputData.columns;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [reactFlowInstance]
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type: EditorCanvasCardType["type"] = event.dataTransfer.getData(
        "application/reactflow"
      );

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const triggerAlreadyExists = state.editor.elements.find(
        (node) => node.type === "CSVInput"
      );

      if (type === "CSVInput" && triggerAlreadyExists) {
        // toast("Only one trigger can be added to automations at the moment");
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      if (!reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: v4(),
        type,
        position,
        data: {
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          longDescription: EditorCanvasDefaultCardTypes[type].longDescription,
          completed: false,
          current: false,
          metadata: {
            inputData: {
              data: [],
            },
            transformations: {
              filter: [],
              logicalOperator: "",
            },
            outputData: {
              data: "",
            },
            meta: {
              rowCount: 0,
              fileName: "",
            },
          },
          type: type,
          category: EditorCanvasDefaultCardTypes[type].category,
          hasOutput: EditorCanvasDefaultCardTypes[type].hasOutput,
        },
        accepts: EditorCanvasDefaultCardTypes[type].accepts,
      };
      //@ts-ignore
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, state]
  );

  const handleClickCanvas = () => {
    dispatch({
      type: "SELECTED_ELEMENT",
      payload: {
        element: {
          data: {
            completed: false,
            current: false,
            description: "",
            longDescription: "",
            metadata: {
              inputData: {
                data: [],
                columns: [],
              },
              transformations: {
                filter: [],
                logicalOperator: "",
              },
              outputData: {
                data: [],
                columns: [],
              },
              meta: {
                rowCount: 0,
                fileName: "",
              },
            },
            title: "",
            type: "CSVInput",
            category: "Input",
            hasOutput: false,
          },
          id: "",
          position: { x: 0, y: 0 },
          accepts: [],
          type: "CSVInput",
        },
      },
    });
  };

  useEffect(() => {
    dispatch({ type: "LOAD_DATA", payload: { edges, elements: nodes } });
  }, [nodes, edges]);

  const nodeTypes = useMemo(
    () => ({
      CSVInput: EditorCanvasCardSingle,
      Filter: EditorCanvasCardSingle,
      Barchart: EditorCanvasCardSingle,
    }),
    []
  );

  return (
    <ResizablePanelGroup direction="horizontal" className="bg-default-200">
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center">
          <div
            style={{ width: "100%", height: "100%", paddingBottom: "70px" }}
            className="relative"
          >
            <ResizablePanelGroup direction="vertical">
              <ReactFlow
                className="h-full p-0 m-0 bg-default-50"
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodes={state.editor.elements}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                fitView
                onClick={handleClickCanvas}
                nodeTypes={nodeTypes}
              >
                <Controls position="top-left" />
                <MiniMap
                  position="bottom-left"
                  className="!bg-default-100"
                  zoomable
                  pannable
                />
                <Background
                  //@ts-ignore
                  variant="dots"
                  gap={12}
                  size={1}
                />
              </ReactFlow>
              <ResizableHandle />

              <ResizablePanel defaultSize={25}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Two</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-default-200" />
      <ResizablePanel
        defaultSize={20}
        className="relative sm:block bg-default-50 border-default-200 shadow-default-100"
      >
        <EditorCanvasSidebar
          nodes={nodes}
          reactFlowInstance={reactFlowInstance}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EditorCanvas;
