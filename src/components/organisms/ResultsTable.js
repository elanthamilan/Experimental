import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';
import {
  StyledContainer,
  StyledTable,
  StyledButton,
  StyledFormCheck,
  StyledBadge, // Assuming StyledBadge is used or might be needed
  StyledFormControl,
  StyledFormSelect,
  SearchInput,
  StyledPagination,
  StyledDropdown,
} from '../../components';
import styles from './ResultsTable.module.scss';

const ResultsTable = ({
  data,
  columns,
  addActionLabel,
  addActionTo,
  showFilterTabs = true,
  showSearch = true, // Default to true
}) => {
  // const initialData = [...] // Removed initialData

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const headerCheckboxRef = useRef(null); // Ref for indeterminate state

  // Filter/Tab state - Counts updated based on new data
  const [activeFilter, setActiveFilter] = useState('All');

  // Conditionally calculate filter counts if tabs are shown and data has 'status'
  let publishedCount = 0;
  let pendingCount = 0;
  let verifiedCount = 0;
  let finalizedCount = 0;
  let publishedToPortalCount = 0;
  let filters = [{ name: 'All', count: data.length }];

  if (showFilterTabs && data.length > 0 && data.some(item => item.hasOwnProperty('status'))) {
    publishedCount = data.filter(item => item.status === 'PUBLISHED').length;
    pendingCount = data.filter(item => item.status === 'PENDING').length;
    verifiedCount = data.filter(item => item.status === 'VERIFIED').length;
    finalizedCount = data.filter(item => item.status === 'FINALIZED').length;
    publishedToPortalCount = publishedCount; // Assuming "Published to portal" means status === 'PUBLISHED'

    filters.push(
      { name: 'Pending', count: pendingCount },
      { name: 'Verified', count: verifiedCount },
      { name: 'Finalized', count: finalizedCount },
      { name: 'Published to portal', count: publishedToPortalCount }
    );
  }


  // Add filtering logic based on activeFilter
  const filteredData = data.filter(item => {
    if (!showFilterTabs || activeFilter === 'All' || !item.hasOwnProperty('status')) {
      return true; // Show all if tabs are hidden, 'All' is selected, or item has no status
    }
    // The following assumes a 'status' field in data.
    if (activeFilter === 'Pending') return item.status === 'PENDING';
    if (activeFilter === 'Verified') return item.status === 'VERIFIED';
    if (activeFilter === 'Finalized') return item.status === 'FINALIZED';
    if (activeFilter === 'Published to portal') return item.status === 'PUBLISHED';
    return true;
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
          {showFilterTabs && filters.length > 1 && ( // Only show tabs if enabled and there's more than just "All"
            <div className={styles.filterTabs}>
              {filters.map(filter => (
              <StyledButton
                key={filter.name}
                variant="link"
                className={`${styles.filterButton} ${activeFilter === filter.name ? styles.active : ''}`}
                onClick={() => handleFilterChange(filter.name)}
              >
                {filter.name} <span className={styles.filterCount}>{filter.count}</span>
              </StyledButton>
            ))}
          </div>
          )}
          <div className={styles.tableActions}>
            {showSearch && (
              <SearchInput
                placeholder="Search all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            )}
            <StyledDropdown
              className={styles.actionDropdown}
              trigger={
                <StyledButton variant="outline-secondary" id="actions-dropdown-trigger">
                  Action <span className="material-symbols-outlined">arrow_drop_down</span>
                </StyledButton>
              }
            >
              <StyledDropdown.Item href="#/action-1">Action 1</StyledDropdown.Item>
              <StyledDropdown.Item href="#/action-2">Action 2</StyledDropdown.Item>
            </StyledDropdown>
            {addActionLabel && addActionTo && (
              <StyledButton as={Link} to={addActionTo} variant="primary" className={styles.addButton}>
                <span className="material-symbols-outlined">add</span> {addActionLabel}
              </StyledButton>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.multiSelectActionBar}>
          <span className={styles.selectionCount}>{numSelected} / {filteredData.length} selected</span>
          <StyledDropdown
            className={styles.multiActionDropdown}
            trigger={
              <StyledButton variant="primary" id="multi-actions-dropdown-trigger">
                Actions <span className="material-symbols-outlined">arrow_drop_down</span>
              </StyledButton>
            }
          >
            <StyledDropdown.Item href="#/multi-action-1">Publish Selected</StyledDropdown.Item>
            <StyledDropdown.Item href="#/multi-action-2">Unpublish Selected</StyledDropdown.Item>
            <StyledDropdown.Divider />
            <StyledDropdown.Item href="#/multi-action-3">Delete Selected</StyledDropdown.Item>
          </StyledDropdown>
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
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id} className={selectedRows.includes(item.id) ? styles.selectedRow : ''}>
              <td>
                <StyledFormCheck
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={(e) => handleSelectRow(e, item.id)}
                  aria-label={`Select row ${item.id}`}
                />
              </td>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {col.cell ? col.cell(item) : item[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>

      <div className={styles.paginationContainer}>
         {/* Update results text based on filtered data */}
        <span className={styles.resultsText}>Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} results</span>

        <div className="d-flex align-items-center gap-3"> {/* Wrapper for pagination controls */}
          <StyledPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            size="sm" // Assuming sm size is appropriate
            maxVisiblePages={5} // Optional: Adjust as needed
            className={styles.paginationControls}
          />

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

ResultsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
    cell: PropTypes.func, // Optional custom cell renderer
  })).isRequired,
  addActionLabel: PropTypes.string,
  addActionTo: PropTypes.string,
  showFilterTabs: PropTypes.bool,
  showSearch: PropTypes.bool,
};

export default ResultsTable;
