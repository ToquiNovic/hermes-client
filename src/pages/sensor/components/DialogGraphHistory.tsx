import { CustomDatePicker } from "@/components/ui/calendar";
import { SensorData } from "@/models";
import { getSensorData } from "../service";
import { format, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { formatISO } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Brush } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface DialogGraphHistoryProps {
  sensorId: string;
  dateRange: [Date | null, Date | null];
  onDateChange: (range: [Date | null, Date | null]) => void;
}

export const DialogGraphHistory = ({
  sensorId,
  dateRange,
  onDateChange,
}: DialogGraphHistoryProps) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (range: [Date | null, Date | null]) => {
    setLoading(true);
    try {
      const [start, end] = range;
      const startDate = start
        ? formatISO(start, { representation: "date" })
        : undefined;
      const endDate = end
        ? formatISO(end, { representation: "date" })
        : undefined;

      const data = await getSensorData(sensorId, undefined, startDate, endDate);
      setSensorData(data);
    } catch (error) {
      console.error("Error al cargar los datos del sensor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (range: [Date | null, Date | null]) => {
    setLocalDateRange(range);

    const [start, end] = range;
    if (start && end) {
      onDateChange(range);
      fetchData(range);
    }
  };

  return (
    <>
      <div className="px-4 flex items-center justify-center gap-2 relative">
        <CustomDatePicker
          dateRange={localDateRange}
          onDateChange={handleDateChange}
        />
        {(localDateRange[0] || localDateRange[1]) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-100 ml-2"
                onClick={() => {
                  const emptyRange: [Date | null, Date | null] = [null, null];
                  setLocalDateRange(emptyRange);
                  onDateChange(emptyRange);
                  setSensorData([]);
                }}
              >
                <Brush className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Limpiar Rango</TooltipContent>
          </Tooltip>
        )}
      </div>

      <Separator className="my-4" />

      <div className="p-4 overflow-auto border rounded-md min-h-[400px]">
        {loading ? (
          <p className="text-center">Cargando datos...</p>
        ) : sensorData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hace</TableHead>
                  <TableHead>Valor del sensor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sensorData.map((data) => (
                  <TableRow key={data.id} className="border-t">
                    <TableCell>
                      {format(new Date(data.createdAt), "Pp", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNowStrict(new Date(data.createdAt), {
                        locale: es,
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>{data.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
