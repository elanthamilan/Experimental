import React from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStaff } from '../../data/mockStaff';
import { mockDepartments } from '../../data/mockDepartments'; // For department filter
import { Pagination } from 'react-bootstrap';
import {
  StyledContainer,
  StyledTable,
  StyledCard,
  StyledButton,
  StyledBadge,
  FormField,
  StyledFormControl,
  StyledFormSelect,
} from '../../components';
import styles from './StaffListPage.module.scss';

const StaffListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState(''); // Assuming roles are free text for now or could be a predefined list

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]); // For dynamic role filtering if desired

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const uniqueDepartments = ['All', ...new Set(mockStaff.map(staff => staff.department).filter(Boolean))];
    // mockDepartments could also be used if it's comprehensive
    // const uniqueDepartments = ['All', ...mockDepartments.map(dept => dept.name)];
    setDepartmentOptions(uniqueDepartments);

    const uniqueRoles = ['All', ...new Set(mockStaff.map(staff => staff.role).filter(Boolean))];
    setRoleOptions(uniqueRoles);
  }, []);


  const filteredStaff = mockStaff.filter(staffMember => {
    const nameMatch = staffMember.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      staffMember.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (staffMember.email && staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const departmentMatch = departmentFilter === '' || departmentFilter === 'All' || staffMember.department === departmentFilter;
    const roleMatch = roleFilter === '' || roleFilter === 'All' || (staffMember.role && staffMember.role.toLowerCase().includes(roleFilter.toLowerCase()));
    return nameMatch && departmentMatch && roleMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(e.target.elements.pageInput.value, 10);
    handlePageChange(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <StyledBadge variant="success">{status}</StyledBadge>;
      case 'On Leave': return <StyledBadge variant="warning">{status}</StyledBadge>;
      case 'Terminated': return <StyledBadge variant="danger">{status}</StyledBadge>;
      default: return <StyledBadge variant="secondary">{status}</StyledBadge>;
    }
  };
  
  const paginationItems = [];
  if (totalPages > 0) {
    if (totalPages <= 7) {
      for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
          <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
            {number}
          </Pagination.Item>
        );
      }
    } else {
      paginationItems.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>1</Pagination.Item>
      );
      if (currentPage > 3) {
        paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) endPage = Math.min(totalPages - 1, 3);
      if (currentPage >= totalPages - 1) startPage = Math.max(2, totalPages - 2);
      for (let number = startPage; number <= endPage; number++) {
        paginationItems.push(
          <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
            {number}
          </Pagination.Item>
        );
      }
      if (currentPage < totalPages - 2) {
        paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      paginationItems.push(
        <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }
  }

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* The page title is part of the Card Header here, not a separate H1 */}
          <StyledCard.Title className={styles.cardTitle}>Staff Management (Non-Academic)</StyledCard.Title>
        </StyledCard.Header>
        <StyledCard.Body>
          <div className={styles.tableControls}>
            <div className={styles.filterSection}>
              <div className={styles.searchFilterItem}>
                <FormField
                  controlId="searchTerm"
                  label="Search Staff"
                  type="text"
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div className={styles.dropdownFilterItem}>
                <FormField
                  controlId="departmentFilter"
                  label="Department"
                  as="select"
                  value={departmentFilter}
                  onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                  options={departmentOptions.map(dept => ({ value: dept === 'All' ? '' : dept, label: dept }))}
                />
              </div>
              <div className={styles.dropdownFilterItem}>
                 <FormField // Assuming Role is a text search for now
                  controlId="roleFilter"
                  label="Role/Title"
                  type="text"
                  placeholder="Enter role/title..."
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
            <div className={styles.actionsSection}>
              <StyledButton variant="primary" onClick={() => navigate('/staff/new')} className={styles.addButton}>
                <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
                Add New Staff
              </StyledButton>
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <p className={styles.noDataText}>No staff members found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role/Title</th>
                  <th>Employment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td>{staffMember.id}</td>
                    <td>{`${staffMember.firstName} ${staffMember.lastName}`}</td>
                    <td>{staffMember.email}</td>
                    <td>{staffMember.department}</td>
                    <td>{staffMember.role}</td>
                    <td>{staffMember.employmentDate}</td>
                    <td>{getStatusBadge(staffMember.status)}</td>
                    <td>
                      <StyledButton
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/staff/edit/${staffMember.id}`)}
                        title="Edit Staff Member"
                      >
                        <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
          {totalPages > 0 && (
            <div className={styles.paginationContainer}>
              <span className={styles.resultsText}>
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredStaff.length)} of {filteredStaff.length} results
              </span>
              <Pagination className={styles.paginationControls}>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {paginationItems}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
              <div className={styles.pageInputControls}>
                <span>Page</span>
                <form onSubmit={handlePageInputSubmit} style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
                  <StyledFormControl
                    type="number"
                    name="pageInput"
                    defaultValue={currentPage}
                    key={currentPage} // Force re-render on page change if defaultValue is used
                    className={styles.pageInput}
                    min="1"
                    max={totalPages}
                    size="sm"
                  />
                </form>
                <span className={styles.totalPagesText}>of {totalPages}</span>
              </div>
              <StyledFormSelect size="sm" className={styles.itemsPerPageSelect} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </StyledFormSelect>
            </div>
          )}
        </StyledCard.Body>
      </StyledCard>
    </StyledContainer>
  );
};

export default StaffListPage;
