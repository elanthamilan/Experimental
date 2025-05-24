// It's good practice to define roles in a central place,
// but for this standalone mock file, defining it here is acceptable.
// Alternatively, if App.js is guaranteed to be loaded and USER_ROLES exported from there,
// one might consider importing, but for pure data files, self-containment can be simpler.
export const USER_ROLES = { ADMIN: 'Admin', TEACHER: 'Teacher', STUDENT: 'Student' };

export const mockUsers = [
  {
    id: "user001",
    username: "admin_user",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: USER_ROLES.ADMIN,
    department: null,
    officeLocation: "Main Office",
    profileImageUrl: "https://via.placeholder.com/150/0000FF/808080?Text=AdminU"
  },
  {
    id: "user002",
    username: "prof_jane",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    role: USER_ROLES.TEACHER,
    department: "Computer Science",
    officeLocation: "Tech Building, Room 301",
    profileImageUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=ProfJane"
  },
  {
    id: "user003",
    username: "prof_smith",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    role: USER_ROLES.TEACHER,
    department: "Mathematics",
    officeLocation: "Math Building, Room 205",
    profileImageUrl: "https://via.placeholder.com/150/00FF00/000000?Text=ProfSmith"
  },
  {
    id: "user004",
    username: "prof_davis",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    role: USER_ROLES.TEACHER,
    department: "English",
    officeLocation: "Humanities Hall, Room 101",
    profileImageUrl: "https://via.placeholder.com/150/FFFF00/000000?Text=ProfDavis"
  },
  {
    id: "user005",
    username: "sys_admin",
    firstName: "System",
    lastName: "Operator",
    email: "sysadmin@example.com",
    role: USER_ROLES.ADMIN,
    department: "IT Services",
    officeLocation: "Server Room A",
    profileImageUrl: "https://via.placeholder.com/150/800080/FFFFFF?Text=SysAdmin"
  }
];
