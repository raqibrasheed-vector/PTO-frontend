import { useContext } from "react";
import { ReportsTableContext } from "../context/report-table-context";
import { ChevronDown, ChevronUp } from "lucide-react";
import TableDropdown from "./table-dropdown";

const ReportsTableHeaders = () => {
  const tableHeadersContext = useContext(ReportsTableContext);

  if (!tableHeadersContext) {
    throw new Error("useUser must be used inside UserProvider");
  }

  const { tableHeaders, filterState, setFilterState } = tableHeadersContext;

  const checkSortActive = (name: string, value: string) => {
    return filterState.some(
      (item) =>
        item.key === name && item.value === value && item.isSort === true,
    );
  };

  const handleChange = (name: string,value: string) => {
    setFilterState((prev) => {
      // Remove the filter when "All" / empty is selected
      if (!name) {
        return prev.filter((item) => item.key !== name);
      }

      const existingFilter = prev.find((item) => item.key === name);

      if (existingFilter) {
        return prev.map((item) =>
          item.key === name ? { ...item, value } : item,
        );
      }

      return [...prev, { key: name, value, isSort: true }];
    });
  };

  return (
    <div>
      <div className="cap flex min-w-[1200px] rounded-t-md border border-gray-200 bg-gray-100 py-2 text-xs font-medium text-gray-700">
        {tableHeaders.map((item, index) => (
          <div
            key={index}
            className="flex-1 text-center max-w-45 p-0.5 text-[12px]"
          >
            {item.isFilter ? (
              <>
                <TableDropdown
                  setState={setFilterState}
                  state={filterState}
                  data={item.filterData}
                  title={item.label}
                  name={item.name}
                />
              </>
            ) : item.isSort ? (
              <div className="flex items-center justify-between gap-2">
                <span>{item.label}</span>
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-4 w-4 cursor-pointer ${
                      checkSortActive(item.name, "asc")
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                    onClick={() => {
                      handleChange(item.name,"asc");
                    }}
                  />
                  <ChevronDown
                    className={`h-4 w-4 cursor-pointer ${
                      checkSortActive(item.name, "desc")
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                    onClick={() => {
                      handleChange(item.name,"desc");
                    }}
                  />
                </div>
              </div>
            ) : (
              item.label
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsTableHeaders;
