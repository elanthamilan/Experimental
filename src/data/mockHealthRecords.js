export const mockHealthRecords = [
  {
    recordId: "healthRec001",
    studentId: "student001", // Alice W
    medicalConditions: ["None reported"],
    allergies: ["Wonderland Mushrooms (causes size changes)", "Talking Flowers (mild rash)"],
    immunizations: ["Tetanus (2020)", "Influenza (2023)", "Jabberwocky Vaccine (pending)"],
    lastUpdated: "2023-09-10"
  },
  {
    recordId: "healthRec002",
    studentId: "student002", // Bob B
    medicalConditions: [{condition: "Hay Fever", notes: "Seasonal, uses antihistamines"}],
    allergies: ["Dust"],
    immunizations: ["MMR - 2 doses", "Hepatitis B - Series Complete"],
    lastUpdated: "2023-08-15"
  },
  {
    recordId: "healthRec003",
    studentId: "student003", // Charlie Brown
    medicalConditions: ["Chronic disappointment (self-diagnosed)"],
    allergies: ["Kite-eating trees", "Football (psychosomatic)"],
    immunizations: ["Polio - Complete", "Chickenpox - Complete"],
    lastUpdated: "2024-01-05"
  },
  {
    recordId: "healthRec004",
    studentId: "student004", // Diana Prince
    medicalConditions: ["Excellent"],
    allergies: ["None"],
    immunizations: ["All standard Amazonian immunizations", "Influenza (2023)"],
    lastUpdated: "2023-11-01"
  }
];
