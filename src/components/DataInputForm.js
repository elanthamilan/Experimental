import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

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
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRollNo">
              <Form.Label>Roll No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter roll number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProgram">
              <Form.Label>Program</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSemesters">
              <Form.Label>Semesters</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of semesters"
                value={semesters}
                onChange={(e) => setSemesters(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Student
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default DataInputForm;
