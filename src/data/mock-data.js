/* ============================================
   CITY AI — Mock Data (Visakhapatnam, Andhra Pradesh)
   Synthetic dataset for hackathon prototype
   ============================================ */

export const CITY_INFO = {
  city: 'Visakhapatnam',
  state: 'Andhra Pradesh',
  country: 'India',
  center: [17.7285, 83.2850],
  timezone: 'IST (UTC+5:30)',
};

// Camera Nodes across Visakhapatnam
export const cameras = [
  { id: 'VSKP-C01', name: 'NAD Junction', lat: 17.7471, lon: 83.2476, road: 'NH-16 / Gopalapatnam Rd', direction: 'North-West', zone: 'North Corridor', status: 'online', traffic: 'high', avgSpeed: 22.4, vehiclesToday: 16840 },
  { id: 'VSKP-C02', name: 'Maddilapalem', lat: 17.7358, lon: 83.3176, road: 'Siripuram Jn Corridor', direction: 'East', zone: 'Central Corridor', status: 'online', traffic: 'moderate', avgSpeed: 34.2, vehiclesToday: 13920 },
  { id: 'VSKP-C03', name: 'MVP Colony', lat: 17.7441, lon: 83.3387, road: 'Sector 1 Main Road', direction: 'North-East', zone: 'East Corridor', status: 'online', traffic: 'low', avgSpeed: 42.1, vehiclesToday: 8410 },
  { id: 'VSKP-C04', name: 'Gajuwaka Junction', lat: 17.6868, lon: 83.2185, road: 'Old Gajuwaka Main Road', direction: 'South-West', zone: 'Industrial Corridor', status: 'online', traffic: 'high', avgSpeed: 19.8, vehiclesToday: 19430 },
  { id: 'VSKP-C05', name: 'Siripuram Circle', lat: 17.7215, lon: 83.3180, road: 'VIP Road', direction: 'South', zone: 'Central Corridor', status: 'online', traffic: 'moderate', avgSpeed: 28.5, vehiclesToday: 11240 },
  { id: 'VSKP-C06', name: 'RTC Complex', lat: 17.7256, lon: 83.3075, road: 'Dwaraka Nagar Road', direction: 'West', zone: 'Commercial Center', status: 'online', traffic: 'high', avgSpeed: 16.5, vehiclesToday: 21890 },
  { id: 'VSKP-C07', name: 'Airport Road', lat: 17.7212, lon: 83.2244, road: 'NH-16 Airport Flyover', direction: 'West', zone: 'North Corridor', status: 'online', traffic: 'moderate', avgSpeed: 44.8, vehiclesToday: 9820 },
  { id: 'VSKP-C08', name: 'NH-16 BRTS Corridor', lat: 17.7295, lon: 83.2746, road: 'BRTS Highway', direction: 'North-West', zone: 'North Corridor', status: 'online', traffic: 'high', avgSpeed: 24.6, vehiclesToday: 18320 },
  { id: 'VSKP-C09', name: 'Steel Plant Road', lat: 17.6540, lon: 83.1720, road: 'Kurmannapalem Jn', direction: 'South', zone: 'Industrial Corridor', status: 'warning', traffic: 'moderate', avgSpeed: 38.0, vehiclesToday: 7650 },
  { id: 'VSKP-C10', name: 'Rushikonda Beach Road', lat: 17.7815, lon: 83.3850, road: 'Beach Road Corridor', direction: 'North-East', zone: 'Coastline Corridor', status: 'online', traffic: 'low', avgSpeed: 48.6, vehiclesToday: 6420 },
  { id: 'VSKP-C11', name: 'Jagadamba Junction', lat: 17.7137, lon: 83.3018, road: 'Commercial Hub', direction: 'Central', zone: 'Commercial Center', status: 'online', traffic: 'critical', avgSpeed: 12.1, vehiclesToday: 24890 },
  { id: 'VSKP-C12', name: 'Pendurthi Junction', lat: 17.7823, lon: 83.2143, road: 'SH-39 State Highway', direction: 'North', zone: 'Outer Bypass', status: 'offline', traffic: 'unknown', avgSpeed: 0.0, vehiclesToday: 0 },
];

// Multi-State Demo Vehicle Dataset
export const vehicles = [
  {
    plate: 'AP31BK4821',
    stateName: 'Andhra Pradesh (Visakhapatnam)',
    type: 'Car (SUV)',
    color: 'Pearl White',
    status: 'active',
    firstDetected: '09:42:31 IST',
    lastDetected: '10:21:04 IST',
    camerasVisited: 7,
    distance: 16.4,
    confidence: 0.96,
    trajectory: [
      { camera: 'VSKP-C01', time: '09:42:31 IST', lat: 17.7471, lon: 83.2476, speed: 38, confidence: 0.96 },
      { camera: 'VSKP-C08', time: '09:50:18 IST', lat: 17.7295, lon: 83.2746, speed: 42, confidence: 0.95 },
      { camera: 'VSKP-C06', time: '09:58:42 IST', lat: 17.7256, lon: 83.3075, speed: 22, confidence: 0.97 },
      { camera: 'VSKP-C11', time: '10:06:55 IST', lat: 17.7137, lon: 83.3018, speed: 18, confidence: 0.94 },
      { camera: 'VSKP-C05', time: '10:12:21 IST', lat: 17.7215, lon: 83.3180, speed: 31, confidence: 0.95 },
      { camera: 'VSKP-C02', time: '10:16:33 IST', lat: 17.7358, lon: 83.3176, speed: 35, confidence: 0.93 },
      { camera: 'VSKP-C03', time: '10:21:04 IST', lat: 17.7441, lon: 83.3387, speed: 40, confidence: 0.94 },
    ]
  },
  {
    plate: 'TS08JK1234',
    stateName: 'Telangana (Medchal / Hyd)',
    type: 'Car (Sedan)',
    color: 'Silver Grey',
    status: 'active',
    firstDetected: '08:15:22 IST',
    lastDetected: '09:44:18 IST',
    camerasVisited: 5,
    distance: 12.8,
    confidence: 0.92,
    trajectory: [
      { camera: 'VSKP-C07', time: '08:15:22 IST', lat: 17.7212, lon: 83.2244, speed: 45, confidence: 0.92 },
      { camera: 'VSKP-C01', time: '08:26:41 IST', lat: 17.7471, lon: 83.2476, speed: 36, confidence: 0.90 },
      { camera: 'VSKP-C08', time: '08:42:12 IST', lat: 17.7295, lon: 83.2746, speed: 40, confidence: 0.93 },
      { camera: 'VSKP-C06', time: '09:12:33 IST', lat: 17.7256, lon: 83.3075, speed: 20, confidence: 0.91 },
      { camera: 'VSKP-C11', time: '09:44:18 IST', lat: 17.7137, lon: 83.3018, speed: 15, confidence: 0.89 },
    ]
  },
  {
    plate: 'AP39CD5678',
    stateName: 'Andhra Pradesh (Tirupati)',
    type: 'Car (Hatchback)',
    color: 'Crimson Red',
    status: 'active',
    firstDetected: '10:05:11 IST',
    lastDetected: '10:38:22 IST',
    camerasVisited: 3,
    distance: 7.2,
    confidence: 0.94,
    trajectory: [
      { camera: 'VSKP-C05', time: '10:05:11 IST', lat: 17.7215, lon: 83.3180, speed: 28, confidence: 0.94 },
      { camera: 'VSKP-C02', time: '10:22:41 IST', lat: 17.7358, lon: 83.3176, speed: 32, confidence: 0.92 },
      { camera: 'VSKP-C03', time: '10:38:22 IST', lat: 17.7441, lon: 83.3387, speed: 38, confidence: 0.95 },
    ]
  },
  {
    plate: 'AP31AB1234',
    stateName: 'Andhra Pradesh (Visakhapatnam)',
    type: 'Truck (Heavy Goods)',
    color: 'Dark Navy',
    status: 'blacklisted',
    firstDetected: '10:18:44 IST',
    lastDetected: '10:21:04 IST',
    camerasVisited: 2,
    distance: 4.8,
    confidence: 0.97,
    trajectory: [
      { camera: 'VSKP-C07', time: '10:18:44 IST', lat: 17.7212, lon: 83.2244, speed: 42, confidence: 0.97 },
      { camera: 'VSKP-C01', time: '10:21:04 IST', lat: 17.7471, lon: 83.2476, speed: 35, confidence: 0.96 },
    ]
  },
  {
    plate: 'KA03MN5678',
    stateName: 'Karnataka (Bengaluru East)',
    type: 'Two Wheeler (Motorcycle)',
    color: 'Matte Black',
    status: 'active',
    firstDetected: '09:15:33 IST',
    lastDetected: '09:48:12 IST',
    camerasVisited: 4,
    distance: 9.1,
    confidence: 0.93,
    trajectory: [
      { camera: 'VSKP-C02', time: '09:15:33 IST', lat: 17.7358, lon: 83.3176, speed: 36, confidence: 0.93 },
      { camera: 'VSKP-C03', time: '09:24:18 IST', lat: 17.7441, lon: 83.3387, speed: 42, confidence: 0.91 },
      { camera: 'VSKP-C10', time: '09:35:44 IST', lat: 17.7815, lon: 83.3850, speed: 48, confidence: 0.94 },
      { camera: 'VSKP-C02', time: '09:48:12 IST', lat: 17.7358, lon: 83.3176, speed: 34, confidence: 0.92 },
    ]
  },
  {
    plate: 'OD02PQ9012',
    stateName: 'Odisha (Bhubaneswar)',
    type: 'Bus (Intercity Coach)',
    color: 'Green & White',
    status: 'active',
    firstDetected: '08:30:10 IST',
    lastDetected: '09:18:25 IST',
    camerasVisited: 3,
    distance: 14.5,
    confidence: 0.95,
    trajectory: [
      { camera: 'VSKP-C01', time: '08:30:10 IST', lat: 17.7471, lon: 83.2476, speed: 45, confidence: 0.95 },
      { camera: 'VSKP-C08', time: '08:52:19 IST', lat: 17.7295, lon: 83.2746, speed: 38, confidence: 0.96 },
      { camera: 'VSKP-C06', time: '09:18:25 IST', lat: 17.7256, lon: 83.3075, speed: 20, confidence: 0.93 },
    ]
  },
  {
    plate: 'TN09RS3456',
    stateName: 'Tamil Nadu (Chennai)',
    type: 'LCV (Delivery Van)',
    color: 'White',
    status: 'active',
    firstDetected: '09:05:40 IST',
    lastDetected: '09:55:12 IST',
    camerasVisited: 4,
    distance: 11.6,
    confidence: 0.91,
    trajectory: [
      { camera: 'VSKP-C04', time: '09:05:40 IST', lat: 17.6868, lon: 83.2185, speed: 32, confidence: 0.91 },
      { camera: 'VSKP-C07', time: '09:22:15 IST', lat: 17.7212, lon: 83.2244, speed: 40, confidence: 0.90 },
      { camera: 'VSKP-C01', time: '09:39:50 IST', lat: 17.7471, lon: 83.2476, speed: 35, confidence: 0.92 },
      { camera: 'VSKP-C08', time: '09:55:12 IST', lat: 17.7295, lon: 83.2746, speed: 28, confidence: 0.91 },
    ]
  },
  {
    plate: 'AP16EF9012',
    stateName: 'Andhra Pradesh (Vijayawada)',
    type: 'Auto Rickshaw',
    color: 'Yellow & Black',
    status: 'active',
    firstDetected: '09:40:15 IST',
    lastDetected: '10:15:30 IST',
    camerasVisited: 3,
    distance: 5.2,
    confidence: 0.93,
    trajectory: [
      { camera: 'VSKP-C11', time: '09:40:15 IST', lat: 17.7137, lon: 83.3018, speed: 24, confidence: 0.93 },
      { camera: 'VSKP-C06', time: '09:58:20 IST', lat: 17.7256, lon: 83.3075, speed: 20, confidence: 0.94 },
      { camera: 'VSKP-C05', time: '10:15:30 IST', lat: 17.7215, lon: 83.3180, speed: 22, confidence: 0.92 },
    ]
  },
  {
    plate: 'MH12XY9876',
    stateName: 'Maharashtra (Pune)',
    type: 'Car (SUV)',
    color: 'Carbon Black',
    status: 'suspicious',
    firstDetected: '07:32:18 IST',
    lastDetected: '10:45:22 IST',
    camerasVisited: 6,
    distance: 21.8,
    confidence: 0.88,
    trajectory: [
      { camera: 'VSKP-C07', time: '07:32:18 IST', lat: 17.7212, lon: 83.2244, speed: 52, confidence: 0.88 },
      { camera: 'VSKP-C01', time: '08:05:21 IST', lat: 17.7471, lon: 83.2476, speed: 44, confidence: 0.90 },
      { camera: 'VSKP-C08', time: '08:35:44 IST', lat: 17.7295, lon: 83.2746, speed: 38, confidence: 0.87 },
      { camera: 'VSKP-C04', time: '09:15:33 IST', lat: 17.6868, lon: 83.2185, speed: 30, confidence: 0.89 },
      { camera: 'VSKP-C09', time: '09:55:12 IST', lat: 17.6540, lon: 83.1720, speed: 45, confidence: 0.86 },
      { camera: 'VSKP-C04', time: '10:45:22 IST', lat: 17.6868, lon: 83.2185, speed: 28, confidence: 0.90 },
    ]
  }
];

// Alert Dataset (Demo Watchlist & City Events)
export const alerts = [
  {
    id: 'ALT-001',
    type: 'blacklisted',
    severity: 'critical',
    title: 'WATCHLIST VEHICLE DETECTED',
    plate: 'AP31AB1234',
    camera: 'VSKP-C07',
    time: '10:21:04 IST',
    confidence: 0.97,
    description: 'Vehicle registered in Demo Watchlist (reported stolen). Detected heading towards NH-16 / Airport Road Flyover.',
    acknowledged: false
  },
  {
    id: 'ALT-002',
    type: 'route_anomaly',
    severity: 'critical',
    title: 'ROUTE ANOMALY DETECTED',
    plate: 'MH12XY9876',
    camera: 'VSKP-C09',
    time: '10:12:55 IST',
    confidence: 0.86,
    description: 'Vehicle MH12XY9876 deviated from usual NH-16 corridor into Steel Plant Industrial Road.',
    expectedRoute: ['VSKP-C01', 'VSKP-C08', 'VSKP-C06'],
    actualRoute: ['VSKP-C01', 'VSKP-C04', 'VSKP-C09'],
    acknowledged: false
  },
  {
    id: 'ALT-003',
    type: 'speed_violation',
    severity: 'critical',
    title: 'SPEED LIMIT VIOLATION',
    plate: 'MH12XY9876',
    camera: 'VSKP-C07',
    time: '07:32:18 IST',
    confidence: 0.88,
    description: 'Vehicle registered speed 52 km/h in a 40 km/h restricted zone near Airport Flyover.',
    acknowledged: false
  },
  {
    id: 'ALT-004',
    type: 'congestion',
    severity: 'warning',
    title: 'HIGH TRAFFIC CONGESTION',
    plate: null,
    camera: 'VSKP-C11',
    time: '09:45:00 IST',
    confidence: null,
    description: 'Jagadamba Junction experiencing dense commercial traffic. Average speed reduced to 12.1 km/h.',
    acknowledged: false
  },
  {
    id: 'ALT-005',
    type: 'congestion',
    severity: 'warning',
    title: 'CORRIDOR SLOWDOWN',
    plate: null,
    camera: 'VSKP-C06',
    time: '09:30:00 IST',
    confidence: null,
    description: 'RTC Complex / Dwaraka Nagar area registering slowdown due to peak bus transit rush.',
    acknowledged: true
  },
  {
    id: 'ALT-006',
    type: 'camera_offline',
    severity: 'warning',
    title: 'CAMERA NODE OFFLINE',
    plate: null,
    camera: 'VSKP-C12',
    time: '08:15:00 IST',
    confidence: null,
    description: 'Camera node VSKP-C12 at Pendurthi Junction offline. Network telemetry alert logged.',
    acknowledged: false
  },
  {
    id: 'ALT-007',
    type: 'blacklisted',
    severity: 'warning',
    title: 'WATCHLIST VEHICLE PROXIMITY',
    plate: 'AP31AB1234',
    camera: 'VSKP-C01',
    time: '10:18:44 IST',
    confidence: 0.96,
    description: 'Demo Watchlist vehicle detected passing NAD Junction checkpoint heading towards NH-16 corridor.',
    acknowledged: true
  },
  {
    id: 'ALT-008',
    type: 'detection',
    severity: 'info',
    title: 'OUT-OF-STATE TRANSIT CLUSTER',
    plate: null,
    camera: 'VSKP-C07',
    time: '09:15:00 IST',
    confidence: null,
    description: '14 out-of-state registrations (TS, KA, OD, TN, MH) detected on NH-16 Airport corridor within 30 minutes.',
    acknowledged: false
  },
  {
    id: 'ALT-009',
    type: 'detection',
    severity: 'info',
    title: 'BEACH ROAD PEAK TRAFFIC',
    plate: null,
    camera: 'VSKP-C10',
    time: '10:00:00 IST',
    confidence: null,
    description: 'Rushikonda Beach Road registering 26% higher two-wheeler leisure traffic compared to weekday average.',
    acknowledged: true
  }
];

// Indian Traffic Distribution (Visakhapatnam Traffic Pattern)
export const vehicleTypes = [
  { type: 'Two Wheeler', count: 64908, percentage: 52.0, color: '#22C55E' },
  { type: 'Car', count: 38695, percentage: 31.0, color: '#3B82F6' },
  { type: 'Auto Rickshaw', count: 9986, percentage: 8.0, color: '#F59E0B' },
  { type: 'Bus', count: 4993, percentage: 4.0, color: '#8B5CF6' },
  { type: 'Truck', count: 3745, percentage: 3.0, color: '#EF4444' },
  { type: 'LCV & Other', count: 2496, percentage: 2.0, color: '#06B6D4' },
];

// Hourly Vehicle Flow Timeseries (Visakhapatnam Peak Rush)
export const trafficFlow = {
  labels: ['00:00 IST', '02:00 IST', '04:00 IST', '06:00 IST', '08:00 IST', '10:00 IST', '12:00 IST', '14:00 IST', '16:00 IST', '18:00 IST', '20:00 IST', '22:00 IST'],
  datasets: [
    { label: 'Two Wheelers', data: [180, 90, 45, 380, 1420, 1980, 1340, 1180, 1260, 1860, 1420, 420], color: '#22C55E' },
    { label: 'Cars', data: [120, 70, 40, 210, 890, 1240, 980, 820, 760, 1180, 920, 310], color: '#3B82F6' },
    { label: 'Auto Rickshaws', data: [50, 25, 15, 140, 420, 580, 460, 410, 390, 540, 380, 110], color: '#F59E0B' },
    { label: 'Buses & Trucks', data: [65, 75, 80, 125, 300, 365, 320, 325, 345, 320, 215, 90], color: '#8B5CF6' },
  ]
};

// Congestion by Visakhapatnam Zone
export const congestionZones = [
  { zone: 'Jagadamba Jn', value: 92, color: '#EF4444' },
  { zone: 'RTC Complex', value: 84, color: '#EF4444' },
  { zone: 'NAD Junction', value: 76, color: '#F59E0B' },
  { zone: 'Gajuwaka Jn', value: 72, color: '#F59E0B' },
  { zone: 'Siripuram Circle', value: 58, color: '#F59E0B' },
  { zone: 'Maddilapalem', value: 46, color: '#22C55E' },
  { zone: 'Airport Road', value: 34, color: '#22C55E' },
  { zone: 'MVP Colony', value: 24, color: '#22C55E' },
  { zone: 'Rushikonda Rd', value: 18, color: '#22C55E' },
  { zone: 'Steel Plant Rd', value: 16, color: '#22C55E' },
];

// Origin-Destination Matrix between Key Visakhapatnam Camera Nodes
export const odMatrix = {
  zones: ['VSKP-C01', 'VSKP-C02', 'VSKP-C04', 'VSKP-C06', 'VSKP-C07', 'VSKP-C08', 'VSKP-C11'],
  data: [
    [0, 212, 385, 412, 520, 680, 340],
    [195, 0, 145, 380, 190, 240, 290],
    [410, 120, 0, 290, 310, 450, 210],
    [380, 395, 270, 0, 240, 360, 580],
    [540, 180, 320, 230, 0, 480, 190],
    [690, 260, 440, 370, 490, 0, 310],
    [330, 310, 190, 590, 180, 320, 0],
  ]
};

// Recent Live ANPR Detections
export const recentDetections = [
  { plate: 'AP31BK4821', camera: 'VSKP-C01', time: '10:42:31 IST', confidence: 0.96, type: 'Car (SUV)', state: 'Andhra Pradesh' },
  { plate: 'TS08JK1234', camera: 'VSKP-C07', time: '10:41:18 IST', confidence: 0.92, type: 'Car (Sedan)', state: 'Telangana' },
  { plate: 'AP39CD5678', camera: 'VSKP-C05', time: '10:40:55 IST', confidence: 0.94, type: 'Car (Hatchback)', state: 'Andhra Pradesh' },
  { plate: 'KA03MN5678', camera: 'VSKP-C02', time: '10:39:22 IST', confidence: 0.93, type: 'Two Wheeler', state: 'Karnataka' },
  { plate: 'AP31AB1234', camera: 'VSKP-C08', time: '10:38:44 IST', confidence: 0.97, type: 'Truck', state: 'Andhra Pradesh' },
  { plate: 'OD02PQ9012', camera: 'VSKP-C06', time: '10:37:18 IST', confidence: 0.95, type: 'Bus', state: 'Odisha' },
  { plate: 'TN09RS3456', camera: 'VSKP-C04', time: '10:36:01 IST', confidence: 0.91, type: 'LCV', state: 'Tamil Nadu' },
  { plate: 'AP16EF9012', camera: 'VSKP-C11', time: '10:34:45 IST', confidence: 0.93, type: 'Auto Rickshaw', state: 'Andhra Pradesh' },
  { plate: 'MH12XY9876', camera: 'VSKP-C09', time: '10:33:22 IST', confidence: 0.88, type: 'Car (SUV)', state: 'Maharashtra' },
  { plate: 'AP05GH4321', camera: 'VSKP-C03', time: '10:32:10 IST', confidence: 0.94, type: 'Two Wheeler', state: 'Andhra Pradesh' },
];

// Demo Watchlist Plates
export const blacklist = [
  'AP31AB1234',
  'TS09XY5678',
  'MH14ZZ9999',
];

// Visakhapatnam City KPIs
export const kpiData = {
  totalCameras: 42,
  camerasOnline: 41,
  camerasNew: 3,
  totalVehicles: 124823,
  vehiclesChange: 12.4,
  activeAlerts: 9,
  criticalAlerts: 3,
  congestionLevel: 63,
  congestionChange: 8,
  avgSpeed: 32.4,
  totalDetections: 12842,
};
