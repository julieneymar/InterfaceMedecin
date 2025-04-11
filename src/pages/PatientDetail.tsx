
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  getPatientById, 
  getPatientVitalSigns, 
  getLatestVitalSigns,
  Patient, 
  VitalSign 
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  ArrowLeft, 
  Calendar, 
  Droplets, 
  Heart, 
  LineChart, 
  Wind, // Replaced Lungs with Wind icon which is similar
  Thermometer, 
  User 
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [latestVitalSigns, setLatestVitalSigns] = useState<{[key: string]: VitalSign}>({});
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  
  useEffect(() => {
    if (id) {
      const patientData = getPatientById(id);
      if (patientData) {
        setPatient(patientData);
        setLatestVitalSigns(getLatestVitalSigns(id));
        setVitalSigns(getPatientVitalSigns(id));
      }
    }
  }, [id]);
  
  if (!patient) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Patient non trouvé</h2>
          <p className="mt-2 text-muted-foreground">
            Le patient que vous recherchez n'existe pas.
          </p>
          <Link to="/patients">
            <Button className="mt-4">Retour à la liste des patients</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Process vital sign data for charts
  const prepareChartData = (type: 'heart_rate' | 'temperature' | 'oxygen_saturation' | 'respiratory_rate') => {
    const typeData = vitalSigns
      .filter(sign => sign.type === type)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(sign => ({
        date: format(new Date(sign.timestamp), 'dd/MM'),
        value: typeof sign.value === 'string' ? 0 : sign.value
      }));
    
    return typeData;
  };
  
  // Process blood pressure data specially
  const prepareBloodPressureData = () => {
    const bpData = vitalSigns
      .filter(sign => sign.type === 'blood_pressure')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(sign => {
        const [systolic, diastolic] = (sign.value as string).split('/').map(Number);
        return {
          date: format(new Date(sign.timestamp), 'dd/MM'),
          systolic,
          diastolic
        };
      });
    
    return bpData;
  };
  
  // Create formatted chart data
  const heartRateData = prepareChartData('heart_rate');
  const temperatureData = prepareChartData('temperature');
  const oxygenData = prepareChartData('oxygen_saturation');
  const respiratoryData = prepareChartData('respiratory_rate');
  const bloodPressureData = prepareBloodPressureData();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-medical-danger';
      case 'warning':
        return 'text-medical-warning';
      default:
        return 'text-medical-success';
    }
  };
  
  const getStatusIcon = (status: string) => {
    return status === 'normal' ? null : <AlertTriangle className="h-4 w-4" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/patients">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {patient.firstName} {patient.lastName}
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl bg-medical-accent text-medical-primary">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-muted-foreground">{patient.patientId}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-medical-primary" />
                <div>
                  <p className="text-sm font-medium leading-none">Genre</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.gender === 'male' ? 'Homme' : 'Femme'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-medical-primary" />
                <div>
                  <p className="text-sm font-medium leading-none">Date de naissance</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(patient.birthDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Droplets className="h-5 w-5 text-medical-primary" />
                <div>
                  <p className="text-sm font-medium leading-none">Groupe sanguin</p>
                  <p className="text-sm text-muted-foreground">{patient.bloodType}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-5 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fréquence Cardiaque</CardTitle>
                <Heart className={`h-4 w-4 ${getStatusColor(latestVitalSigns.heart_rate?.status || 'normal')}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestVitalSigns.heart_rate?.value || '—'} {latestVitalSigns.heart_rate?.unit || 'bpm'}
                </div>
                <div className="flex items-center">
                  <p className={`text-xs ${getStatusColor(latestVitalSigns.heart_rate?.status || 'normal')}`}>
                    {latestVitalSigns.heart_rate?.status === 'normal' ? 'Normal' :
                     latestVitalSigns.heart_rate?.status === 'warning' ? 'Attention' : 'Critique'}
                  </p>
                  {getStatusIcon(latestVitalSigns.heart_rate?.status || 'normal')}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pression Artérielle</CardTitle>
                <LineChart className={`h-4 w-4 ${getStatusColor(latestVitalSigns.blood_pressure?.status || 'normal')}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestVitalSigns.blood_pressure?.value || '—'} {latestVitalSigns.blood_pressure?.unit || 'mmHg'}
                </div>
                <div className="flex items-center">
                  <p className={`text-xs ${getStatusColor(latestVitalSigns.blood_pressure?.status || 'normal')}`}>
                    {latestVitalSigns.blood_pressure?.status === 'normal' ? 'Normal' :
                     latestVitalSigns.blood_pressure?.status === 'warning' ? 'Attention' : 'Critique'}
                  </p>
                  {getStatusIcon(latestVitalSigns.blood_pressure?.status || 'normal')}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Température</CardTitle>
                <Thermometer className={`h-4 w-4 ${getStatusColor(latestVitalSigns.temperature?.status || 'normal')}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestVitalSigns.temperature?.value || '—'} {latestVitalSigns.temperature?.unit || '°C'}
                </div>
                <div className="flex items-center">
                  <p className={`text-xs ${getStatusColor(latestVitalSigns.temperature?.status || 'normal')}`}>
                    {latestVitalSigns.temperature?.status === 'normal' ? 'Normal' :
                     latestVitalSigns.temperature?.status === 'warning' ? 'Attention' : 'Critique'}
                  </p>
                  {getStatusIcon(latestVitalSigns.temperature?.status || 'normal')}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saturation O²</CardTitle>
                <Droplets className={`h-4 w-4 ${getStatusColor(latestVitalSigns.oxygen_saturation?.status || 'normal')}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestVitalSigns.oxygen_saturation?.value || '—'} {latestVitalSigns.oxygen_saturation?.unit || '%'}
                </div>
                <div className="flex items-center">
                  <p className={`text-xs ${getStatusColor(latestVitalSigns.oxygen_saturation?.status || 'normal')}`}>
                    {latestVitalSigns.oxygen_saturation?.status === 'normal' ? 'Normal' :
                     latestVitalSigns.oxygen_saturation?.status === 'warning' ? 'Attention' : 'Critique'}
                  </p>
                  {getStatusIcon(latestVitalSigns.oxygen_saturation?.status || 'normal')}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tendances des Mesures</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="heart_rate">
                <TabsList className="mb-4">
                  <TabsTrigger value="heart_rate">Fréquence Cardiaque</TabsTrigger>
                  <TabsTrigger value="blood_pressure">Pression Artérielle</TabsTrigger>
                  <TabsTrigger value="temperature">Température</TabsTrigger>
                  <TabsTrigger value="oxygen">Saturation O²</TabsTrigger>
                  <TabsTrigger value="respiratory">Respiration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="heart_rate">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={heartRateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => [`${value} bpm`, 'Fréquence cardiaque']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Fréquence cardiaque"
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="blood_pressure">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={bloodPressureData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value, name) => [
                          `${value} mmHg`, 
                          name === 'systolic' ? 'Systolique' : 'Diastolique'
                        ]} />
                        <Line 
                          type="monotone" 
                          dataKey="systolic" 
                          stroke="#EF4444"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Systolique"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="diastolic" 
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Diastolique"
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="temperature">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={temperatureData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => [`${value} °C`, 'Température']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0EA5E9"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Température"
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="oxygen">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={oxygenData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[80, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Saturation en oxygène']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Saturation en oxygène"
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="respiratory">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={respiratoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => [`${value} bpm`, 'Fréquence respiratoire']} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Fréquence respiratoire"
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
