-- Teams
INSERT INTO teams (id, name) VALUES 
(1, 'Maintenance'), 
(2, 'Production'), 
(3, 'IT Support') 
ON CONFLICT (id) DO NOTHING;

-- Companies
INSERT INTO companies (id, name) VALUES 
(1, 'My Company (San Francisco)'), 
(2, 'Chicago Branch') 
ON CONFLICT (id) DO NOTHING;

-- Users
INSERT INTO users (id, name, email, role, team_id, avatar_url) VALUES 
(1, 'Mitchell Admin', 'admin@example.com', 'manager', 1, NULL),
(2, 'Aka Foster', 'foster@example.com', 'technician', 1, NULL),
(3, 'John Doe', 'john@example.com', 'technician', 2, NULL),
(4, 'Marc Demo', 'marc@example.com', 'technician', 1, NULL),
(5, 'Sarah Smith', 'sarah@example.com', 'manager', 2, NULL)
ON CONFLICT (id) DO NOTHING;

-- Work Centers
INSERT INTO work_centers (id, name, code, tag, cost_per_hour, capacity, time_efficiency, oee_target, alternative_work_center_id) VALUES
(1, 'Assembly Line 1', 'WC-001', 'Assembly', 100.0, 1000, 95.0, 85.0, NULL),
(2, 'Packaging Unit', 'WC-002', 'Packaging', 80.0, 800, 90.0, 80.0, 1)
ON CONFLICT (id) DO NOTHING;

-- Equipment (Note: 'cost' field from mock data is ignored as it is not in the schema)
INSERT INTO equipment (id, name, serial_number, category, company_id, location, work_center, used_by, employee_id, maintenance_team_id, default_technician_id, purchase_date) VALUES
(1, 'CNC Machine X1', 'SN-1001', 'machinery', 1, 'Zone A', 'Assembly Line 1', 'employee', 3, 1, 2, '2023-01-15'),
(2, 'Conveyor Belt System', 'SN-2002', 'conveyor', 2, 'Zone B', 'Packaging Unit', 'department', NULL, 1, 4, '2022-05-10'),
(3, 'Main Server Rack', 'SN-IT-01', 'computer', 1, 'Server Room', NULL, 'department', NULL, 3, 2, '2023-08-20')
ON CONFLICT (id) DO NOTHING;

-- Maintenance Requests
INSERT INTO maintenance_requests (id, subject, maintenance_scope, equipment_id, category, description, team_id, technician_id, company_id, type, stage, priority, request_date, created_by) VALUES
(1, 'Test activity', 'equipment', 3, 'computer', 'Routine check of server fans', 3, 2, 1, 'preventive', 'new', 1, '2023-10-25', 1),
(2, 'Leaking Pipe in Factory', 'equipment', NULL, 'plumbing', 'Water detected near north wall', 1, 4, 1, 'corrective', 'in_progress', 3, '2023-10-26', 3),
(3, 'Conveyor Belt Motor Issue', 'equipment', 2, 'machinery', 'Motor overheating', 1, 2, 2, 'corrective', 'repaired', 3, '2023-10-20', 5)
ON CONFLICT (id) DO NOTHING;

-- Reset Sequences (Optional, but recommended to avoid collisions for new inserts)
SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams));
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('work_centers_id_seq', (SELECT MAX(id) FROM work_centers));
SELECT setval('equipment_id_seq', (SELECT MAX(id) FROM equipment));
SELECT setval('maintenance_requests_id_seq', (SELECT MAX(id) FROM maintenance_requests));
