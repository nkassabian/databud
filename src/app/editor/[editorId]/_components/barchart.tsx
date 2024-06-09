import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import _ from "lodash";
import clsx from "clsx";

const Barchart = ({ data }: any) => {
  let newData: any = [];

  const prepareChartData = (inData: any[]) => {
    const chartData = _(inData)
      .groupBy(data.metadata.meta.fileName) // Group by the field you want to plot, e.g., CoffeeType
      .map((items, key) => ({ name: key, count: items.length }))
      .value();
    return chartData;
  };

  newData = prepareChartData(data.metadata.inputData.data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={newData}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 20,
        }}
        barSize={20}
      >
        <XAxis
          dataKey="name"
          angle={-45}
          scale="point"
          className="text-xs"
          textAnchor="end"
          padding={{ left: 10, right: 10 }}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Barchart;
