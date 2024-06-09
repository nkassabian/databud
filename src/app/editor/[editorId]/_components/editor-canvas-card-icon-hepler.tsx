"use client";
import React from "react";
import { BarChartBig, Filter, Sigma, Zap } from "lucide-react";
import { EditorCanvasTypes } from "@/lib/types";

type Props = { type: EditorCanvasTypes };

const EditorCanvasIconHelper = ({ type }: Props) => {
  switch (type) {
    case "Filter":
      return <Filter className="flex-shrink-0" size={30} />;
    case "Barchart":
      return <BarChartBig className="flex-shrink-0" size={30} />;
    default:
      return <Zap className="flex-shrink-0" size={30} />;
  }
};

export default EditorCanvasIconHelper;
