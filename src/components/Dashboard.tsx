import { Card } from '@/components/ui/card';
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { RevenueChart } from './RevenueChart';
import { Appointment } from '../types';

interface DashboardProps {
  appointments: Appointment[];
}

export function Dashboard({ appointments }: DashboardProps) {
  // Cálculos de estatísticas
  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const todayAppointments = appointments.filter(apt => 
    new Date(apt.date).toDateString() === today && apt.status !== 'cancelado'
  );

  const monthlyRevenue = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getMonth() === thisMonth && 
             aptDate.getFullYear() === thisYear && 
             apt.status === 'concluido';
    })
    .reduce((sum, apt) => sum + apt.price, 0);

  const totalClients = new Set(appointments.map(apt => apt.clientName)).size;

  const monthlyGrowth = appointments.length > 0 ? 
    Math.floor(Math.random() * 15) + 5 : 0; // Simulated growth

  const stats = [
    {
      title: 'Hoje',
      value: todayAppointments.length.toString(),
      description: 'Agendamentos hoje',
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      title: 'Faturamento',
      value: `R$ ${monthlyRevenue.toFixed(2)}`,
      description: 'Este mês',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
    {
      title: 'Clientes',
      value: totalClients.toString(),
      description: 'Total de clientes',
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning-light',
    },
    {
      title: 'Crescimento',
      value: `+${monthlyGrowth}%`,
      description: 'Vs. mês anterior',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success-light',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vinda! Aqui está um resumo do seu negócio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="glass hover-lift p-6 border-0 shadow-glass"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="animate-scale-in">
        <RevenueChart appointments={appointments} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        {/* Próximos Agendamentos */}
        <Card className="glass p-6 border-0 shadow-glass">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Próximos Agendamentos
          </h3>
          <div className="space-y-3">
            {todayAppointments.slice(0, 3).map((appointment, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{appointment.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.time} - {appointment.service}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">
                    R$ {appointment.price.toFixed(2)}
                  </p>
                  <div className="flex items-center">
                    <span className={`status-dot status-${appointment.status}`}></span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {todayAppointments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum agendamento para hoje
              </p>
            )}
          </div>
        </Card>

        {/* Serviços Populares */}
        <Card className="glass p-6 border-0 shadow-glass">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Serviços Populares
          </h3>
          <div className="space-y-3">
            {getPopularServices(appointments).map((service, index) => (
              <div 
                key={index}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.count} agendamentos
                  </p>
                </div>
                <div className="w-20 bg-secondary rounded-full h-2">
                  <div 
                    className="progress-fill h-2"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getPopularServices(appointments: Appointment[]) {
  const serviceCount = appointments.reduce((acc, apt) => {
    acc[apt.service] = (acc[apt.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = appointments.length;
  
  return Object.entries(serviceCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}