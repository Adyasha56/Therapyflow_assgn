// MongoDB initialization script
db = db.getSiblingDB('therapyflow');

// Create collections
db.createCollection('sessions');
db.createCollection('users');

// Create indexes for better performance
db.sessions.createIndex({ "patientId": 1 });
db.sessions.createIndex({ "createdAt": -1 });
db.sessions.createIndex({ "urgent": 1 });

console.log('TherapyFlow database initialized successfully');