import React from "react";
import type { FilterStates } from "../types/report-types";

type TableDropdownProps = {
  title: string;
  name: string;
  data: string[];
  state: FilterStates[];
  setState: React.Dispatch<React.SetStateAction<FilterStates[]>>;
};

const TableDropdown: React.FC<TableDropdownProps> = ({
  title,
  name,
  data,
  state,
  setState,
}) => {
  const filteredValue = state.find((item) => item.key === name);

  const handleChange = (value: string) => {
    setState((prev) => {
      // Remove the filter when "All" / empty is selected
      if (!value) {
        return prev.filter((item) => item.key !== name);
      }

      const existingFilter = prev.find((item) => item.key === name);

      if (existingFilter) {
        return prev.map((item) =>
          item.key === name ? { ...item, value } : item,
        );
      }

      return [...prev, { key: name, value, isSort: false }];
    });
  };

  return (
    <div className="relative inline-block w-full text-left">
      <select
        className={`mt-[-4px] w-full rounded-md py-1 pr-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          filteredValue
            ? "border-2 border-[#9db51f] text-center"
            : ""
        }`}
        value={filteredValue?.value ?? ""}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      >
        <option value="" className="capitalize">{title}</option>
        {data.map((item, index) => {
          const value = typeof item === "string" ? item.trim() : "";
          const label =
            name === "feedback_type"
              ? ({
                  thumbs_up: "Positive",
                  thumbs_down: "Negative",
                } as Record<string, string>)[value] ?? value
              : value;
          return (
            <option key={index} value={value} className="text-left mx-1">
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default TableDropdown;
