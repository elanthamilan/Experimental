// src/data/mockOrgHierarchy.js
export const mockOrgHierarchyNodes = [
  { id: "faculty_sci", name: "Faculty of Science", type: "Faculty", parentId: null },
  { id: "faculty_arts", name: "Faculty of Arts and Humanities", type: "Faculty", parentId: null },
  { id: "dept_cs", name: "Department of Computer Science", type: "Department", parentId: "faculty_sci" },
  { id: "dept_math", name: "Department of Mathematics", type: "Department", parentId: "faculty_sci" },
  { id: "dept_eng", name: "Department of English", type: "Department", parentId: "faculty_arts" },
  { id: "dept_hist", name: "Department of History", type: "Department", parentId: "faculty_arts" },
  { id: "research_ai_lab", name: "AI Research Lab", type: "Lab/Center", parentId: "dept_cs" }
];
