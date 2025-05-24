// src/data/mockApplicationFormFields.js
export const mockApplicationFormFields = [
  {
    id: "field001",
    label: "First Name",
    type: "text", // text, textarea, dropdown, email, number, date, file
    required: true,
    options: [], // For dropdown type, comma-separated string initially
    order: 1
  },
  {
    id: "field002",
    label: "Last Name",
    type: "text",
    required: true,
    options: [],
    order: 2
  },
  {
    id: "field003",
    label: "Personal Essay",
    type: "textarea",
    required: true,
    options: [],
    order: 3
  },
  {
    id: "field004",
    label: "Preferred Program",
    type: "dropdown",
    required: true,
    options: ["Computer Science", "English Literature", "Applied Mathematics"],
    order: 4
  },
  {
    id: "field005",
    label: "High School Transcript",
    type: "file",
    required: true,
    options: [],
    order: 5
  }
];
