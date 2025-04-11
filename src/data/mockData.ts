
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  birthDate: string;
  bloodType: string;
  patientId: string;
  imageUrl?: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  type: 'heart_rate' | 'blood_pressure' | 'temperature' | 'oxygen_saturation' | 'respiratory_rate';
  value: number | string;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

// Mock patients data
export const patients: Patient[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'con',
    gender: 'male',
    birthDate: '1975-05-12',
    bloodType: 'A+',
    patientId: 'P-10001',
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'sansnom',
    gender: 'female',
    birthDate: '1982-09-28',
    bloodType: 'O-',
    patientId: 'P-10002',
  },
  {
    id: '3',
    firstName: 'Thomas',
    lastName: 'ifri',
    gender: 'male',
    birthDate: '1968-11-15',
    bloodType: 'AB+',
    patientId: 'P-10003',
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'iot',
    gender: 'female',
    birthDate: '1990-03-04',
    bloodType: 'B+',
    patientId: 'P-10004',
  },
  {
    id: '5',
    firstName: 'corbeil',
    lastName: 'afiwa',
    gender: 'male',
    birthDate: '1972-07-22',
    bloodType: 'A-',
    patientId: 'P-10005',
  },
];

// Generate random vital signs data
const generateVitalSigns = (): VitalSign[] => {
  const vitalSigns: VitalSign[] = [];
  const now = new Date();
  
  // Create data points for the last 7 days
  for (let i = 0; i < 7; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    
    // For each patient
    patients.forEach(patient => {
      // Heart rate (60-100 bpm is normal)
      const heartRate = Math.floor(Math.random() * 60) + 60;
      let heartRateStatus: 'normal' | 'warning' | 'critical' = 'normal';
      if (heartRate < 60 || heartRate > 100) heartRateStatus = 'warning';
      if (heartRate < 50 || heartRate > 120) heartRateStatus = 'critical';
      
      vitalSigns.push({
        id: `hr-${patient.id}-${i}`,
        patientId: patient.id,
        type: 'heart_rate',
        value: heartRate,
        unit: 'bpm',
        timestamp: day.toISOString(),
        status: heartRateStatus
      });
      
      // Blood pressure (120/80 is normal)
      const systolic = Math.floor(Math.random() * 60) + 100;
      const diastolic = Math.floor(Math.random() * 30) + 60;
      let bpStatus: 'normal' | 'warning' | 'critical' = 'normal';
      if (systolic > 140 || diastolic > 90) bpStatus = 'warning';
      if (systolic > 180 || diastolic > 120) bpStatus = 'critical';
      
      vitalSigns.push({
        id: `bp-${patient.id}-${i}`,
        patientId: patient.id,
        type: 'blood_pressure',
        value: `${systolic}/${diastolic}`,
        unit: 'mmHg',
        timestamp: day.toISOString(),
        status: bpStatus
      });
      
      // Temperature (36.1-37.2°C is normal)
      const temp = (Math.random() * 3 + 36).toFixed(1);
      const tempNum = parseFloat(temp);
      let tempStatus: 'normal' | 'warning' | 'critical' = 'normal';
      if (tempNum < 36.1 || tempNum > 37.2) tempStatus = 'warning';
      if (tempNum < 35 || tempNum > 39) tempStatus = 'critical';
      
      vitalSigns.push({
        id: `temp-${patient.id}-${i}`,
        patientId: patient.id,
        type: 'temperature',
        value: tempNum,
        unit: '°C',
        timestamp: day.toISOString(),
        status: tempStatus
      });
      
      // Oxygen saturation (95-100% is normal)
      const oxygenSat = Math.floor(Math.random() * 10) + 91;
      let oxygenStatus: 'normal' | 'warning' | 'critical' = 'normal';
      if (oxygenSat < 95) oxygenStatus = 'warning';
      if (oxygenSat < 90) oxygenStatus = 'critical';
      
      vitalSigns.push({
        id: `ox-${patient.id}-${i}`,
        patientId: patient.id,
        type: 'oxygen_saturation',
        value: oxygenSat,
        unit: '%',
        timestamp: day.toISOString(),
        status: oxygenStatus
      });
      
      // Respiratory rate (12-20 breaths per minute is normal)
      const respRate = Math.floor(Math.random() * 15) + 10;
      let respStatus: 'normal' | 'warning' | 'critical' = 'normal';
      if (respRate < 12 || respRate > 20) respStatus = 'warning';
      if (respRate < 8 || respRate > 25) respStatus = 'critical';
      
      vitalSigns.push({
        id: `rr-${patient.id}-${i}`,
        patientId: patient.id,
        type: 'respiratory_rate',
        value: respRate,
        unit: 'bpm',
        timestamp: day.toISOString(),
        status: respStatus
      });
    });
  }
  
  return vitalSigns;
};

export const vitalSigns = generateVitalSigns();

export const getPatientById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export const getPatientVitalSigns = (patientId: string): VitalSign[] => {
  return vitalSigns.filter(sign => sign.patientId === patientId);
};

export const getLatestVitalSigns = (patientId: string): {[key: string]: VitalSign} => {
  const result: {[key: string]: VitalSign} = {};
  const patientSigns = vitalSigns
    .filter(sign => sign.patientId === patientId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Get the latest reading for each type
  ['heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation', 'respiratory_rate'].forEach(type => {
    const latest = patientSigns.find(sign => sign.type === type);
    if (latest) {
      result[type] = latest;
    }
  });
  
  return result;
};

export const getAlertCounts = (): { warning: number, critical: number } => {
  // Get only the latest vital signs for each patient and type
  const latestSigns: VitalSign[] = [];
  
  patients.forEach(patient => {
    const patientLatestSigns = getLatestVitalSigns(patient.id);
    Object.values(patientLatestSigns).forEach(sign => {
      latestSigns.push(sign);
    });
  });
  
  const warningCount = latestSigns.filter(sign => sign.status === 'warning').length;
  const criticalCount = latestSigns.filter(sign => sign.status === 'critical').length;
  
  return { warning: warningCount, critical: criticalCount };
};
