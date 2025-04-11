
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAlertCounts, patients } from "@/data/mockData";
import { 
  AlertTriangle, 
  Heart, 
  Thermometer, 
  Droplets, 
  Stethoscope, 
  Users, 
  User, 
  BarChart4 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
  const { warning, critical } = getAlertCounts();
  const totalAlerts = warning + critical;
  
  // Generate sample data for the chart
  const getDaysAgo = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return format(date, 'dd MMM', { locale: fr });
  };
  
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    name: getDaysAgo(6 - i),
    temperature: Math.random() * 2 + 36,
    heart_rate: Math.random() * 30 + 70,
    blood_pressure: Math.random() * 20 + 120,
  }));
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 nouveaux cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{critical}</div>
            <p className="text-xs text-muted-foreground">
              Nécessite une attention immédiate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-medical-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warning}</div>
            <p className="text-xs text-muted-foreground">
              À surveiller
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut Global</CardTitle>
            <Stethoscope className={`h-4 w-4 ${totalAlerts > 0 ? "text-medical-warning" : "text-medical-success"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlerts > 0 ? "Attention" : "Normal"}</div>
            <p className="text-xs text-muted-foreground">
              {totalAlerts > 0 ? `${totalAlerts} alertes actives` : "Tous les signes vitaux normaux"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 lg:col-span-4">
          <CardHeader>
            <CardTitle>Tendances des Signes Vitaux</CardTitle>
            <CardDescription>
              Vue d'ensemble de l'activité des derniers 7 jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="heart_rate" 
                    stroke="#EF4444" 
                    name="Fréq. Cardiaque (bpm)"
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#0EA5E9" 
                    name="Température (°C)"
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="blood_pressure" 
                    stroke="#10B981" 
                    name="Pression Artérielle (sys)"
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-7 lg:col-span-3">
          <CardHeader>
            <CardTitle>Résumé des Alertes</CardTitle>
            <CardDescription>
              Patients nécessitant une attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-red-100 p-2">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Fréquence cardiaque élevée</p>
                  <p className="text-sm text-muted-foreground">Patient: Marie Martin</p>
                </div>
                <div className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                  Critique
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-amber-100 p-2">
                  <Thermometer className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Température légèrement élevée</p>
                  <p className="text-sm text-muted-foreground">Patient: Jean Dupont</p>
                </div>
                <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-600">
                  Attention
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-amber-100 p-2">
                  <Droplets className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Saturation d'oxygène basse</p>
                  <p className="text-sm text-muted-foreground">Patient: Thomas Bernard</p>
                </div>
                <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-600">
                  Attention
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-amber-100 p-2">
                  <BarChart4 className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Pression artérielle élevée</p>
                  <p className="text-sm text-muted-foreground">Patient: Louis Rousseau</p>
                </div>
                <div className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-600">
                  Attention
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
