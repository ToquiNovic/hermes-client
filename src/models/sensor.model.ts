// @/models/sensor.model.ts
import { Team } from '@/models';

export interface Sensor {
  id: string;
  name: string;
  description?: string;
  teamId: string;
}

export interface SensorItemProps {
  teamId?: string;
}

export interface SensorTeamItemProps {
  id: string;
  name: string;
  description: string;
  Team: Team;
}

export interface SensorAPIResponse {
  id: string;
  name: string;
  description: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SensorData {
  id: string;
  type: string;
  value: string;
  createdAt: string;
  teamId?: string;
}

export interface SensorDataAPIResponse {
  success: boolean;
  message: string;
  data: SensorData[];
}