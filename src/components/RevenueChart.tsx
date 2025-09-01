import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Appointment } from '../types';

interface RevenueChartProps {
  appointments: Appointment[];
}

export function RevenueChart({ appointments }: RevenueChartProps) {
  // Gera dados dos últimos 7 dias
  const generateChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAppointments = appointments.filter(apt => 
        apt.date === dateStr && apt.status === 'concluido'
      );
      
      const revenue = dayAppointments.reduce((sum, apt) => sum + apt.price, 0);
      
      last7Days.push({
        date: date.toLocaleDateString('pt-BR', { 
          weekday: 'short',
          day: '2-digit'
        }),
        revenue,
        appointments: dayAppointments.length,
      });
    }
    return last7Days;
  };

  const chartData = generateChartData();

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0);

  return (
    <Card className="glass p-6 border-0 shadow-glass">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary-light">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Faturamento dos Últimos 7 Dias
            </h3>
            <p className="text-sm text-muted-foreground">
              Acompanhe o desempenho diário do seu negócio
            </p>
          </div>
        </div>
      </div>
      
      {/* Simple Bar Chart */}
      <div className="h-[200px] flex items-end space-x-2 mb-4">
        {chartData.map((day, index) => {
          const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 160 : 0;
          
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center space-y-2 group"
            >
              <div className="text-xs text-center space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="glass p-2 rounded text-xs">
                  <p className="font-medium">R$ {day.revenue.toFixed(2)}</p>
                  <p className="text-muted-foreground">{day.appointments} agendamentos</p>
                </div>
              </div>
              
              <div 
                className="w-full bg-primary rounded-t-md transition-all duration-500 hover:bg-primary-hover cursor-pointer"
                style={{ height: `${height}px`, minHeight: '4px' }}
              />
              
              <span className="text-xs text-muted-foreground text-center">
                {day.date}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between text-sm pt-4 border-t border-border/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Faturamento diário</span>
          </div>
        </div>
        <div className="text-foreground font-medium">
          Total: R$ {totalRevenue.toFixed(2)}
        </div>
      </div>
    </Card>
  );
}