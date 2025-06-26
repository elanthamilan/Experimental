// Note: For student lifecycle management, an "Archived" status would eventually be added
// to `enrollmentStatus` for students whose records are moved to long-term storage.
// See `docs/archiving_retention_strategy.md` for more details.

export const mockStudents = [
  {
    id: "student001",
    firstName: "Alice",
    lastName: "Wonderland",
    email: "alice.w@example.com",
    dateOfBirth: "2003-07-16",
    major: "Literary Studies",
    enrollmentDate: "2021-09-01",
    address: {
      street: "123 Curious Lane",
      city: "Storyville",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    coursesEnrolled: ["course003", "course004"],
    profileImageUrl: "https://via.placeholder.com/150/FFFF00/000000?Text=AliceW",
    gender: "Female",
    nationality: "British",
    emergencyContacts: [
      { name: "Cheshire Cat", relationship: "Advisor", phone: "555-1234", email: "chess@example.com" },
      { name: "Mad Hatter", relationship: "Guardian", phone: "555-5678" }
    ],
    parentGuardianInfo: [
      { name: "Queen of Hearts", relationship: "Parent", phone: "555-8765", email: "queen@example.com" }
    ],
    academicStanding: "Good Standing",
    enrollmentStatus: "Enrolled",
    admissionDate: "2021-08-15",
    withdrawalDate: null,
    documents: [
      { name: "Birth Certificate", uploaded: true, isMandatory: true },
      { name: "Photo ID", uploaded: true, isMandatory: true },
      { name: "Address Proof", uploaded: false, isMandatory: true }, // Alice missing Address Proof
      { name: "Previous Marksheet", uploaded: true, isMandatory: false }
    ]
  },
  {
    id: "student002",
    firstName: "Bob",
    lastName: "The Builder",
    email: "bob.b@example.com",
    dateOfBirth: "2002-05-20",
    major: "Engineering",
    enrollmentDate: "2020-09-01",
    address: {
      street: "456 Fixit Ave",
      city: "Constructicon",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    coursesEnrolled: ["course001", "course002"],
    profileImageUrl: "https://via.placeholder.com/150/FFA500/FFFFFF?Text=BobB",
    gender: "Male",
    nationality: "American",
    emergencyContacts: [
      { name: "Wendy", relationship: "Partner", phone: "555-2222", email: "wendy@example.com" }
    ],
    parentGuardianInfo: [
      { name: "Mr. Bentley", relationship: "Mentor", phone: "555-3333" }
    ],
    academicStanding: "Good Standing",
    enrollmentStatus: "Enrolled",
    admissionDate: "2020-08-15",
    withdrawalDate: null,
    documents: [
      { name: "Birth Certificate", uploaded: true, isMandatory: true },
      { name: "Photo ID", uploaded: true, isMandatory: true },
      { name: "Address Proof", uploaded: true, isMandatory: true }, // Bob has all
      { name: "SOP", uploaded: true, isMandatory: false }
    ]
  },
  {
    id: "student003",
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie.b@example.com",
    dateOfBirth: "2004-02-10",
    major: "Philosophy",
    enrollmentDate: "2022-09-01",
    address: {
      street: "789 Good Grief St",
      city: "Sparkyville",
      state: "MN",
      zipCode: "55401",
      country: "USA"
    },
    coursesEnrolled: ["course001"],
    profileImageUrl: "https://via.placeholder.com/150/A52A2A/FFFFFF?Text=CharlieB",
    gender: "Male",
    nationality: "American",
    emergencyContacts: [
      { name: "Snoopy", relationship: "Best Friend", phone: "555-4444" }
    ],
    parentGuardianInfo: [
      { name: "Grandma Brown", relationship: "Grandparent", phone: "555-5555" }
    ],
    academicStanding: "Academic Probation",
    enrollmentStatus: "Enrolled",
    admissionDate: "2022-08-15",
    withdrawalDate: null,
    documents: [
      { name: "Birth Certificate", uploaded: false, isMandatory: true }, // Charlie missing Birth Certificate
      { name: "Photo ID", uploaded: false, isMandatory: true },       // Charlie missing Photo ID
      { name: "Address Proof", uploaded: true, isMandatory: true },
      { name: "Letter of Recommendation", uploaded: true, isMandatory: false }
    ]
  },
  {
    id: "student004",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana.p@example.com",
    dateOfBirth: "2001-11-22",
    major: "International Relations",
    enrollmentDate: "2019-09-01",
    address: {
      street: "1 Paradise Island",
      city: "Themyscira",
      state: "DC", 
      zipCode: "20001",
      country: "USA"
    },
    coursesEnrolled: ["course004", "course005"],
    profileImageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?Text=DianaP",
    gender: "Female",
    nationality: "Amazonian",
    emergencyContacts: [
      { name: "Hippolyta", relationship: "Mother", phone: "555-6666", email: "hippolyta@example.com" }
    ],
    parentGuardianInfo: [
      { name: "Antiope", relationship: "Aunt", phone: "555-7777" }
    ],
    academicStanding: "Dean's List",
    enrollmentStatus: "Graduated",
    admissionDate: "2019-08-15",
    withdrawalDate: null, // Not withdrawn, but graduated
    documents: [
      { name: "Birth Certificate", uploaded: true, isMandatory: true },
      { name: "Photo ID", uploaded: true, isMandatory: true },
      { name: "Address Proof", uploaded: true, isMandatory: true },
      { name: "Degree Certificate", uploaded: true, isMandatory: false } // Graduated, has degree cert
    ]
  },
  {
    id: "student005",
    firstName: "Edward",
    lastName: "Scissorhands",
    email: "edward.s@example.com",
    dateOfBirth: "2000-03-01",
    major: "Fine Arts",
    enrollmentDate: "2018-09-01",
    address: {
      street: "1 Castle Topiary",
      city: "Suburbia",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    coursesEnrolled: ["course003"],
    profileImageUrl: "https://via.placeholder.com/150/808080/000000?Text=EdwardS",
    gender: "Male",
    nationality: "Construct",
    emergencyContacts: [
      { name: "Peg Boggs", relationship: "Guardian", phone: "555-8888", email: "peg@example.com" }
    ],
    parentGuardianInfo: [
      { name: "The Inventor", relationship: "Creator", phone: "N/A" }
    ],
    academicStanding: "Good Standing",
    enrollmentStatus: "Withdrawn",
    admissionDate: "2018-08-15",
    withdrawalDate: "2020-05-15",
    documents: [
      { name: "Birth Certificate", uploaded: true, isMandatory: true },
      { name: "Photo ID", uploaded: false, isMandatory: true }, // Withdrawn, maybe incomplete docs
      { name: "Address Proof", uploaded: true, isMandatory: true }
    ]
  }
];
