export const mockTeams = [
    { id: 1, name: "Maintenance" },
    { id: 2, name: "Production" },
    { id: 3, name: "IT Support" },
];

export const mockCompanies = [
    { id: 1, name: "My Company (San Francisco)" },
    { id: 2, name: "Chicago Branch" },
];

export const mockUsers = [
    { id: 1, name: "Mitchell Admin", email: "admin@example.com", role: "manager", avatarUrl: null },
    { id: 2, name: "Aka Foster", email: "foster@example.com", role: "technician", avatarUrl: null },
    { id: 3, name: "John Doe", email: "john@example.com", role: "technician", avatarUrl: null },
    { id: 4, name: "Marc Demo", email: "marc@example.com", role: "technician", avatarUrl: null },
    { id: 5, name: "Sarah Smith", email: "sarah@example.com", role: "manager", avatarUrl: null },
];

export const mockWorkCenters = [
    { id: 1, name: "Assembly Line 1", code: "WC-001", tag: "Assembly", costperhour: 100.0, capacity: 1000, timeEfficiency: 95.0, oeeTarget: 85.0, alternativeWorkCenterId: null },
    { id: 2, name: "Packaging Unit", code: "WC-002", tag: "Packaging", costperhour: 80.0, capacity: 800, timeEfficiency: 90.0, oeeTarget: 80.0, alternativeWorkCenterId: 1 },
];

export const mockEquipment = [
    {
        id: 1,
        name: "CNC Machine X1",
        serialNumber: "SN-1001",
        category: "machinery",
        companyId: 1,
        location: "Zone A",
        workCenter: "Assembly Line 1",
        usedBy: "employee",
        employeeId: 3,
        maintenanceTeamId: 1,
        defaultTechnicianId: 2,
        purchaseDate: new Date("2023-01-15"),
        cost: 50000
    },
    {
        id: 2,
        name: "Conveyor Belt System",
        serialNumber: "SN-2002",
        category: "conveyor",
        companyId: 2,
        location: "Zone B",
        workCenter: "Packaging Unit",
        usedBy: "department",
        maintenanceTeamId: 1,
        defaultTechnicianId: 4,
        purchaseDate: new Date("2022-05-10"),
        cost: 15000
    },
    {
        id: 3,
        name: "Main Server Rack",
        serialNumber: "SN-IT-01",
        category: "computer",
        companyId: 1,
        location: "Server Room",
        usedBy: "department",
        maintenanceTeamId: 3,
        defaultTechnicianId: 2,
        purchaseDate: new Date("2023-08-20"),
        cost: 12000
    },
];

export const mockMaintenanceRequests = [
    {
        id: 1,
        subject: "Test activity",
        maintenanceScope: "equipment",
        equipmentId: 3,
        category: "computer",
        description: "Routine check of server fans",
        teamId: 3,
        technicianId: 2,
        companyId: 1,
        type: "preventive",
        stage: "new",
        priority: 1,
        requestDate: "2023-10-25",
        createdBy: 1,
    },
    {
        id: 2,
        subject: "Leaking Pipe in Factory",
        maintenanceScope: "equipment", // Simplified
        category: "plumbing",
        description: "Water detected near north wall",
        teamId: 1,
        technicianId: 4,
        companyId: 1,
        type: "corrective",
        stage: "in_progress",
        priority: 3, // High
        requestDate: "2023-10-26",
        createdBy: 3,
    },
    {
        id: 3,
        subject: "Conveyor Belt Motor Issue",
        maintenanceScope: "equipment",
        equipmentId: 2,
        category: "machinery",
        description: "Motor overheating",
        teamId: 1,
        technicianId: 2,
        companyId: 2,
        type: "corrective",
        stage: "repaired",
        priority: 3, // Critical
        requestDate: "2023-10-20",
        createdBy: 5,
    },
];
