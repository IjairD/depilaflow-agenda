import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Dashboard } from '../components/Dashboard';
import { NewAppointment } from '../components/NewAppointment';
import { Agenda } from '../components/Agenda';
import { History } from '../components/History';
import { Settings } from '../components/Settings';
import { useToast } from '../hooks/use-toast';
import { Appointment, ViewType } from '../types';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  // Carrega dados salvos no localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nd-depilacao-appointments');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    } else {
      // Dados de exemplo para demonstração
      const sampleAppointments: Appointment[] = [
        {
          id: '1',
          clientName: 'Maria Silva',
          date: new Date().toISOString().split('T')[0],
          time: '14:00',
          service: 'Pernas Completas',
          price: 80,
          status: 'agendado',
          notes: 'Cliente preferencial',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          clientName: 'Ana Costa',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '16:30',
          service: 'Axilas',
          price: 25,
          status: 'confirmado',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          clientName: 'Carla Santos',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '10:00',
          service: 'Corpo Todo',
          price: 150,
          status: 'concluido',
          notes: 'Primeira vez - muito satisfeita',
          createdAt: new Date().toISOString(),
        },
      ];
      setAppointments(sampleAppointments);
    }
  }, []);

  // Salva dados no localStorage sempre que appointments mudam
  useEffect(() => {
    localStorage.setItem('nd-depilacao-appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleSaveAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
    toast({
      title: "Agendamento criado!",
      description: `Agendamento para ${appointment.clientName} foi criado com sucesso.`,
    });
    setCurrentView('agenda');
  };

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      )
    );
    toast({
      title: "Status atualizado!",
      description: `Agendamento foi marcado como ${status}.`,
    });
  };

  const handleDeleteAppointment = (id: string) => {
    const appointment = appointments.find(apt => apt.id === id);
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    toast({
      title: "Agendamento removido!",
      description: `Agendamento de ${appointment?.clientName} foi removido.`,
      variant: "destructive",
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard appointments={appointments} />;
      case 'agenda':
        return (
          <Agenda 
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            onDeleteAppointment={handleDeleteAppointment}
          />
        );
      case 'novo-agendamento':
        return <NewAppointment onSave={handleSaveAppointment} />;
      case 'historico':
        return <History appointments={appointments} />;
      case 'configuracoes':
        return <Settings />;
      default:
        return <Dashboard appointments={appointments} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
};

export default Index;
