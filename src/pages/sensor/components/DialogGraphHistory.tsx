import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SensorData } from "@/models";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

interface DialogGraphHistoryProps {
  sensorData: SensorData[];
  dateRange: DateRange;
  onDateChange: (range: DateRange | undefined) => void;
}

export const DialogGraphHistory = ({
  sensorData,
  dateRange,
  onDateChange,
}: DialogGraphHistoryProps) => {
  const filteredData = sensorData.filter((data) => {
    const date = new Date(data.createdAt);
    return (
      (!dateRange.from || date >= dateRange.from) &&
      (!dateRange.to || date <= dateRange.to)
    );
  });

  return (
    <>
      <div className="px-4 pt-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full max-w-xs">
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "PPP")} -{" "}
                    {format(dateRange.to, "PPP")}
                  </>
                ) : (
                  format(dateRange.from, "PPP")
                )
              ) : (
                "Seleccionar rango de fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-4 overflow-auto">
        {filteredData.length > 0 ? (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full table-auto text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Hace</th>
                  <th className="px-4 py-2">Valor del sensor</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((data) => (
                  <tr key={data.id} className="border-t">
                    <td className="px-4 py-2">
                      {format(new Date(data.createdAt), "Pp", { locale: es })}
                    </td>
                    <td className="px-4 py-2">
                      {formatDistanceToNowStrict(new Date(data.createdAt), {
                        locale: es,
                      })}
                    </td>
                    <td className="px-4 py-2">{data.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">
            No hay datos disponibles para el rango seleccionado.
          </p>
        )}
      </div>
    </>
  );
};
