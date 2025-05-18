import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { getSensorData } from "../service";
import { SensorData } from "@/models";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { DialogGraphHistory } from "./DialogGraphHistory";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDistanceToNowStrict, differenceInSeconds } from "date-fns";
import { es } from "date-fns/locale";

interface DialogGraphProps {
  isOpen: boolean;
  sensorId: string;
  onClose: () => void;
}

export const DialogGraph = ({
  isOpen,
  sensorId,
  onClose,
}: DialogGraphProps) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"tiempo-real" | "historial">("tiempo-real");
  const [maxPoints, setMaxPoints] = useState(50);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  useEffect(() => {
    if (!isOpen || !sensorId) return;

    let isMounted = true;

    const fetchSensorData = async () => {
      try {
        const data = await getSensorData(sensorId, maxPoints);
        if (isMounted) {
          setSensorData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchSensorData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, sensorId, maxPoints]);

  useEffect(() => {
    if (!isOpen || mode !== "tiempo-real" || !sensorId) return;

    const interval = setInterval(() => {
      getSensorData(sensorId)
        .then(setSensorData)
        .catch((err) => console.error("Error fetching sensor data:", err));
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, mode, sensorId]);

  const chartData = sensorData
    .slice(0, maxPoints)
    .map((data) => ({
      timestamp: data.createdAt,
      value: Math.round(Number(data.value)),
    }));

  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => Number(item.value)))
      : 0;
  const minValue =
    chartData.length > 0
      ? Math.min(...chartData.map((item) => Number(item.value)))
      : 0;

  const chartConfig: ChartConfig = {
    value: {
      label: "Sensor Value",
      color: "#2563eb",
    },
  };

  // Determinar unidad de tiempo más común
  const xAxisUnitLabel = useMemo(() => {
    const unitsCount = {
      segundos: 0,
      minutos: 0,
      horas: 0,
      días: 0,
    };

    chartData.forEach(({ timestamp }) => {
      const date = new Date(timestamp);
      const diffSec = differenceInSeconds(new Date(), date);
      if (diffSec < 60) {
        unitsCount["segundos"]++;
      } else if (diffSec < 3600) {
        unitsCount["minutos"]++;
      } else if (diffSec < 86400) {
        unitsCount["horas"]++;
      } else {
        unitsCount["días"]++;
      }
    });

    const mostCommonUnit = Object.entries(unitsCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return `(${mostCommonUnit} atrás)`;
  }, [chartData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1024px] w-full rounded-lg max-w-[calc(100vw-2rem)] max-h-[100vh] flex flex-col">
        <DialogHeader className="p-2 border-b">
          <DialogTitle>Gráfico del Sensor</DialogTitle>
          <DialogDescription>
            Visualiza los datos del sensor en tiempo real o por historial.
          </DialogDescription>
          <div className="p-2 flex gap-4 items-center">
            <>
              {mode === "tiempo-real" && (
                <>
                  <label htmlFor="limit" className="text-sm font-medium">
                    Mostrar últimos:
                  </label>
                  <Select
                    value={String(maxPoints)}
                    onValueChange={(value: string) => {
                      const parsed = Number(value);
                      if (!isNaN(parsed)) {
                        setMaxPoints(parsed);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 25, 50, 100, 200].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} datos
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              <Button
                variant={mode === "tiempo-real" ? "default" : "outline"}
                onClick={() => setMode("tiempo-real")}
              >
                Tiempo Real
              </Button>
              <Button
                variant={mode === "historial" ? "default" : "outline"}
                onClick={() => setMode("historial")}
              >
                Historial
              </Button>
            </>
          </div>
        </DialogHeader>

        {mode === "tiempo-real" ? (
          <div className="flex-1 overflow-auto">
            {loading && sensorData.length === 0 ? (
              <p>Cargando datos...</p>
            ) : chartData.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="min-h-[100px] w-full overflow-x-auto"
              >
                <AreaChart data={chartData} width={975} height={250}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) =>
                      formatDistanceToNowStrict(new Date(value), {
                        locale: es,
                      })
                    }
                  >
                    <Label
                      value={xAxisUnitLabel}
                      offset={-2}
                      position="insideBottom"
                    />
                  </XAxis>
                  <YAxis
                    domain={[
                      Math.min(0, minValue - 5),
                      Math.max(0, maxValue + 5),
                    ]}
                  >
                    <Label
                      value="Valor del sensor"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip
                    labelFormatter={(label) =>
                      `Hace ${formatDistanceToNowStrict(new Date(label), {
                        locale: es,
                      })}`
                    }
                    formatter={(value: number | string) => [
                      `${value}`,
                      "Valor",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartConfig.value.color}
                    fill={chartConfig.value.color}
                    name={
                      typeof chartConfig.value.label === "string"
                        ? chartConfig.value.label
                        : ""
                    }
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <p>No hay datos en tiempo real disponibles.</p>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <DialogGraphHistory
              sensorId={sensorId}
              dateRange={[dateRange.from ?? null, dateRange.to ?? null]}
              onDateChange={(range) => {
                if (range) {
                  setDateRange({ from: range[0] ?? undefined, to: range[1] ?? undefined });
                }
              }}
            />
          </div>
        )}

        <div className="p-4 border-t shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
