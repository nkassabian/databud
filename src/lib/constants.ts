export const EditorCanvasDefaultCardTypes = {
  CSVInput: {
    description: "Input node for CSV data.",
    longDescription:
      "This node allows the user to input CSV data into the canvas. It serves as the initial data entry point, holding and managing the data that will be used and manipulated by other nodes. Users can upload a CSV file or enter CSV data directly. This node outputs the raw data for further processing.",
    type: "CSVInput",
    category: "Input",
    hasOutput: true,
    accepts: [],
  },
  Filter: {
    description: "Filters rows based on conditions.",
    longDescription:
      "This node filters the rows of input data based on specified conditions. Users can define rules to include or exclude rows according to values in one or more columns. For example, this node can be used to filter out rows where a certain column's value is below a threshold or to include only rows that match specific criteria. It processes the data and outputs only the rows that meet the defined conditions for further analysis or operations.",
    type: "Filter",
    category: "Processing",
    hasOutput: true,
    accepts: ["CSVInput"],
  },
  Barchart: {
    description: "Filters rows based on conditions.",
    longDescription:
      "This node filters the rows of input data based on specified conditions. Users can define rules to include or exclude rows according to values in one or more columns. For example, this node can be used to filter out rows where a certain column's value is below a threshold or to include only rows that match specific criteria. It processes the data and outputs only the rows that meet the defined conditions for further analysis or operations.",
    type: "Chart",
    category: "Visual",
    hasOutput: false,
    accepts: ["CSVInput", "Filter"],
  },
  // Sum: {
  //   description: "Calculates sum of a column.",
  //   longDescription:
  //     "This node performs a summation operation on a specified column of the input CSV data. It accepts data from an input node, such as CSVInput, and calculates the total sum of numerical values in the chosen column. This is useful for aggregating data, such as calculating total sales, scores, or any other cumulative metrics. The result is output for further processing or display.",
  //   type: "Calculation",
  //   category: "Calculation",
  //   hasOutput: false,
  //   accepts: ["CSVInput"],
  // },
};
