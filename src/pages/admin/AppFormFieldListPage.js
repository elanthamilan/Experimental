import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplicationFormFields } from '../../data/mockApplicationFormFields';
import { Button, Table, Card, Badge } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const AppFormFieldListPage = () => {
  const navigate = useNavigate();

  // Sort fields by order for display
  const sortedFields = [...mockApplicationFormFields].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>Application Form Fields Management</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => navigate('/admin/admissions/formfields/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Field
            </Button>
          </div>

          {sortedFields.length === 0 ? (
            <p>No application form fields found.</p>
          ) : (
            <Table striped bordered hover responsive className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Label</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Options</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedFields.map((field) => (
                  <tr key={field.id}>
                    <td>{field.order}</td>
                    <td>{field.label}</td>
                    <td>{field.type}</td>
                    <td>
                      <Badge bg={field.required ? 'success' : 'secondary'}>
                        {field.required ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td>
                      {field.options && Array.isArray(field.options) && field.options.length > 0 
                        ? field.options.join(', ') 
                        : 'N/A'}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/admissions/formfields/edit/${field.id}`)}
                        title="Edit Field"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AppFormFieldListPage;
