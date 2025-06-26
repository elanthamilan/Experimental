import React from 'react';
import { StyledContainer, StyledButton } from '../../components';
import { useNavigate } from 'react-router-dom';
// Ensure this page has the standard page header structure
import pageStyles from './AdminPages.module.scss'; // Or its own SCSS if preferred

const SubInstitutionListPage = () => {
  const navigate = useNavigate();
  return (
    <StyledContainer>
      <div className={pageStyles.pageHeader}>
        <h1 className={pageStyles.pageTitle}>Sub-Institution Management</h1>
      </div>
      <p>This page will list all sub-institutions and allow adding, editing, or deleting them.</p>
      <StyledButton variant="primary" onClick={() => navigate('/admin/sub-institutions/new')}>
        Add New Sub-Institution
      </StyledButton>
      {/* Placeholder for a table or list of sub-institutions */}
    </StyledContainer>
  );
};
export default SubInstitutionListPage;
