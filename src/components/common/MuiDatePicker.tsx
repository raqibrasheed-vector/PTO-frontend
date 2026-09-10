import { Controller } from "react-hook-form";
import type {
  FieldValues,
  Path,
  Control,
  RegisterOptions,
} from "react-hook-form";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { SxProps, Theme } from "@mui/material/styles";

interface MuiDatePickerProps<T extends FieldValues> {
  id: Path<T>;
  control: Control<T>;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  sx: SxProps<Theme>;
}

const MuiDatePicker = <T extends FieldValues>({
  id,
  control,
  className,
  disabled = false,
  rules,
  sx,
}: MuiDatePickerProps<T>) => {
  return (
    <Controller
      name={id}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const dateValue =
          field.value && dayjs(field.value).isValid()
            ? dayjs(field.value)
            : null;

        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="w-full">
              <DatePicker
                value={dateValue}
                onChange={(newValue) =>
                  field.onChange(
                    newValue && newValue.isValid()
                      ? newValue.format("YYYY-MM-DD")
                      : "",
                  )
                }
                format="MM/DD/YYYY"
                disabled={disabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    id,
                    onBlur: field.onBlur,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    className: `bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-md ${className ?? ""}`,
                    sx: sx,
                  },
                }}
              />
            </div>
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default MuiDatePicker;
