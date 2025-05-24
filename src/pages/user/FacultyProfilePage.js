import React from 'react';
// import { useParams } from 'react-router-dom'; // Will use later
// import { mockFaculty } from '../../data/mockFaculty'; // Will use later

const FacultyProfilePage = () => {
  // const { facultyId } = useParams();
  // const facultyMember = mockFaculty.find(f => f.id === facultyId);
  return (
    <div>
      {/* <h1>Faculty Profile: {facultyMember?.firstName} {facultyMember?.lastName}</h1> */}
      <h1>Faculty Profile</h1>
      <p>Detailed faculty information will be displayed here.</p>
    </div>
  );
};
export default FacultyProfilePage;
