import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Save, Smartphone, Clock, DollarSign, User, Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    businessName: 'ND Depilação',
    ownerName: 'Profissional',
    phone: '',
    email: '',
    workingHours: {
      start: '08:00',
      end: '18:00',
    },
    notifications: {
      email: true,
      sms: false,
      reminder: true,
    },
    defaultServices: [
      { name: 'Pernas Completas', price: 80 },
      { name: 'Axilas', price: 25 },
      { name: 'Virilha', price: 35 },
    ],
    reminderTime: '1', // horas antes
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    
    // Aqui seria integrado com o backend/localStorage
    console.log('Settings saved:', settings);
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h2 className="text-3xl font-bold text-foreground mb-2">Configurações</h2>
        <p className="text-muted-foreground">
          Personalize seu sistema de acordo com suas necessidades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Negócio */}
        <Card className="glass p-6 border-0 shadow-glass animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-light">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Informações do Negócio
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Nome do Negócio</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => updateSetting('businessName', e.target.value)}
                className="glass"
              />
            </div>

            <div>
              <Label htmlFor="ownerName">Seu Nome</Label>
              <Input
                id="ownerName"
                value={settings.ownerName}
                onChange={(e) => updateSetting('ownerName', e.target.value)}
                className="glass"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={settings.phone}
                onChange={(e) => updateSetting('phone', e.target.value)}
                className="glass"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
                className="glass"
              />
            </div>
          </div>
        </Card>

        {/* Horário de Funcionamento */}
        <Card className="glass p-6 border-0 shadow-glass animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-warning-light">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Horário de Funcionamento
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="startTime">Horário de Abertura</Label>
              <Input
                id="startTime"
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => updateSetting('workingHours.start', e.target.value)}
                className="glass"
              />
            </div>

            <div>
              <Label htmlFor="endTime">Horário de Fechamento</Label>
              <Input
                id="endTime"
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => updateSetting('workingHours.end', e.target.value)}
                className="glass"
              />
            </div>

            <div>
              <Label htmlFor="reminderTime">Lembrete (horas antes)</Label>
              <Select 
                value={settings.reminderTime} 
                onValueChange={(value) => updateSetting('reminderTime', value)}
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">30 minutos</SelectItem>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="24">1 dia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notificações */}
        <Card className="glass p-6 border-0 shadow-glass animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-success-light">
              <Bell className="w-5 h-5 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Notificações
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotif">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes por email
                </p>
              </div>
              <Switch
                id="emailNotif"
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSetting('notifications.email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotif">Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes por SMS
                </p>
              </div>
              <Switch
                id="smsNotif"
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => updateSetting('notifications.sms', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminderNotif">Lembretes de Agendamento</Label>
                <p className="text-sm text-muted-foreground">
                  Lembrar sobre próximos agendamentos
                </p>
              </div>
              <Switch
                id="reminderNotif"
                checked={settings.notifications.reminder}
                onCheckedChange={(checked) => updateSetting('notifications.reminder', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Serviços Padrão */}
        <Card className="glass p-6 border-0 shadow-glass animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-destructive-light">
              <DollarSign className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Preços dos Serviços
            </h3>
          </div>
          
          <div className="space-y-3">
            {settings.defaultServices.map((service, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  value={service.name}
                  onChange={(e) => {
                    const newServices = [...settings.defaultServices];
                    newServices[index].name = e.target.value;
                    updateSetting('defaultServices', newServices);
                  }}
                  className="glass flex-1"
                  placeholder="Nome do serviço"
                />
                <div className="w-24">
                  <Input
                    type="number"
                    step="0.01"
                    value={service.price}
                    onChange={(e) => {
                      const newServices = [...settings.defaultServices];
                      newServices[index].price = parseFloat(e.target.value) || 0;
                      updateSetting('defaultServices', newServices);
                    }}
                    className="glass"
                    placeholder="Preço"
                  />
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={() => {
                const newServices = [...settings.defaultServices, { name: '', price: 0 }];
                updateSetting('defaultServices', newServices);
              }}
              className="w-full glass-primary"
            >
              Adicionar Serviço
            </Button>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end animate-scale-in">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-gradient min-w-32"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

    </div>
  );
}