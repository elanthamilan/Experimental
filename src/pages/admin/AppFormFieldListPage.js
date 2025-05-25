import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplicationFormFields } from '../../data/mockApplicationFormFields';
import StyledTable from '../../components/atoms/StyledTable';
import StyledCard from '../../components/atoms/StyledCard';
import StyledBadge from '../../components/atoms/StyledBadge';
import StyledContainer from '../../components/atoms/StyledContainer';
import StyledButton from '../../components/atoms/StyledButton';
import styles from './AdminPages.module.scss';

const AppFormFieldListPage = () => {
  const navigate = useNavigate();

  // Sort fields by order for display
  const sortedFields = [...mockApplicationFormFields].sort((a, b) => a.order - b.order);

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.formCard}>
        <StyledCard.Header>
          <StyledCard.Title>Application Form Fields Management</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          <div className="d-flex justify-content-end mb-3">
            <StyledButton variant="primary" onClick={() => navigate('/admin/admissions/formfields/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Field
            </StyledButton>
          </div>

          {sortedFields.length === 0 ? (
            <p>No application form fields found.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.table}>
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
                      <StyledBadge variant={field.required ? 'success' : 'secondary'}>
                        {field.required ? 'Yes' : 'No'}
                      </StyledBadge>
                    </td>
                    <td>
                      {field.options && Array.isArray(field.options) && field.options.length > 0
                        ? field.options.join(', ')
                        : 'N/A'}
                    </td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/admissions/formfields/edit/${field.id}`)}
                        title="Edit Field"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default AppFormFieldListPage;
