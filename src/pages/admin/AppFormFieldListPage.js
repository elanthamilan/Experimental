import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplicationFormFields } from '../../data/mockApplicationFormFields';
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
import styles from './AppFormFieldListPage.module.scss';

const AppFormFieldListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [requiredFilter, setRequiredFilter] = useState(''); // 'All', 'Yes', 'No'

  const [typeOptions, setTypeOptions] = useState([]);
  const requiredOptions = [
    { value: '', label: 'All (Required)' },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ];
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initial sort by order
  const initialSortedFields = [...mockApplicationFormFields].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const uniqueTypes = ['All', ...new Set(initialSortedFields.map(f => f.type).filter(Boolean))];
    setTypeOptions(uniqueTypes.map(type => ({ value: type === 'All' ? '' : type, label: type })));
  }, [initialSortedFields]);


  const filteredFields = initialSortedFields.filter(field => {
    const labelMatch = field.label.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === '' || typeFilter === 'All' || field.type === typeFilter;
    const requiredMatch = requiredFilter === '' || requiredFilter === 'All' || String(field.required) === requiredFilter;
    return labelMatch && typeMatch && requiredMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredFields.slice(indexOfFirstItem, indexOfLastItem);

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
  
  const paginationItems = [];
  if (totalPages > 0) {
    if (totalPages <= 7) {
      for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>{number}</Pagination.Item>);
      }
    } else {
      paginationItems.push(<Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>1</Pagination.Item>);
      if (currentPage > 3) paginationItems.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) endPage = Math.min(totalPages - 1, 3);
      if (currentPage >= totalPages - 1) startPage = Math.max(2, totalPages - 2);
      for (let number = startPage; number <= endPage; number++) {
        paginationItems.push(<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>{number}</Pagination.Item>);
      }
      if (currentPage < totalPages - 2) paginationItems.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      paginationItems.push(<Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>);
    }
  }

  return (
    <StyledContainer className={styles.pageContainer}>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          <StyledCard.Title className={styles.cardTitle}>Application Form Fields Management</StyledCard.Title>
        </StyledCard.Header>

        <div className={styles.tableControls}>
          <div className={styles.filterSection}>
            <div className={styles.searchFilterItem}>
              <FormField
                controlId="searchTerm"
                label="Search by Label"
                type="text"
                placeholder="Enter field label..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className={styles.dropdownFilterItem}>
              <FormField
                controlId="typeFilter"
                label="Field Type"
                as="select"
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                options={typeOptions}
              />
            </div>
            <div className={styles.dropdownFilterItem}>
              <FormField
                controlId="requiredFilter"
                label="Required"
                as="select"
                value={requiredFilter}
                onChange={(e) => { setRequiredFilter(e.target.value); setCurrentPage(1); }}
                options={requiredOptions}
              />
            </div>
          </div>
          <div className={styles.actionsSection}>
            <StyledButton variant="primary" onClick={() => navigate('/admin/admissions/formfields/new')} className={styles.addButton}>
              <span className={`material-symbols-outlined ${styles.buttonIcon}`}>add</span>
              Add New Field
            </StyledButton>
          </div>
        </div>
        
        <StyledCard.Body>
          {/* Removed headerActions div */}
          {filteredFields.length === 0 ? (
            <p className={styles.noDataText}>No application form fields found matching your criteria.</p>
          ) : (
            <StyledTable striped bordered hover responsive className={styles.dataTable}>
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
                {currentTableData.map((field) => (
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
                        <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
                      </StyledButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </StyledCard.Body>
      </StyledCard>

      {totalPages > 0 && (
        <div className={styles.paginationContainer}>
          <span className={styles.resultsText}>
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredFields.length)} of {filteredFields.length} results
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
                key={currentPage} 
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
    </StyledContainer>
  );
};

export default AppFormFieldListPage;
