import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { Appointment } from '../types';

interface HistoryProps {
  appointments: Appointment[];
}

export function History({ appointments }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  // Apenas agendamentos concluídos para o histórico
  const completedAppointments = appointments.filter(apt => apt.status === 'concluido');

  // Filtros
  const filteredHistory = completedAppointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === 'all' || appointment.service === serviceFilter;
    
    let matchesMonth = true;
    if (monthFilter !== 'all') {
      const appointmentMonth = new Date(appointment.date).getMonth();
      matchesMonth = appointmentMonth === parseInt(monthFilter);
    }
    
    return matchesSearch && matchesService && matchesMonth;
  });

  // Estatísticas
  const totalRevenue = filteredHistory.reduce((sum, apt) => sum + apt.price, 0);
  const uniqueClients = new Set(filteredHistory.map(apt => apt.clientName)).size;
  const averageTicket = filteredHistory.length > 0 ? totalRevenue / filteredHistory.length : 0;

  // Serviços únicos para o filtro
  const uniqueServices = Array.from(new Set(completedAppointments.map(apt => apt.service)));

  // Agrupamento por mês
  const appointmentsByMonth = filteredHistory.reduce((acc, appointment) => {
    const monthYear = new Date(appointment.date).toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedMonths = Object.keys(appointmentsByMonth).sort((a, b) => {
    const dateA = new Date(appointmentsByMonth[a][0].date);
    const dateB = new Date(appointmentsByMonth[b][0].date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold text-foreground mb-2">Histórico</h2>
        <p className="text-muted-foreground">
          Acompanhe todos os serviços realizados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
        <Card className="glass p-4 border-0 shadow-glass">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-success-light">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-xl font-bold text-foreground">
                R$ {totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass p-4 border-0 shadow-glass">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-light">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serviços</p>
              <p className="text-xl font-bold text-foreground">
                {filteredHistory.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass p-4 border-0 shadow-glass">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-warning-light">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clientes</p>
              <p className="text-xl font-bold text-foreground">
                {uniqueClients}
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass p-4 border-0 shadow-glass">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-destructive-light">
              <TrendingUp className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-xl font-bold text-foreground">
                R$ {averageTicket.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <Card className="glass p-4 border-0 shadow-glass">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-0"
            />
          </div>
        </Card>

        <Card className="glass p-4 border-0 shadow-glass">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="glass border-0">
              <SelectValue placeholder="Filtrar por serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os serviços</SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Card className="glass p-4 border-0 shadow-glass">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="glass border-0">
              <SelectValue placeholder="Filtrar por mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* History List */}
      <div className="space-y-6 animate-fade-in">
        {sortedMonths.length === 0 ? (
          <Card className="glass p-8 border-0 shadow-glass text-center">
            <p className="text-muted-foreground">Nenhum serviço encontrado no histórico</p>
          </Card>
        ) : (
          sortedMonths.map((monthYear) => {
            const monthAppointments = appointmentsByMonth[monthYear];
            const monthRevenue = monthAppointments.reduce((sum, apt) => sum + apt.price, 0);
            
            return (
              <div key={monthYear} className="space-y-3">
                {/* Month Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground capitalize">
                      {monthYear}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {monthAppointments.length} serviços
                    </p>
                    <p className="font-semibold text-success">
                      R$ {monthRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Month Appointments */}
                <div className="grid gap-3">
                  {monthAppointments
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((appointment) => (
                      <Card 
                        key={appointment.id} 
                        className="glass p-4 border-0 shadow-glass hover-lift"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground">
                                  {appointment.clientName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.service}
                                </p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(appointment.date).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {appointment.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-success">
                                  R$ {appointment.price.toFixed(2)}
                                </p>
                                <div className="flex items-center justify-end mt-1">
                                  <span className="status-dot status-concluido"></span>
                                  <span className="text-xs text-muted-foreground">
                                    Concluído
                                  </span>
                                </div>
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="mt-3 p-2 bg-muted/30 rounded text-sm text-muted-foreground">
                                <strong>Observações:</strong> {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}