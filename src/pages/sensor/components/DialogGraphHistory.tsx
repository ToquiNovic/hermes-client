// components/DialogGraphHistory.tsx
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SensorData } from "@/models";

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

  const chartData = filteredData.map((data) => ({
    timestamp: data.createdAt,
    value: data.value,
  }));

  const chartConfig: ChartConfig = {
    value: {
      label: "Sensor Value",
      color: "#2563eb",
    },
  };

  const dynamicWidth = Math.max(800, filteredData.length * 20);

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

      <div className="flex-1 p-4 overflow-auto">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] w-full overflow-x-auto"
          >
            <div style={{ width: dynamicWidth }}>
              <AreaChart width={dynamicWidth} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartConfig.value.color}
                  fill={chartConfig.value.color}
                  name={typeof chartConfig.value.label === "string" ? chartConfig.value.label : ""}
                />
              </AreaChart>
            </div>
          </ChartContainer>
        ) : (
          <p className="text-center">
            No hay datos disponibles para el rango seleccionado.
          </p>
        )}
      </div>
    </>
  );
};
