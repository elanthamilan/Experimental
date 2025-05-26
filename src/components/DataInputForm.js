import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import FormField from './molecules/FormField'; // Import FormField
import StyledButton from './atoms/StyledButton';

const DataInputForm = ({ onAddData, onUpdateData, editingItem, clearEditing }) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [program, setProgram] = useState('');
  const [semesters, setSemesters] = useState('');
  const [id, setId] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setRollNo(editingItem.rollNo);
      setProgram(editingItem.program);
      setSemesters(editingItem.semesters);
      setId(editingItem.id);
    } else {
      setName('');
      setRollNo('');
      setProgram('');
      setSemesters('');
      setId(null);
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !rollNo || !program || !semesters) return; // Basic validation

    if (editingItem) {
      onUpdateData({ name, rollNo, program, semesters, id });
    } else {
      onAddData({ name, rollNo, program, semesters, id: Date.now() });
    }
    setName('');
    setRollNo('');
    setProgram('');
    setSemesters('');
    setId(null);
    if (clearEditing) clearEditing();
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>{editingItem ? 'Edit Student Data' : 'Add New Student Data'}</h2>
          <Form onSubmit={handleSubmit}>
            <FormField
              controlId="formName"
              label="Name"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3" // Maintain margin bottom
            />

            <FormField
              controlId="formRollNo"
              label="Roll No."
              type="text"
              placeholder="Enter roll number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="mb-3" // Maintain margin bottom
            />

            <FormField
              controlId="formProgram"
              label="Program"
              type="text"
              placeholder="Enter program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="mb-3" // Maintain margin bottom
            />

            <FormField
              controlId="formSemesters"
              label="Semesters"
              type="number"
              placeholder="Enter number of semesters"
              value={semesters}
              onChange={(e) => setSemesters(e.target.value)}
              className="mb-3" // Maintain margin bottom
            />

            <StyledButton variant="primary" type="submit">
              {editingItem ? 'Update Student' : 'Add Student'}
            </StyledButton>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DataInputForm;
