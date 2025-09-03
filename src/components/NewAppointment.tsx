import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, DollarSign, Save, User, Scissors } from 'lucide-react';
import { Appointment } from '../types';

interface NewAppointmentProps {
  onSave: (appointment: Appointment) => void;
  onCancel?: () => void;
}

const services = [
  { name: 'Íntima completa', price: 55 },
  { name: 'Axilas', price: 18 },
  { name: 'Buço', price: 10 },
  { name: 'Perna inteira', price: 45 },
  { name: 'Meia perna', price: 25 },
  { name: 'Braço', price: 25 },
  { name: 'Glúteos', price: 18 },
  { name: 'Íntima cavada', price: 25 },
  { name: 'Rosto', price: 35 },
  { name: 'Barriga', price: 18 },
  { name: 'Depilação completa', price: 110 },
  { name: 'Outro', price: 0 },
];

export function NewAppointment({ onSave, onCancel }: NewAppointmentProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    date: '',
    time: '',
    service1: '',
    service2: '',
    service3: '',
    price: 0,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Nome da cliente é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    if (!formData.service1) {
      newErrors.service1 = 'Primeiro serviço é obrigatório';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simula delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Combine services
    const selectedServices = [formData.service1, formData.service2, formData.service3]
      .filter(service => service)
      .join(' + ');

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      date: formData.date,
      time: formData.time,
      service: selectedServices,
      price: formData.price,
      status: 'agendado',
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    onSave(newAppointment);
    
    // Reset form
    setFormData({
      clientName: '',
      date: '',
      time: '',
      service1: '',
      service2: '',
      service3: '',
      price: 0,
      notes: '',
    });
    
    setIsSubmitting(false);
  };

  const handleServiceChange = (serviceKey: 'service1' | 'service2' | 'service3', serviceName: string) => {
    const service = services.find(s => s.name === serviceName);
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [serviceKey]: serviceName,
      };
      
      // Calculate total price
      const service1Price = serviceKey === 'service1' ? (service?.price || 0) : 
        (services.find(s => s.name === prev.service1)?.price || 0);
      const service2Price = serviceKey === 'service2' ? (service?.price || 0) : 
        (services.find(s => s.name === prev.service2)?.price || 0);
      const service3Price = serviceKey === 'service3' ? (service?.price || 0) : 
        (services.find(s => s.name === prev.service3)?.price || 0);
      
      newFormData.price = service1Price + service2Price + service3Price;
      
      return newFormData;
    });
  };

  const clearForm = () => {
    setFormData({
      clientName: '',
      date: '',
      time: '',
      service1: '',
      service2: '',
      service3: '',
      price: 0,
      notes: '',
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold text-foreground mb-2">Novo Agendamento</h2>
        <p className="text-muted-foreground">
          Preencha os dados para criar um novo agendamento
        </p>
      </div>

      {/* Form */}
      <Card className="glass p-6 border-0 shadow-glass animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Nome da Cliente</span>
            </Label>
            <Input
              id="clientName"
              type="text"
              placeholder="Digite o nome da cliente"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className={`glass ${errors.clientName ? 'border-destructive' : ''}`}
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName}</p>
            )}
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Data</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={`glass ${errors.date ? 'border-destructive' : ''}`}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Horário</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className={`glass ${errors.time ? 'border-destructive' : ''}`}
              />
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Serviços */}
          <div className="space-y-4">
            <Label className="flex items-center space-x-2">
              <Scissors className="w-4 h-4" />
              <span>Serviços</span>
            </Label>
            
            {/* Primeiro Serviço (Obrigatório) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">1º Serviço (obrigatório)</Label>
              <Select value={formData.service1} onValueChange={(value) => handleServiceChange('service1', value)}>
                <SelectTrigger className={`glass ${errors.service1 ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Selecione o primeiro serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.name} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service1 && (
                <p className="text-sm text-destructive">{errors.service1}</p>
              )}
            </div>

            {/* Segundo Serviço (Opcional) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">2º Serviço (opcional)</Label>
              <Select value={formData.service2} onValueChange={(value) => handleServiceChange('service2', value)}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Selecione o segundo serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.name} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Terceiro Serviço (Opcional) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">3º Serviço (opcional)</Label>
              <Select value={formData.service3} onValueChange={(value) => handleServiceChange('service3', value)}>
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Selecione o terceiro serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.name} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preço Total */}
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Preço Total (R$)</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              className={`glass ${errors.price ? 'border-destructive' : ''}`}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre o agendamento..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="glass resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Agendamento'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              className="glass-primary"
            >
              Limpar Tudo
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Progress Indicator */}
      <Card className="glass p-4 border-0 shadow-glass animate-scale-in">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso do Formulário</span>
            <span className="text-sm text-muted-foreground">
              {getFormProgress(formData)}%
            </span>
          </div>
          <div className="progress-bar h-2">
            <div 
              className="progress-fill transition-all duration-500"
              style={{ width: `${getFormProgress(formData)}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function getFormProgress(formData: any): number {
  const fields = ['clientName', 'date', 'time', 'service1'];
  const filledFields = fields.filter(field => formData[field]?.toString().trim());
  const priceValid = formData.price > 0;
  
  return Math.round(((filledFields.length + (priceValid ? 1 : 0)) / (fields.length + 1)) * 100);
}