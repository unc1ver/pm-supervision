/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ViewType = 'dashboard' | 'inspection' | 'dataCenter' | 'org';

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface InspectionRecord {
  id: string;
  name: string;
  status: 'completed' | 'ongoing' | 'pending';
  date: string;
  score: number; // 0 to 100, or -1 for pending/ongoing (displays as --)
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'system' | 'warning' | 'info';
  title: string;
  desc: string;
  time: string;
}

export interface DataNode {
  id: string;
  name: string;
  location: string;
  status: 'normal' | 'syncing' | 'disconnected';
  kpi: number; // percentage or -1 for error
}

export interface LogEntry {
  id: string;
  title: string;
  time: string;
  operator: string;
  type: 'success' | 'system' | 'error';
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  leader: string;
  phone?: string;
  email?: string;
  status?: 'normal' | 'warning' | 'error';
  children?: OrgNode[];
}
