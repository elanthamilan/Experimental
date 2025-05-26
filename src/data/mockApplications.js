// src/data/mockApplications.js
import { mockPrograms } from './mockPrograms'; // Assuming mockPrograms.js is in the same src/data/ directory
// mockApplicationFormFields might not be directly needed here if field labels are stored in responses

const getProgramName = (programId) => {
  const program = mockPrograms.find(p => p.id === programId);
  return program ? program.name : 'Unknown Program';
};

export const mockApplications = [
  {
    id: "app001",
    applicantName: "Alice Smith",
    email: "alice.smith@example.com",
    dateOfBirth: "2005-04-12",
    programId: "prog001",
    programName: getProgramName("prog001"), // Store program name for easy display
    status: "Received", // Received, Under Review, Interview Scheduled, Accepted, Rejected
    submittedDate: "2024-03-15",
    fieldResponses: [
      { fieldId: "field001", label: "First Name", response: "Alice" },
      { fieldId: "field002", label: "Last Name", response: "Smith" },
      { fieldId: "field003", label: "Personal Essay", response: "My journey into the world of tech..." },
      { fieldId: "field004", label: "Preferred Program", response: getProgramName("prog001") },
      { fieldId: "field005", label: "High School Transcript", response: "transcript_alice.pdf" }
    ],
    interviewDate: null,
    interviewNotes: ""
  },
  {
    id: "app002",
    applicantName: "Bob Johnson",
    email: "bob.johnson@example.com",
    dateOfBirth: "2004-11-01",
    programId: "prog002",
    programName: getProgramName("prog002"),
    status: "Under Review",
    submittedDate: "2024-03-20",
    fieldResponses: [
      { fieldId: "field001", label: "First Name", response: "Bob" },
      { fieldId: "field002", label: "Last Name", response: "Johnson" },
      { fieldId: "field003", label: "Personal Essay", response: "Literature has always been my passion..." },
      { fieldId: "field004", label: "Preferred Program", response: getProgramName("prog002") },
      { fieldId: "field005", label: "High School Transcript", response: "transcript_bob.pdf" }
    ],
    interviewDate: null,
    interviewNotes: ""
  },
  {
    id: "app003",
    applicantName: "Carol Williams",
    email: "carol.williams@example.com",
    dateOfBirth: "2005-07-30",
    programId: "prog001",
    programName: getProgramName("prog001"),
    status: "Interview Scheduled",
    submittedDate: "2024-02-10",
    fieldResponses: [
      { fieldId: "field001", label: "First Name", response: "Carol" },
      { fieldId: "field002", label: "Last Name", response: "Williams" },
      { fieldId: "field003", label: "Personal Essay", response: "I am driven by logic..." },
      { fieldId: "field004", label: "Preferred Program", response: getProgramName("prog001") },
      { fieldId: "field005", label: "High School Transcript", response: "transcript_carol.pdf" }
    ],
    interviewDate: "2024-04-10",
    interviewNotes: "Scheduled with Prof. Vance."
  }
];
