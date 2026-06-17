export enum AssignmentType {
    OPEN_MARKET = 'OPEN_MARKET',
    DIRECT_TRANSPORTER = 'DIRECT_TRANSPORTER'
}

export enum LoadStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    IN_TRANSIT = 'IN_TRANSIT',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    DRAFT = 'DRAFT',
    PENDING_ACCEPTANCE = 'PENDING_ACCEPTANCE',
    ACCEPTED = 'ACCEPTED',
    DRIVER_ASSIGNMENT_PENDING = 'DRIVER_ASSIGNMENT_PENDING',
    REJECTED = 'REJECTED'
}

export interface Load {
    id?: number;
    source: string;
    destination: string;
    weight: number;
    materialType?: string;
    description?: string;
    pickupDate?: string;
    budget?: number;
    status?: LoadStatus;
    isBiddingEnabled?: boolean;
    assignmentType?: AssignmentType;
    transporterId?: number;
}

export interface ReturnLoadSuggestionResponse {
    loadId: number;
    sourceCity: string;
    destinationCity: string;
    material: string;
    weight: number;
    shipperAmount: number;
    loadStatus: LoadStatus;
    createdAt: string;
}

export interface FuelProfitCalculationResponse {
    distanceKm: number;
    averageMileage: number;
    dieselRate: number;
    estimatedFuelConsumption: number;
    estimatedFuelCost: number;
    estimatedProfit: number;
    profitClassification: 'GOOD' | 'MEDIUM' | 'LOW';
}

export interface DriverAvailabilitySummaryResponse {
    availableDriversCount: number;
    onTripDriversCount: number;
    offlineDriversCount: number;
    cityWiseAvailableDrivers: Record<string, number>;
}

export enum DriverAvailabilityStatus {
    AVAILABLE = 'AVAILABLE',
    ON_TRIP = 'ON_TRIP',
    OFFLINE = 'OFFLINE'
}

export interface Driver {
    id: number;
    fullName: string;
    mobile: string;
    city?: string;
    availabilityStatus?: DriverAvailabilityStatus;
    preferredVehicleType?: string;
    isAvailable?: boolean; // Deprecated
    isOnTrip?: boolean; // Deprecated
    lastSeenAt?: string;
}
