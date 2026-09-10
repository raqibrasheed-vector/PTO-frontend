import { createContext } from "react";
import type { FilterStates, ReportTableHeaders } from "../types/report-types";

interface ReportTableContextProps {
  tableHeaders: ReportTableHeaders[];
  filterState: FilterStates[];
  setFilterState: React.Dispatch<React.SetStateAction<FilterStates[]>>
}

export const ReportsTableContext = createContext<
  ReportTableContextProps | undefined
>(undefined);
