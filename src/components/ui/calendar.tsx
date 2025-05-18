// src/components/ui/custom-datepicker.tsx
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import React, { ForwardedRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  dateRange: [Date | null, Date | null];
  onDateChange: (range: [Date | null, Date | null]) => void;
}

const CustomInput = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    value?: string;
    onClick?: () => void;
  }
>(({ value, onClick }, ref: ForwardedRef<HTMLButtonElement>) => (
  <Button
    variant="outline"
    className="w-full max-w-xs justify-between items-center text-left font-normal mx-auto flex"
    onClick={onClick}
    ref={ref}
  >
    <span className="text-sm text-gray-500">{value || "Seleccionar rango de fechas"}</span>
    <Calendar className="h-4 w-4" />
  </Button>
));

export const CustomDatePicker = ({
  dateRange,
  onDateChange,
}: CustomDatePickerProps) => {
  return (
    <div className="flex justify-center">
      <DatePicker
        selectsRange
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        onChange={onDateChange}
        customInput={<CustomInput />}
        locale={es}
        dateFormat="PPP"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        popperPlacement="bottom"
        calendarClassName="bg-white border border-gray-200 rounded-md shadow-lg p-3 mx-auto"
        wrapperClassName="w-full"
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-8 w-8 bg-transparent p-0 hover:bg-gray-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2">
              <select
                value={date.getMonth()}
                onChange={({ target: { value } }) =>
                  changeMonth(parseInt(value))
                }
                className="text-sm font-medium px-2 py-1 border rounded-md bg-white"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {format(new Date(0, i), "MMMM", { locale: es })}
                  </option>
                ))}
              </select>

              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) =>
                  changeYear(parseInt(value))
                }
                className="text-sm font-medium px-2 py-1 border rounded-md bg-white"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i} value={new Date().getFullYear() - 5 + i}>
                    {new Date().getFullYear() - 5 + i}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-8 w-8 bg-transparent p-0 hover:bg-gray-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        dayClassName={(date) =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 text-sm font-normal rounded-md mx-auto",
            dateRange[0] && date.getTime() === dateRange[0].getTime()
              ? "bg-blue-600 text-white rounded-l-md"
              : "",
            dateRange[1] && date.getTime() === dateRange[1].getTime()
              ? "bg-blue-600 text-white rounded-r-md"
              : "",
            dateRange[0] &&
              dateRange[1] &&
              date > dateRange[0] &&
              date < dateRange[1]
              ? "bg-blue-100 text-blue-800"
              : "",
            date.getMonth() !== (dateRange[0] || new Date()).getMonth()
              ? "text-gray-400 opacity-70"
              : ""
          )
        }
        weekDayClassName={() =>
          "text-xs font-medium text-gray-500 py-1 text-center"
        }
      />
    </div>
  );
};
