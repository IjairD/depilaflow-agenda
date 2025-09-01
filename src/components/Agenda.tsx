import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Clock, DollarSign, Edit3, Search, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '../types';

interface AgendaProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onDeleteAppointment: (id: string) => void;
}

export function Agenda({ appointments, onUpdateStatus, onDeleteAppointment }: AgendaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filtros
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Agrupamento por data
  const appointmentsByDate = filteredAppointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Ordenar datas
  const sortedDates = Object.keys(appointmentsByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'agendado': return 'text-primary bg-primary-light';
      case 'confirmado': return 'text-success bg-success-light';
      case 'concluido': return 'text-muted-foreground bg-muted';
      case 'cancelado': return 'text-destructive bg-destructive-light';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'long',
        day: '2-digit',
        month: 'long'
      });
    }
  };

  const totalRevenue = filteredAppointments
    .filter(apt => apt.status === 'concluido')
    .reduce((sum, apt) => sum + apt.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold text-foreground mb-2">Agenda</h2>
        <p className="text-muted-foreground">
          Gerencie todos os seus agendamentos
        </p>
      </div>

      {/* Filtros e Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-fade-in">
        {/* Search */}
        <Card className="glass p-4 border-0 shadow-glass lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-0"
            />
          </div>
        </Card>

        {/* Status Filter */}
        <Card className="glass p-4 border-0 shadow-glass">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="glass border-0">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="agendado">Agendados</SelectItem>
              <SelectItem value="concluido">Concluídos</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Quick Stats */}
        <Card className="glass p-4 border-0 shadow-glass">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">{filteredAppointments.length}</p>
            <p className="text-xs text-muted-foreground">agendamentos</p>
          </div>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card className="glass p-4 border-0 shadow-glass animate-scale-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-success-light">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faturamento dos agendamentos filtrados</p>
              <p className="text-2xl font-bold text-foreground">R$ {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      <div className="space-y-6 animate-fade-in">
        {sortedDates.length === 0 ? (
          <Card className="glass p-8 border-0 shadow-glass text-center">
            <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
          </Card>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {formatDate(date)}
                </h3>
                <div className="h-px bg-border flex-1" />
                <span className="text-sm text-muted-foreground">
                  {appointmentsByDate[date].length} agendamento(s)
                </span>
              </div>

              {/* Appointments for this date */}
              <div className="grid gap-3">
                {appointmentsByDate[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <Card 
                      key={appointment.id} 
                      className="glass p-4 border-0 shadow-glass hover-lift"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                        {/* Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">
                                {appointment.clientName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {appointment.service}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                R$ {appointment.price.toFixed(2)}
                              </p>
                              <div className="flex items-center justify-end">
                                <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {appointment.time}
                                </span>
                              </div>
                            </div>
                          </div>

                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                              {appointment.notes}
                            </p>
                          )}
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center space-x-6 mt-4 md:mt-0 md:ml-6">
                          {/* Status Badge */}
                          <Select
                            value={appointment.status}
                            onValueChange={(value) => 
                              onUpdateStatus(appointment.id, value as Appointment['status'])
                            }
                          >
                            <SelectTrigger className={`w-32 text-xs ${getStatusColor(appointment.status)} border-0`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="agendado">Agendado</SelectItem>
                              <SelectItem value="concluido">Concluído</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Actions */}
                          <div className="flex space-x-1">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="glass hover:bg-destructive-light text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja cancelar o agendamento de {appointment.clientName}?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Não cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => onDeleteAppointment(appointment.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Sim, cancelar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}