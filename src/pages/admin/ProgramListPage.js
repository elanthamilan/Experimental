import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPrograms } from '../../data/mockPrograms';
// import { Pagination } from 'react-bootstrap'; // Already removed
import {
  StyledContainer,
  // StyledTable, // Removed
  StyledCard,
  StyledButton, // Kept for action button in cell renderer
  // StyledFormControl, // Removed
  // StyledFormSelect,  // Removed
  // StyledPagination, // Removed
  ListControlsToolbar,
  ResultsTable, // Added
} from '../../components';
import styles from './ProgramListPage.module.scss';

const ProgramListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [degreeLevelFilter, setDegreeLevelFilter] = useState('');

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [degreeLevelOptions, setDegreeLevelOptions] = useState([]);

  // const [currentPage, setCurrentPage] = useState(1); // Removed
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Removed

  useEffect(() => {
    const uniqueDepartments = ['All', ...new Set(mockPrograms.map(p => p.department).filter(Boolean))];
    setDepartmentOptions(uniqueDepartments);

    const uniqueDegreeLevels = ['All', ...new Set(mockPrograms.map(p => p.degreeLevel).filter(Boolean))];
    setDegreeLevelOptions(uniqueDegreeLevels);
  }, []);

  const filteredPrograms = mockPrograms.filter(program => {
    const nameMatch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      program.id.toLowerCase().includes(searchTerm.toLowerCase());
    const departmentMatch = departmentFilter === '' || departmentFilter === 'All' || program.department === departmentFilter;
    const degreeLevelMatch = degreeLevelFilter === '' || degreeLevelFilter === 'All' || program.degreeLevel === degreeLevelFilter;
    return nameMatch && departmentMatch && degreeLevelMatch;
  });

  // Old pagination logic removed
  // const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTableData = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
  // handlePageChange, handlePageInputSubmit, handleItemsPerPageChange

  const programTableColumns = [
    { header: 'Program ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Degree Level', accessor: 'degreeLevel' },
    { header: 'Duration', accessor: 'duration' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <StyledButton
          variant="outline-primary"
          size="sm"
          onClick={() => navigate(`/admin/programs/edit/${item.id}`)}
          title="Edit Program"
        >
          <span className={`material-symbols-outlined ${styles.actionButtonIcon}`}>edit</span>
        </StyledButton>
      ),
    },
  ];

  return (
    <StyledContainer className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Program Management</h1>
      </div>
      <StyledCard className={styles.contentCard}>
        <StyledCard.Header>
          {/* Optional: <StyledCard.Title>Program Management</StyledCard.Title> */}
        </StyledCard.Header>

        <ListControlsToolbar
          searchTerm={searchTerm}
          onSearchChange={(e) => { setSearchTerm(e.target.value); /* setCurrentPage(1) removed */ }}
          searchPlaceholder="ID or Name..."
          searchLabel="Search Program"
          filters={[
            {
              controlId: "departmentFilter",
              label: "Department",
              value: departmentFilter,
              onChange: (e) => { setDepartmentFilter(e.target.value); /* setCurrentPage(1) removed */ },
              options: departmentOptions.map(dept => ({ value: dept === 'All' ? '' : dept, label: dept })),
              type: 'select',
            },
            {
              controlId: "degreeLevelFilter",
              label: "Degree Level",
              value: degreeLevelFilter,
              onChange: (e) => { setDegreeLevelFilter(e.target.value); /* setCurrentPage(1) removed */ },
              options: degreeLevelOptions.map(level => ({ value: level === 'All' ? '' : level, label: level })),
              type: 'select',
            }
          ]}
          // addAction prop removed from ListControlsToolbar
          // addAction={{
          //   label: "Add New Program",
          //   onClick: () => navigate('/admin/programs/new'),
          //   icon: "add",
          // }}
        />

        <StyledCard.Body>
          {filteredPrograms.length === 0 ? (
            <p className={styles.noDataText}>No programs found matching your criteria.</p>
          ) : (
            <ResultsTable
              data={filteredPrograms}
              columns={programTableColumns}
              showFilterTabs={false}
              showSearch={false}
              addActionLabel="Add New Program"
              addActionTo="/admin/programs/new"
            />
          )}
        </StyledCard.Body>
      </StyledCard>

      {/* Old Pagination JSX Removed */}
    </StyledContainer>
  );
};

export default ProgramListPage;
