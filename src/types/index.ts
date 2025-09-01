export interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
  price: number;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
  notes?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
  category: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalAppointments: number;
  lastVisit: string;
  totalSpent: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  appointments: number;
}

export type ViewType = 'dashboard' | 'agenda' | 'novo-agendamento' | 'historico' | 'configuracoes';