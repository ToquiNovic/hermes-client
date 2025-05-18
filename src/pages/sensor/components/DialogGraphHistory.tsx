// src/pages/sensor/components/DialogGraphHistory.tsx
import { CustomDatePicker } from "@/components/ui/calendar";
import { SensorData } from "@/models";
import { format, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";

interface DialogGraphHistoryProps {
  sensorData: SensorData[];
  dateRange: [Date | null, Date | null];
  onDateChange: (range: [Date | null, Date | null]) => void;
}

export const DialogGraphHistory = ({
  sensorData,
  dateRange,
  onDateChange,
}: DialogGraphHistoryProps) => {
  const [localDateRange, setLocalDateRange] =
    useState<[Date | null, Date | null]>(dateRange);

  const filteredData = sensorData.filter((data) => {
    if (!localDateRange[0] || !localDateRange[1]) return true;

    const date = new Date(data.createdAt);
    return date >= localDateRange[0] && date <= localDateRange[1];
  });

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setLocalDateRange(dates);
    onDateChange(dates);
  };

  return (
    <>
      <div className="px-4 pt-4">
        <CustomDatePicker 
          dateRange={localDateRange}
          onDateChange={handleDateChange}
        />
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
                        addSuffix: true,
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