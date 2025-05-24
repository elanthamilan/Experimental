import React from 'react';
import { Table, Container, Button } from 'react-bootstrap';

const DataTable = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <Container className="mt-4">
        <p>No student data to display.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Student Data Table</h2>
      <Table striped bordered hover responsive>
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
                <Button variant="outline-primary" size="sm" onClick={() => onEdit(item)} className="me-2">
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DataTable;
