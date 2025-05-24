import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockOrgHierarchyNodes } from '../../data/mockOrgHierarchy';
import { Button, Table, Card } from 'react-bootstrap';
import styles from './AdminPages.module.scss';

const OrgHierarchyPage = () => {
  const navigate = useNavigate();

  const getParentName = (parentId) => {
    if (!parentId) return 'N/A (Top Level)';
    const parentNode = mockOrgHierarchyNodes.find(node => node.id === parentId);
    return parentNode ? `${parentNode.name} (${parentNode.type})` : 'Unknown Parent';
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.formCard}>
        <Card.Header>
          <Card.Title>Organizational Hierarchy Management</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={() => navigate('/admin/organisation/hierarchy/new')}>
              <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>add</span>
              Add New Node
            </Button>
          </div>

          {mockOrgHierarchyNodes.length === 0 ? (
            <p>No organizational hierarchy nodes found.</p>
          ) : (
            <Table striped bordered hover responsive className={styles.table}>
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
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/admin/organisation/hierarchy/edit/${node.id}`)}
                        title="Edit Node"
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

export default OrgHierarchyPage;
