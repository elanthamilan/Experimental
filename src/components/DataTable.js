import React from 'react';
import StyledTable from './atoms/StyledTable';
import StyledContainer from './atoms/StyledContainer';
import StyledButton from './atoms/StyledButton';

const DataTable = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <StyledContainer className="mt-4">
        <p>No student data to display.</p>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer className="mt-4">
      <h2>Student Data Table</h2>
      <StyledTable striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Roll No.</th>
            <th>Program</th>
            <th>Semesters</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.rollNo}</td>
              <td>{item.program}</td>
              <td>{item.semesters}</td>
              <td>
                <StyledButton variant="outline-primary" size="sm" onClick={() => onEdit(item)} className="me-2">
                  Edit
                </StyledButton>
                <StyledButton variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
                  Delete
                </StyledButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledContainer>
  );
};

export default DataTable;
