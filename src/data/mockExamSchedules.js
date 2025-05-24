// src/data/mockExamSchedules.js
export const mockExamSchedules = [
  {
    id: "exm001",
    courseId: "course001", // CS101 Introduction to Programming
    examName: "Midterm Exam",
    date: "2024-10-15",
    time: "10:00", // Use HH:MM format for time input
    room: "Room 101, Tech Building",
    invigilators: ["faculty001"], // Eleanor Vance
    duration: "2 hours",
    notes: "Closed book. No calculators."
  },
  {
    id: "exm002",
    courseId: "course002", // MA201 Calculus I
    examName: "Final Exam",
    date: "2024-12-10",
    time: "14:00",
    room: "Hall A, Exam Center",
    invigilators: ["faculty002", "faculty003"], // Marcus Chen, Aisha Khan
    duration: "3 hours",
    notes: "Calculators allowed. Formula sheet will be provided."
  },
  {
    id: "exm003",
    courseId: "course003", // ENGL101 English Composition
    examName: "Essay Submission Deadline",
    date: "2024-11-20",
    time: "23:59",
    room: "Online Submission",
    invigilators: [],
    duration: "N/A",
    notes: "Submit via LMS."
  }
];
