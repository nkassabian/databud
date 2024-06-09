export type EditorCanvasTypes = "CSVInput" | "Filter" | "Barchart";
export type EditorCanvasTypesCategory =
  | "Calculation"
  | "Input"
  | "Processing"
  | "Visual";

export type EditorCanvasCardType = {
  title: string;
  description: string;
  longDescription: string;
  completed: boolean;
  current: boolean;
  metadata: EditorCanvasCardMetadata;
  type: EditorCanvasTypes;
  category: EditorCanvasTypesCategory;
  hasOutput: boolean;
};

export type EditorCanvasCardMetadata = {
  inputData: {
    data: [];
    columns: string[];
  };
  transformations: {
    filter: EditorCanvasCardFilter[];
    logicalOperator: string;
  };
  outputData: {
    data: any[];
    columns: string[];
  };
  meta: {
    rowCount: number;
    fileName: string;
  };
};

export type EditorCanvasCardFilter = {
  conditions: {
    field: string;
    operator: string;
    value: string | number;
  };
};

export type EditorNodeType = {
  id: string;
  type: EditorCanvasCardType["type"];
  position: {
    x: number;
    y: number;
  };
  data: EditorCanvasCardType;
  accepts: EditorCanvasTypes[];
};

export type EditorNode = EditorNodeType;

export type EditorActions =
  | {
      type: "LOAD_DATA";
      payload: {
        elements: EditorNode[];
        edges: {
          id: string;
          source: string;
          target: string;
        }[];
      };
    }
  | {
      type: "UPDATE_NODE";
      payload: {
        elements: EditorNode[];
      };
    }
  | { type: "REDO" }
  | { type: "UNDO" }
  | {
      type: "SELECTED_ELEMENT";
      payload: {
        element: EditorNode;
      };
    };
