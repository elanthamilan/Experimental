// src/data/mockPrograms.js
export const mockPrograms = [
  {
    id: "prog001",
    name: "Bachelor of Science in Computer Science",
    description: "A comprehensive program covering theoretical and practical aspects of computing.",
    department: "Computer Science",
    degreeLevel: "Bachelor's",
    requiredCourses: ["course001", "course002", "course005"], // CS101, MA201, PHYS101
    duration: "4 years"
  },
  {
    id: "prog002",
    name: "Bachelor of Arts in English Literature",
    description: "Explores a wide range of literary works and critical theories.",
    department: "English",
    degreeLevel: "Bachelor's",
    requiredCourses: ["course003", "course004"], // ENGL101, HIST202 (assuming history is a common elective)
    duration: "4 years"
  },
  {
    id: "prog003",
    name: "Master of Science in Applied Mathematics",
    description: "Advanced studies in mathematical modeling and application.",
    department: "Mathematics",
    degreeLevel: "Master's",
    requiredCourses: ["course002"], // MA201 (as a prereq, more advanced courses would be added)
    duration: "2 years"
  },
  {
    id: "prog004",
    name: "Associate Degree in General Studies",
    description: "A flexible program providing a broad foundation across various disciplines.",
    department: "General Studies",
    degreeLevel: "Associate Degree",
    requiredCourses: ["course001", "course003"], // CS101, ENGL101
    duration: "2 years"
  }
];
