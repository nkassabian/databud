import { useEditor } from "@/providers/editor-provider";
import { CSSProperties } from "react";
import { Handle, HandleProps, useStore } from "reactflow";

type Props = HandleProps & { style?: CSSProperties };

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

const CustomHandle = (props: Props) => {
  const { state } = useEditor();
  //   const { nodeInternals, edges } = useStore(selector);

  return (
    <Handle
      {...props}
      isValidConnection={(e) => {
        const sourceNode = state.editor.elements.find(
          (node) => node.id === e.source
        );

        const targetNode = state.editor.elements.find(
          (node) => node.id === e.target
        );
        //target
        const targetFromHandleInState = state.editor.edges.filter(
          (edge) => edge.target === e.target
        ).length;

        if (targetFromHandleInState === 1) return false;
        if (sourceNode != null) {
          if (targetNode?.accepts.includes(sourceNode?.type)) return true;
        }
        return false;
      }}
      className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800"
    />
  );
};

export default CustomHandle;
