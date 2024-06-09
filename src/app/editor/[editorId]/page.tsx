import EditorProvider from "@/providers/editor-provider";
import React from "react";
import EditorCanvas from "./_components/editor-canvas";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="h-screen m-0 p-0">
      <EditorProvider>
        <EditorCanvas />
      </EditorProvider>
    </div>
  );
};

export default Page;
