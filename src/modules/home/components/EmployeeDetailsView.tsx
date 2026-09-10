import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EmployeeResponseForm } from "../types/api-types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const InfoCard = ({
  id,
  value,
  label,
  home_state,
  remote,
}: {
  id: string;
  value: string | number;
  label: string;
  home_state: string;
  remote: boolean;
}) => (
  <div className="p-4 bg-white shadow-sm border rounded-md">
    <>
      <p id={id} className="text-[#021A32] text-lg font-semibold">
        {id === "state" ? (remote ? home_state : value) : value}
      </p>
      <p className="text-xs md:text-sm text-gray-500">
        {id === "state" ? (remote ? "Home State" : "Work State") : label}
      </p>
    </>
  </div>
);

const EmployeeDetails = ({
  employeeData,
  setEmployeeSelectedIndex,
  employeeSelectedIndex,
}: {
  employeeData: EmployeeResponseForm[];
  setEmployeeSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  employeeSelectedIndex: number;
}) => {
  const employeeDetails = [
    {
      id: "employeeName",
      label: "Employee Name",
      value: employeeData[employeeSelectedIndex].employee_name,
    },
    {
      id: "clientName",
      label: "Client Name",
      value: employeeData[employeeSelectedIndex].customer_name,
    },
    {
      id: "employeeId",
      label: "Employee ID",
      value: employeeData[employeeSelectedIndex].employee_id,
    },
    {
      id: "regularHours",
      label: "Total Hours Worked",
      value: employeeData[employeeSelectedIndex].regular_hours_worked,
    },
    {
      id: "leavesUsed",
      label: "Total Vacation Hours Used",
      value: employeeData[employeeSelectedIndex].used_vacations,
    },
    {
      id: "state",
      label: "State",
      value: employeeData[employeeSelectedIndex].state,
    },
  ];

  return (
    <div id="employeeDetails" className="my-4 mt-6">
      <h2 className="text-lg font-semibold text-black">Employee Details</h2>
      {/* New Response */}
      <div className="space-y-4 md:space-y-0 md:flex gap-4 my-4 mb-8">
        <div className="w-full flex basis-8/12 gap-4 items-center">
          <h3 className="font-semibold text-sm w-fit text-nowrap text-black">
            Customer Name
          </h3>
          <Select
            value={employeeSelectedIndex.toString()}
            onValueChange={(value) => {
              setEmployeeSelectedIndex(parseInt(value));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent className="border w-full">
              <SelectGroup className="w-full">
                {employeeData.map((employee, index) => (
                  <SelectItem
                    className="w-full"
                    id={employee.customer_id}
                    key={employee.customer_id}
                    value={`${index}`}
                  >
                    {employee.customer_name + ` (${employee.job_req_status})`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex basis-2/12 gap-2 items-center">
          <Label
            htmlFor="remote"
            className="font-semibold text-sm text-nowrap text-black"
          >
            Remote Worker
          </Label>
          <Checkbox
            id="remote"
            disabled={true}
            checked={employeeData[employeeSelectedIndex].remote_worker === "Y"}
          />
        </div>
        <div className="w-full flex basis-2/12 gap-2 items-center">
          <h3 className="font-semibold text-sm text-nowrap text-black">
            Home State
          </h3>

          <p>{employeeData[employeeSelectedIndex].home_state}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {employeeDetails.map((detail, index) => (
          <InfoCard
            id={detail.id}
            key={index}
            value={detail.value}
            label={detail.label}
            home_state={employeeData[employeeSelectedIndex].home_state}
            remote={employeeData[employeeSelectedIndex].remote_worker === "Y"}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeDetails;
