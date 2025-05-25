import React, { useState, useEffect, useRef } from 'react';
import { Pagination, DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StyledContainer from './atoms/StyledContainer';
import StyledTable from './atoms/StyledTable';
import StyledButton from './atoms/StyledButton';
import StyledFormCheck from './atoms/StyledFormCheck';
import StyledBadge from './atoms/StyledBadge';
import StyledFormControl from './atoms/StyledFormControl';
import StyledFormSelect from './atoms/StyledFormSelect';
import SearchInput from './molecules/SearchInput';
import styles from './ResultsTable.module.scss';

const ResultsTable = () => {
  // More realistic placeholder data
  const initialData = [
    { id: 1, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 1', subjectCode: 'CS101', subjectName: 'Intro to Programming', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '20 Dec 2023 / Admin', publishedAs: 'Grade', sgpaCgpaStatus: 'ENABLED', status: 'PUBLISHED' },
    { id: 2, program: 'B.E ECE', department: 'Electronics', semester: 'Sem 3', subjectCode: 'EC305', subjectName: 'Digital Circuits', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '21 Dec 2023 / Staff', publishedAs: 'Grade', sgpaCgpaStatus: 'DISABLED', status: 'PUBLISHED' },
    { id: 3, program: 'B.Tech IT', department: 'Information Technology', semester: 'Sem 5', subjectCode: 'IT502', subjectName: 'Database Systems', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
    { id: 4, program: 'B.E Mech', department: 'Mechanical Engg', semester: 'Sem 7', subjectCode: 'ME701', subjectName: 'Heat Transfer', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '18 Dec 2023 / Admin', publishedAs: 'Mark', sgpaCgpaStatus: 'ENABLED', status: 'FINALIZED' },
    { id: 5, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 1', subjectCode: 'MA101', subjectName: 'Calculus I', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '20 Dec 2023 / Admin', publishedAs: 'Grade', sgpaCgpaStatus: 'ENABLED', status: 'PUBLISHED' },
    { id: 6, program: 'B.E Civil', department: 'Civil Engg', semester: 'Sem 3', subjectCode: 'CE301', subjectName: 'Structural Analysis', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
    { id: 7, program: 'B.Tech IT', department: 'Information Technology', semester: 'Sem 5', subjectCode: 'IT504', subjectName: 'Web Technologies', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '19 Dec 2023 / Staff', publishedAs: 'Grade', sgpaCgpaStatus: 'DISABLED', status: 'VERIFIED' },
    { id: 8, program: 'B.E ECE', department: 'Electronics', semester: 'Sem 3', subjectCode: 'EC302', subjectName: 'Analog Electronics', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '21 Dec 2023 / Staff', publishedAs: 'Grade', sgpaCgpaStatus: 'DISABLED', status: 'PUBLISHED' },
    { id: 9, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 3', subjectCode: 'CS301', subjectName: 'Data Structures', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
    { id: 10, program: 'B.E Mech', department: 'Mechanical Engg', semester: 'Sem 5', subjectCode: 'ME503', subjectName: 'Thermodynamics', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '18 Dec 2023 / Admin', publishedAs: 'Mark', sgpaCgpaStatus: 'ENABLED', status: 'FINALIZED' },
    { id: 11, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 1', subjectCode: 'PH101', subjectName: 'Physics I', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '20 Dec 2023 / Admin', publishedAs: 'Grade', sgpaCgpaStatus: 'ENABLED', status: 'PUBLISHED' },
    { id: 12, program: 'B.E ECE', department: 'Electronics', semester: 'Sem 5', subjectCode: 'EC501', subjectName: 'Microprocessors', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
    { id: 13, program: 'B.Tech IT', department: 'Information Technology', semester: 'Sem 7', subjectCode: 'IT701', subjectName: 'Software Engineering', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '19 Dec 2023 / Staff', publishedAs: 'Grade', sgpaCgpaStatus: 'DISABLED', status: 'VERIFIED' },
    { id: 14, program: 'B.E Civil', department: 'Civil Engg', semester: 'Sem 5', subjectCode: 'CE502', subjectName: 'Geotechnical Engg', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
    { id: 15, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 3', subjectCode: 'MA301', subjectName: 'Linear Algebra', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
    // Add more rows as needed to reach ~29 total for filter counts
     { id: 16, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 5', subjectCode: 'CS501', subjectName: 'Operating Systems', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '22 Dec 2023 / Admin', publishedAs: 'Grade', sgpaCgpaStatus: 'ENABLED', status: 'PUBLISHED' },
     { id: 17, program: 'B.E ECE', department: 'Electronics', semester: 'Sem 1', subjectCode: 'CY101', subjectName: 'Chemistry', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '21 Dec 2023 / Staff', publishedAs: 'Grade', sgpaCgpaStatus: 'DISABLED', status: 'PUBLISHED' },
     { id: 18, program: 'B.Tech IT', department: 'Information Technology', semester: 'Sem 3', subjectCode: 'IT301', subjectName: 'Object Oriented Prog.', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
     { id: 19, program: 'B.E Mech', department: 'Mechanical Engg', semester: 'Sem 1', subjectCode: 'ME101', subjectName: 'Engg. Graphics', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '18 Dec 2023 / Admin', publishedAs: 'Mark', sgpaCgpaStatus: 'ENABLED', status: 'FINALIZED' },
     { id: 20, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 5', subjectCode: 'CS503', subjectName: 'Computer Networks', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '22 Dec 2023 / Admin', publishedAs: 'Grade', sgpaCgpaStatus: 'ENABLED', status: 'PUBLISHED' },
     { id: 21, program: 'B.E Civil', department: 'Civil Engg', semester: 'Sem 1', subjectCode: 'CE101', subjectName: 'Basic Civil Engg.', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
     { id: 22, program: 'B.Tech IT', department: 'Information Technology', semester: 'Sem 1', subjectCode: 'HS101', subjectName: 'Communication Skills', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '19 Dec 2023 / Staff', publishedAs: 'Grade', sgpaCgpaStatus: 'DISABLED', status: 'VERIFIED' },
     { id: 23, program: 'B.E ECE', department: 'Electronics', semester: 'Sem 7', subjectCode: 'EC702', subjectName: 'VLSI Design', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
     { id: 24, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 7', subjectCode: 'CS703', subjectName: 'Artificial Intelligence', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
     { id: 25, program: 'B.E Mech', department: 'Mechanical Engg', semester: 'Sem 3', subjectCode: 'ME302', subjectName: 'Fluid Mechanics', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
     { id: 26, program: 'B.E CSE', department: 'Computer Science', semester: 'Sem 1', subjectCode: 'CS102', subjectName: 'Workshop Practice', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '20 Dec 2023 / Admin', publishedAs: 'Grade', sgpaCgpaStatus: 'ENABLED', status: 'PUBLISHED' },
     { id: 27, program: 'B.E ECE', department: 'Electronics', semester: 'Sem 3', subjectCode: 'MA302', subjectName: 'Probability Theory', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '21 Dec 2023 / Staff', publishedAs: 'Grade', sgpaCgpaStatus: 'DISABLED', status: 'PUBLISHED' },
     { id: 28, program: 'B.Tech IT', department: 'Information Technology', semester: 'Sem 5', subjectCode: 'IT501', subjectName: 'Theory of Computation', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
     { id: 29, program: 'B.E Mech', department: 'Mechanical Engg', semester: 'Sem 7', subjectCode: 'ME704', subjectName: 'Robotics', startDate: '01 Sep 2023', endDate: '15 Dec 2023', publishedOn: '', publishedAs: '', sgpaCgpaStatus: 'PENDING', status: 'PENDING' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const headerCheckboxRef = useRef(null); // Ref for indeterminate state

  // Filter/Tab state - Counts updated based on new data
  const [activeFilter, setActiveFilter] = useState('All');
  // Calculate counts dynamically (example)
  const publishedCount = initialData.filter(item => item.status === 'PUBLISHED').length;
  const pendingCount = initialData.filter(item => item.status === 'PENDING').length;
  const verifiedCount = initialData.filter(item => item.status === 'VERIFIED').length;
  const finalizedCount = initialData.filter(item => item.status === 'FINALIZED').length;
  // Assuming "Published to portal" means status === 'PUBLISHED'
  const publishedToPortalCount = publishedCount;

  const filters = [
    { name: 'All', count: initialData.length },
    { name: 'Pending', count: pendingCount },
    { name: 'Verified', count: verifiedCount },
    { name: 'Finalized', count: finalizedCount },
    { name: 'Published to portal', count: publishedToPortalCount }
  ];

  // Add filtering logic based on activeFilter
  const filteredData = initialData.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return item.status === 'PENDING';
    if (activeFilter === 'Verified') return item.status === 'VERIFIED';
    if (activeFilter === 'Finalized') return item.status === 'FINALIZED';
    if (activeFilter === 'Published to portal') return item.status === 'PUBLISHED';
    return true; // Should not happen
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Paginate the filtered data
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    // Reset to page 1 if filter changes? Optional.
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (filterName) => {
    setActiveFilter(filterName);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // Update header checkbox indeterminate state
  useEffect(() => {
    if (headerCheckboxRef.current) {
      const numSelected = selectedRows.length;
      const numCurrentItems = currentItems.length;
      headerCheckboxRef.current.checked = numSelected === numCurrentItems && numCurrentItems > 0;
      headerCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numCurrentItems;
    }
  }, [selectedRows, currentItems]);


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(currentItems.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (e, id) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAllFiltered = () => {
    // Select all items that match the current filter, across all pages
    setSelectedRows(filteredData.map(item => item.id));
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  const numSelected = selectedRows.length;

  return (
    <StyledContainer fluid className={styles.resultsTableContainer}>
      {/* Conditionally render controls or multi-select bar */}
      {numSelected === 0 ? (
        <div className={styles.tableControls}>
          <div className={styles.filterTabs}>
            {filters.map(filter => (
            <StyledButton // Use StyledButton
              key={filter.name}
              variant="link" // Use link variant as base, styling handled by SCSS
              className={`${styles.filterButton} ${activeFilter === filter.name ? styles.active : ''}`}
              onClick={() => handleFilterChange(filter.name)} // Use handler
            >
              {filter.name} <span className={styles.filterCount}>{filter.count}</span>
            </StyledButton>
          ))}
        </div>
        <div className={styles.tableActions}>
          <SearchInput
            placeholder="Search all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {/* Re-adding Action Dropdown and adding Add Button */}
          {/* Using Bootstrap DropdownButton for now, ensure variant matches StyledButton */}
          <DropdownButton id="actions-dropdown" title="Action" variant="outline-secondary" className={styles.actionDropdown}>
            <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Action 2</Dropdown.Item>
          </DropdownButton>
          {/* Use StyledButton with Link */}
          <StyledButton as={Link} to="/add" variant="primary" className={styles.addButton}>
             <span className="material-symbols-outlined">add</span> Add
          </StyledButton>
        </div>
      </div>
      ) : (
        <div className={styles.multiSelectActionBar}>
          <span className={styles.selectionCount}>{numSelected} / {filteredData.length} selected</span>
          <DropdownButton id="multi-actions-dropdown" title="Actions" variant="primary" className={styles.multiActionDropdown}>
            {/* Add relevant multi-select actions here */}
            <Dropdown.Item href="#/multi-action-1">Publish Selected</Dropdown.Item>
            <Dropdown.Item href="#/multi-action-2">Unpublish Selected</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/multi-action-3">Delete Selected</Dropdown.Item>
          </DropdownButton>
          {/* Use StyledButton */}
          <StyledButton variant="link" onClick={handleSelectAllFiltered} className={styles.selectAllLink}>
            Select all {filteredData.length}
          </StyledButton>
          {/* Use StyledButton */}
          <StyledButton variant="link" onClick={handleClearSelection} className={styles.clearSelectionLink}>
            <span className="material-symbols-outlined">close</span> Clear selection
          </StyledButton>
        </div>
      )}


      <StyledTable variant="hover" responsive className={styles.dataTable}>
        <thead>
          <tr>
            <th>
              <StyledFormCheck // Use StyledFormCheck
                type="checkbox"
                ref={headerCheckboxRef} // Set ref - Note: Forwarding ref might be needed in StyledFormCheck if not already done
                onChange={handleSelectAll}
                // Checked and indeterminate state managed by useEffect
              />
            </th>
            <th>PROGRAM</th>
            <th>DEPARTMENT</th>
            <th>SEMESTER</th>
            <th>SUBJECT CODE</th>
            <th>SUBJECT NAME</th>
            <th>START DATE</th>
            <th>END DATE</th>
            <th>PUBLISHED ON</th>
            <th>PUBLISHED AS</th>
            <th>SGPA & CGPA STATUS</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
             // Add selected class to row
            <tr key={item.id} className={selectedRows.includes(item.id) ? styles.selectedRow : ''}>
              <td>
                <StyledFormCheck // Use StyledFormCheck
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={(e) => handleSelectRow(e, item.id)}
                  aria-label={`Select row ${item.id}`} // Add aria-label for accessibility
                />
              </td>
              <td>{item.program}</td>
              <td>{item.department}</td>
              <td>{item.semester}</td>
              <td>{item.subjectCode}</td>
              <td>{item.subjectName}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td>{item.publishedOn}</td>
              <td>{item.publishedAs}</td>
              <td>
                <span className={`${styles.statusBadge} ${styles.disabled}`}>
                  <span className={styles.statusIcon}></span>
                  {/* Display based on actual status */}
                  {item.sgpaCgpaStatus}
                </span>
              </td>
              <td>
                <StyledBadge
                  variant={item.status === 'Published' ? 'success' : item.status === 'Draft' ? 'secondary' : 'warning'}
                  size="sm"
                >
                  {item.status}
                </StyledBadge>
              </td>
              {/* Replace button with More Options dropdown */}
              <td>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id={`dropdown-action-${item.id}`} className={styles.moreOptionsToggle}>
                    <span className="material-symbols-outlined">more_vert</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                     {/* Wrap Edit item in Link */}
                    <Dropdown.Item as={Link} to={`/edit/${item.id}`}>Edit</Dropdown.Item>
                    <Dropdown.Item href={`#delete/${item.id}`} className="text-danger">Delete</Dropdown.Item>
                    {/* Add other actions like Publish if needed */}
                    <Dropdown.Item href={`#publish/${item.id}`}>Publish</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>

      <div className={styles.paginationContainer}>
         {/* Update results text based on filtered data */}
        <span className={styles.resultsText}>Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} results</span>

        <div className="d-flex align-items-center gap-3"> {/* Wrapper for pagination controls */}
          <Pagination className={styles.paginationControls}>
            {/* Using Material Symbols for Pagination */}
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1 || totalPages === 0}>
              <span className="material-symbols-outlined">first_page</span>
            </Pagination.First>
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || totalPages === 0}>
               <span className="material-symbols-outlined">chevron_left</span>
               Prev {/* Text from feedback */}
            </Pagination.Prev>

            {/* Basic pagination items - Needs better logic for large page counts */}
            {/* Render only if there are pages */}
            {totalPages > 0 && [...Array(totalPages).keys()].map(number => (
              // Improved logic to show first, last, current, and neighbors
              (number === 0 || number === totalPages - 1 || Math.abs(number + 1 - currentPage) <= 1) ? (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ) : (
                // Show ellipsis only once between groups
                (number === 1 && currentPage > 3) || (number === totalPages - 2 && currentPage < totalPages - 2) ? <Pagination.Ellipsis key={`ellipsis-${number}`} disabled /> : null
              )
            ))}

            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
               Next {/* Text from feedback */}
               <span className="material-symbols-outlined">chevron_right</span>
            </Pagination.Next>
             {/* Add Last Page Button if needed */}
             {/* <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>
               <span className="material-symbols-outlined">last_page</span>
             </Pagination.Last> */}
          </Pagination>

          <div className={styles.pageInputControls}>
            <span>Page</span>
            {/* Use StyledFormControl */}
            <StyledFormControl
              type="number"
              value={currentPage}
              onChange={(e) => handlePageChange(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
              className={styles.pageInput}
              min="1"
              max={totalPages}
              size="sm"
            />
            <span>of <span className={styles.totalPagesLink}>{totalPages}</span></span>
          </div>

          {/* Use StyledFormSelect */}
          <StyledFormSelect size="sm" className={styles.itemsPerPageSelect} value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </StyledFormSelect> {/* Close the tag */}
        </div>
      </div>
    </StyledContainer>
  );
};

export default ResultsTable;
