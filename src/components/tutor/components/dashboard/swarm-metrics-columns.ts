
import { ColumnDef } from "@tanstack/react-table";

export interface SwarmMetricRow {
  time: string;
  taskCount: number;
  agentCount: number;
  executionTime: string;
  councilId?: string;
}

export const columns: ColumnDef<SwarmMetricRow>[] = [
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "taskCount",
    header: "Tasks",
  },
  {
    accessorKey: "agentCount",
    header: "Agents",
  },
  {
    accessorKey: "executionTime",
    header: "Execution Time",
  },
  {
    accessorKey: "councilId",
    header: "Council",
  },
];
