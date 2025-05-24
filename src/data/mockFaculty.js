// Assuming USER_ROLES might be used here or in components displaying this data.
// For simplicity in this data file, we'll focus on the data structure.
// If role-based access to faculty data itself was a feature, USER_ROLES import would be relevant.

export const mockFaculty = [
  {
    id: "faculty001",
    firstName: "Eleanor",
    lastName: "Vance",
    email: "eleanor.vance@example.com",
    department: "Computer Science",
    officeLocation: "Tech Building, Room 401",
    coursesTaught: ["course001"], // CS101 Introduction to Programming
    title: "Professor",
    profileImageUrl: "https://via.placeholder.com/150/AB00FF/FFFFFF?Text=ProfVance"
  },
  {
    id: "faculty002",
    firstName: "Marcus",
    lastName: "Chen",
    email: "marcus.chen@example.com",
    department: "Mathematics",
    officeLocation: "Math Building, Room 210",
    coursesTaught: ["course002", "course005"], // MA201 Calculus I, PHYS101 General Physics I (assuming one prof can teach across related depts or physics is under math umbrella for this mock)
    title: "Associate Professor",
    profileImageUrl: "https://via.placeholder.com/150/00C0FF/000000?Text=ProfChen"
  },
  {
    id: "faculty003",
    firstName: "Aisha",
    lastName: "Khan",
    email: "aisha.khan@example.com",
    department: "English",
    officeLocation: "Humanities Hall, Room 105",
    coursesTaught: ["course003"], // ENGL101 English Composition
    title: "Assistant Professor",
    profileImageUrl: "https://via.placeholder.com/150/FFC0CB/000000?Text=ProfKhan"
  },
  {
    id: "faculty004",
    firstName: "David",
    lastName: "Lee",
    email: "david.lee@example.com",
    department: "History", // Assuming History department exists or courses are cross-listed
    officeLocation: "Humanities Hall, Room 202",
    coursesTaught: ["course004"], // HIST202 World History II
    title: "Lecturer",
    profileImageUrl: "https://via.placeholder.com/150/E6E6FA/000000?Text=ProfLee"
  }
];
