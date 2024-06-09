import { useEditor } from "@/providers/editor-provider";
import React, { useEffect, useState } from "react";
import { ReactFlowInstance, getIncomers, getOutgoers } from "reactflow";
import _ from "lodash";
import { Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { Separator } from "@radix-ui/react-separator";
import { PlusSquare } from "lucide-react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

type Props = {
  reactFlowInstance?: ReactFlowInstance;
};

let initialFilterTypes = [
  {
    value: "Equals",
    label: "Equals",
    dataTypes: ["string", "number", "boolean", "date"],
  },
  {
    value: "NotEquals",
    label: "Not Equals",
    dataTypes: ["string", "number", "boolean", "date"],
  },
  { value: "Contains", label: "Contains", dataTypes: ["string"] },
  { value: "NotContains", label: "Not Contains", dataTypes: ["string"] },
  { value: "Starts With", label: "Starts With", dataTypes: ["string"] },
  { value: "Ends With", label: "Ends With", dataTypes: ["string"] },
  {
    value: "GreaterThan",
    label: "Greater Than",
    dataTypes: ["number", "date"],
  },
  { value: "LessThan", label: "Less Than", dataTypes: ["number", "date"] },
];

const FilterNodeSettings = ({ reactFlowInstance }: Props) => {
  const { state, dispatch } = useEditor();
  const [filterTypes, setFilterTypes] = useState(initialFilterTypes);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string | number>("");

  useEffect(() => {
    const filter =
      state.editor.selectedNode.data.metadata.transformations.filter[0];
    if (filter) {
      setSelectedColumn(filter.conditions.field);
      setSelectedCondition(filter.conditions.operator);
      setFilterValue(filter.conditions.value);
    }
  }, [state.editor.selectedNode]);

  const onColumnChange = (value: string) => {
    setSelectedColumn(value);
    updateFilterConditions(value, selectedCondition, filterValue);
  };

  const onConditionChange = (value: string) => {
    setSelectedCondition(value);
    updateFilterConditions(selectedColumn, value, filterValue);
  };

  const onValueChange = (value: string | number) => {
    setFilterValue(value);
    updateFilterConditions(selectedColumn, selectedCondition, value);
  };

  const applyFilter = (
    data: any[],
    field: string,
    operator: string,
    value: string
  ) => {
    let filteredData = data;

    switch (operator) {
      case "Equals":
        filteredData = _.filter(data, [field, value]);
        break;
      case "NotEquals":
        filteredData = _.filter(data, (item) => item[field] !== value);
        break;
      case "Contains":
        filteredData = _.filter(data, (item) => _.includes(item[field], value));
        break;
      case "NotContains":
        filteredData = _.filter(
          data,
          (item) => !_.includes(item[field], value)
        );
        break;
      case "Starts With":
        filteredData = _.filter(data, (item) =>
          _.startsWith(item[field], value)
        );
        break;
      case "Ends With":
        filteredData = _.filter(data, (item) => _.endsWith(item[field], value));
        break;
      case "GreaterThan":
        filteredData = _.filter(data, (item) => item[field] > value);
        break;
      case "LessThan":
        filteredData = _.filter(data, (item) => item[field] < value);
        break;
      default:
        break;
    }

    return filteredData;
  };

  const updateFilterConditions = (
    field: string,
    operator: string,
    value: string | number
  ) => {
    state.editor.selectedNode.data.metadata.transformations.filter[0] = {
      conditions: {
        field,
        operator,
        value,
      },
    };
    const inputData = state.editor.selectedNode.data.metadata.inputData.data;
    const filteredData = applyFilter(
      inputData,
      field,
      operator,
      value.toString()
    );

    state.editor.selectedNode.data.metadata.outputData.data = filteredData;
  };

  return (
    <>
      {state.editor.selectedNode.data.metadata && (
        <div>
          <Accordion>
            <AccordionItem
              key="conditions"
              aria-label="Conditions"
              title="Conditions"
            >
              <div className="flex gap-2 flex-col items-center mt-3">
                <Select
                  label="Select a column"
                  onChange={(e) => onColumnChange(e.target.value)}
                  selectedKeys={[
                    state.editor.selectedNode.data.metadata.transformations
                      .filter[0]?.conditions.field,
                  ]}
                >
                  {state.editor.selectedNode.data.metadata.inputData?.columns?.map(
                    (field: any) => (
                      <SelectItem key={field}>{field}</SelectItem>
                    )
                  )}
                </Select>
                <div className="flex flex-row gap-2 w-full">
                  <Select
                    label="Condition"
                    onChange={(e) => onConditionChange(e.target.value)}
                    selectedKeys={[
                      state.editor.selectedNode.data.metadata.transformations
                        .filter[0]?.conditions.operator,
                    ]}
                  >
                    {filterTypes.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Value"
                    defaultValue={state.editor.selectedNode.data.metadata.transformations.filter[0]?.conditions.value.toString()}
                    onChange={(e) => onValueChange(e.target.value)}
                  />
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default FilterNodeSettings;
