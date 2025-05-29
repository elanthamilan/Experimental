import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrgHierarchyNodes } from '../../data/mockOrgHierarchy';
// import { Button, Table, Card } from 'react-bootstrap'; // Replaced by Styled components
import {
  StyledContainer,
  StyledCard,
  StyledButton,
  StyledTable,
} from '../../components';
import styles from './OrgHierarchyPage.module.scss'; // Use new SCSS module

const OrgHierarchyPage = () => {
  const navigate = useNavigate();

  const getParentName = (parentId) => {
    if (!parentId) return 'N/A (Top Level)';
    const parentNode = mockOrgHierarchyNodes.find(node => node.id === parentId);
    return parentNode ? `${parentNode.name} (${parentNode.type})` : 'Unknown Parent';
  };

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Organizational Hierarchy Management</h1>
      </div>
      <StyledCard className={styles.contentCard}> {/* Changed to contentCard */}
        <StyledCard.Header>
          {/* <StyledCard.Title className={styles.cardTitle}>Organizational Hierarchy Management</StyledCard.Title> */}
        </StyledCard.Header>
        <StyledCard.Body>
          <div className={styles.headerActions}> {/* Use headerActions class */}
            <StyledButton variant="primary" onClick={() => navigate('/admin/organisation/hierarchy/new')} className={styles.addButton}>
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span> {/* Apply buttonIcon class */}
              Add New Node
            </StyledButton>
          </div>

          {mockOrgHierarchyNodes.length === 0 ? (
            <p className={styles.noDataText}>No organizational hierarchy nodes found.</p> /* Apply noDataText class */
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}> {/* Use StyledTable and dataTable class */}
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Parent Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockOrgHierarchyNodes.map((node) => (
                  <tr key={node.id}>
                    <td>{node.id}</td>
                    <td>{node.name}</td>
                    <td>{node.type}</td>
                    <td>{getParentName(node.parentId)}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/organisation/hierarchy/edit/${node.id}`)}
                        title="Edit Node"
                      >
                        <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span> {/* Apply actionButtonIcon class */}
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

export default OrgHierarchyPage;
