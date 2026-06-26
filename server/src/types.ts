 export interface User {
   id: string;
   name: string;
   role: string;
   avatar: string;
   password_hash: string;
   created_at: string;
 }
 
 export interface InspectionRecord {
   id: string;
   name: string;
   status: 'completed' | 'ongoing' | 'pending';
   date: string;
   score: number;
   created_at: string;
   updated_at: string;
 }
 
 export interface AlertItem {
   id: string;
   type: 'critical' | 'system' | 'warning' | 'info';
   title: string;
   desc: string;
   time: string;
   dismissed: boolean;
   created_at: string;
 }
 
 export interface DataNode {
   id: string;
   name: string;
   location: string;
   status: 'normal' | 'syncing' | 'disconnected';
   kpi: number;
   created_at: string;
   updated_at: string;
 }
 
 export interface LogEntry {
   id: string;
   title: string;
   time: string;
   operator: string;
   type: 'success' | 'system' | 'error';
   created_at: string;
 }
 
 export interface OrgNode {
   id: string;
   name: string;
   role: string;
   leader: string;
   phone?: string;
   email?: string;
   status?: 'normal' | 'warning' | 'error';
   parent_id?: string;
   created_at: string;
 }
 
 export interface DashboardStats {
   total_projects: number;
   project_growth: number;
   security_rating: number;
   security_trend: string;
   compliance_rate: number;
   compliance_trend: string;
   active_alerts: number;
   completed_inspections: number;
   total_inspections: number;
   coverage_rate: number;
 }
 
 export interface LoginRequest {
   username: string;
   password: string;
 }
 
 export interface LoginResponse {
   token: string;
   user: Omit<User, 'password_hash'>;
 }
 
 export interface JwtPayload {
   userId: string;
   role: string;
 }
