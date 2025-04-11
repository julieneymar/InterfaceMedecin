
import { useState, useEffect } from "react";
import { 
  vitalSigns, 
  patients 
} from "@/data/mockData";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, Calendar, Download, Filter } from "lucide-react";

const History = () => {
  const [patientFilter, setPatientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredData, setFilteredData] = useState(vitalSigns);
  
  useEffect(() => {
    let filtered = [...vitalSigns];
    
    // Filter by patient
    if (patientFilter !== "all") {
      filtered = filtered.filter((sign) => sign.patientId === patientFilter);
    }
    
    // Filter by vital sign type
    if (typeFilter !== "all") {
      filtered = filtered.filter((sign) => sign.type === typeFilter);
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((sign) => sign.status === statusFilter);
    }
    
    // Sort by newest first
    filtered = filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setFilteredData(filtered);
  }, [patientFilter, typeFilter, statusFilter]);
  
  const getVitalSignName = (type: string): string => {
    switch (type) {
      case "heart_rate":
        return "Fréquence cardiaque";
      case "blood_pressure":
        return "Pression artérielle";
      case "temperature":
        return "Température";
      case "oxygen_saturation":
        return "Saturation en oxygène";
      case "respiratory_rate":
        return "Fréquence respiratoire";
      default:
        return type;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Critique
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Attention
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Normal
          </span>
        );
    }
  };
  
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Inconnu";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select value={patientFilter} onValueChange={setPatientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les patients</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de mesure</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="heart_rate">Fréquence cardiaque</SelectItem>
                  <SelectItem value="blood_pressure">Pression artérielle</SelectItem>
                  <SelectItem value="temperature">Température</SelectItem>
                  <SelectItem value="oxygen_saturation">Saturation en oxygène</SelectItem>
                  <SelectItem value="respiratory_rate">Fréquence respiratoire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Attention</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Mesures enregistrées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date et heure</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Type de mesure</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((sign) => (
                <TableRow key={sign.id}>
                  <TableCell>
                    {format(new Date(sign.timestamp), "dd/MM/yyyy HH:mm", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>{getPatientName(sign.patientId)}</TableCell>
                  <TableCell>{getVitalSignName(sign.type)}</TableCell>
                  <TableCell>
                    {sign.value} {sign.unit}
                  </TableCell>
                  <TableCell>{getStatusBadge(sign.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
