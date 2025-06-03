import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';
import StyledContainer from '../atoms/StyledContainer';
import StyledTable from '../atoms/StyledTable';
import StyledButton from '../atoms/StyledButton';
import StyledFormCheck from '../atoms/StyledFormCheck';
import StyledBadge from '../atoms/StyledBadge';
import StyledFormControl from '../atoms/StyledFormControl';
import StyledFormSelect from '../atoms/StyledFormSelect';
import SearchInput from '../molecules/SearchInput';
import StyledPagination from '../atoms/StyledPagination';
import StyledDropdown from '../molecules/StyledDropdown';
import styles from './ResultsTable.module.scss';

const ResultsTable = ({
  data = [],
  columns = [],
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
  const [managedColumns, setManagedColumns] = useState([]);
  const [resizingColumn, setResizingColumn] = useState(null);
  const [draggingColumnId, setDraggingColumnId] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);
  const [density, setDensity] = useState('regular'); // Options: 'compact', 'regular', 'relaxed'
  const [sortConfig, setSortConfig] = useState({ columnId: null, direction: 'none' });

  // Filter/Tab state - Counts updated based on new data
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const newManagedColumns = columns.map((col, index) => ({
      id: col.accessor, // Assuming accessor is unique, otherwise generate ID
      originalAccessor: col.accessor,
      headerContent: col.header,
      CellRenderer: col.cell,
      isVisible: true,
      width: 150, // Default width in pixels
      minWidth: 50,
      order: index,
      canResize: true,
      canReorder: true,
      canSort: true,
      sortDirection: null, // This will be updated based on sortConfig for UI indication later
      sortType: col.sortType || 'alphanumeric',
    }));
    setManagedColumns(newManagedColumns);
  }, [columns]);

  const handleMouseDown = (e, columnId) => {
    e.preventDefault();
    const column = managedColumns.find(c => c.id === columnId);
    if (column) {
      setResizingColumn({
        id: columnId,
        initialX: e.clientX,
        initialWidth: column.width,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!resizingColumn) return;
      e.preventDefault();
      const deltaX = e.clientX - resizingColumn.initialX;
      const newWidth = resizingColumn.initialWidth + deltaX;

      setManagedColumns(prevCols =>
        prevCols.map(c =>
          c.id === resizingColumn.id ? { ...c, width: Math.max(c.minWidth, newWidth) } : c
        )
      );
    };

    const handleMouseUp = (e) => {
      if (!resizingColumn) return;
      e.preventDefault();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setResizingColumn(null);
    };

    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, managedColumns]); // Add managedColumns to dependencies to ensure minWidth is up-to-date

  const handleDragStart = (e, columnId) => {
    e.dataTransfer.setData('text/plain', columnId);
    setDraggingColumnId(columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDragEnter = (e, targetColumnId) => {
    e.preventDefault();
    setDragOverColumnId(targetColumnId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverColumnId(null);
  };

  const handleDrop = (e, droppedOnColumnId) => {
    e.preventDefault();
    const sourceColumnId = e.dataTransfer.getData('text/plain');
    setDraggingColumnId(null);
    setDragOverColumnId(null);

    if (sourceColumnId === droppedOnColumnId) return;

    setManagedColumns(prevCols => {
      const sourceIndex = prevCols.findIndex(c => c.id === sourceColumnId);
      const targetIndex = prevCols.findIndex(c => c.id === droppedOnColumnId);

      if (sourceIndex === -1 || targetIndex === -1) return prevCols;

      const newCols = [...prevCols];
      const [draggedCol] = newCols.splice(sourceIndex, 1);
      newCols.splice(targetIndex, 0, draggedCol);

      return newCols.map((col, index) => ({ ...col, order: index }));
    });
  };

  const handleSort = (columnIdToSort) => {
    let direction = 'asc';
    if (sortConfig.columnId === columnIdToSort && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.columnId === columnIdToSort && sortConfig.direction === 'desc') {
      direction = 'none';
    }

    setSortConfig({
      columnId: direction === 'none' ? null : columnIdToSort,
      direction,
    });
    setCurrentPage(1);
  };

  // Prepare columns for rendering (sorted and filtered by visibility and order)
  const visibleColumns = managedColumns
    .filter(col => col.isVisible)
    .sort((a, b) => a.order - b.order);

  // Memoize processed (filtered, sorted, paginated) items
  const processedItemsResult = React.useMemo(() => {
    let items = [...data];

    // Apply filtering
    if (showFilterTabs && activeFilter !== 'All' && items.some(item => item.hasOwnProperty('status'))) {
      items = items.filter(item => {
        if (activeFilter === 'Pending') return item.status === 'PENDING';
        if (activeFilter === 'Verified') return item.status === 'VERIFIED';
        if (activeFilter === 'Finalized') return item.status === 'FINALIZED';
        if (activeFilter === 'Published to portal') return item.status === 'PUBLISHED';
        return true;
      });
    }
    const totalFilteredItems = items.length;

    // Apply sorting
    if (sortConfig.columnId && sortConfig.direction !== 'none') {
      const columnToSortBy = managedColumns.find(col => col.id === sortConfig.columnId);
      if (columnToSortBy) {
        items.sort((a, b) => {
          const valA = a[columnToSortBy.originalAccessor];
          const valB = b[columnToSortBy.originalAccessor];

          // Handle null or undefined values
          if (valA == null && valB == null) return 0;
          if (valA == null) return sortConfig.direction === 'asc' ? -1 : 1;
          if (valB == null) return sortConfig.direction === 'asc' ? 1 : -1;

          let comparison = 0;
          if (columnToSortBy.sortType === 'numeric') {
            comparison = parseFloat(valA) - parseFloat(valB);
          } else if (columnToSortBy.sortType === 'date') {
            comparison = new Date(valA) - new Date(valB);
          } else { // alphanumeric
            comparison = String(valA).localeCompare(String(valB));
          }
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
      }
    }

    // Apply pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const itemsToDisplay = items.slice(indexOfFirstItem, indexOfLastItem);

    return { itemsToDisplay, totalFilteredItems };
  }, [data, activeFilter, showFilterTabs, sortConfig, managedColumns, currentPage, itemsPerPage]);

  const { itemsToDisplay, totalFilteredItems } = processedItemsResult;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);


  // Conditionally calculate filter counts if tabs are shown and data has 'status'
  // Note: This filter count logic should ideally use the raw `data` prop before any other processing.
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
      const numCurrentItems = itemsToDisplay.length; // Use itemsToDisplay
      headerCheckboxRef.current.checked = numSelected === numCurrentItems && numCurrentItems > 0;
      headerCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numCurrentItems;
    }
  }, [selectedRows, itemsToDisplay]);


  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(itemsToDisplay.map(item => item.id)); // Use itemsToDisplay
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
    // This should select all items that match the current filter, across all pages of that filter.
    // The `processedItemsResult` already filters, but not sorts for this specific selection.
    // We need to re-filter the original data for this action.
    let itemsToSelect = [...data];
    if (showFilterTabs && activeFilter !== 'All' && itemsToSelect.some(item => item.hasOwnProperty('status'))) {
       itemsToSelect = itemsToSelect.filter(item => {
        if (activeFilter === 'Pending') return item.status === 'PENDING';
        if (activeFilter === 'Verified') return item.status === 'VERIFIED';
        if (activeFilter === 'Finalized') return item.status === 'FINALIZED';
        if (activeFilter === 'Published to portal') return item.status === 'PUBLISHED';
        return true;
      });
    }
    setSelectedRows(itemsToSelect.map(item => item.id));
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
            {/* Search input - future enhancement: integrate with filtering/sorting */}
            {showSearch && (
              <SearchInput
                placeholder="Search all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            )}
            <div className={styles.densityControls}>
              <StyledButton
                variant={density === 'compact' ? 'primary' : 'outline-secondary'}
                onClick={() => setDensity('compact')}
                size="sm"
                title="Compact density"
              >
                <span className="material-symbols-outlined">density_small</span>
              </StyledButton>
              <StyledButton
                variant={density === 'regular' ? 'primary' : 'outline-secondary'}
                onClick={() => setDensity('regular')}
                size="sm"
                title="Regular density"
              >
                <span className="material-symbols-outlined">density_medium</span>
              </StyledButton>
              <StyledButton
                variant={density === 'relaxed' ? 'primary' : 'outline-secondary'}
                onClick={() => setDensity('relaxed')}
                size="sm"
                title="Relaxed density"
              >
                <span className="material-symbols-outlined">density_large</span>
              </StyledButton>
            </div>
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
          <span className={styles.selectionCount}>{numSelected} / {totalFilteredItems} selected</span>
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
            Select all {totalFilteredItems}
          </StyledButton>
          {/* Use StyledButton */}
          <StyledButton variant="link" onClick={handleClearSelection} className={styles.clearSelectionLink}>
            <span className="material-symbols-outlined">close</span> Clear selection
          </StyledButton>
        </div>
      )}


      <StyledTable
        variant="hover"
        responsive
        className={`${styles.dataTable} ${styles[`density${density.charAt(0).toUpperCase() + density.slice(1)}`]}`}
      >
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
            {visibleColumns.map((col) => (
              <th
                key={col.id}
                style={{ width: `${col.width}px`, position: 'relative' }}
                draggable={col.canReorder ? "true" : undefined}
                onDragStart={col.canReorder ? (e) => handleDragStart(e, col.id) : undefined}
                onDragOver={col.canReorder ? handleDragOver : undefined}
                onDrop={col.canReorder ? (e) => handleDrop(e, col.id) : undefined}
                onDragEnter={col.canReorder ? (e) => handleDragEnter(e, col.id) : undefined}
                onDragLeave={col.canReorder ? handleDragLeave : undefined}
                onClick={() => col.canSort && handleSort(col.id)}
                className={`
                  ${draggingColumnId === col.id ? styles.draggingColumn : ''}
                  ${dragOverColumnId === col.id ? styles.dragOverColumn : ''}
                  ${col.canSort ? styles.sortableHeader : ''}
                `}
              >
                <div className={styles.headerContentWrapper}>
                  <span>{col.headerContent}</span>
                  {col.canSort && (
                    <span className={`${styles.sortIndicator} ${ (sortConfig.columnId === col.id && sortConfig.direction !== 'none') ? styles.activeSortIndicator : ''}`}>
                      {sortConfig.columnId === col.id ? (
                        sortConfig.direction === 'asc' ? <span className="material-symbols-outlined">arrow_upward</span> :
                        sortConfig.direction === 'desc' ? <span className="material-symbols-outlined">arrow_downward</span> :
                        <span className="material-symbols-outlined">unfold_more</span> // Should ideally not happen if columnId is null for 'none'
                      ) : (
                        <span className="material-symbols-outlined">unfold_more</span>
                      )}
                    </span>
                  )}
                </div>
                {col.canResize && (
                  <div
                    className={styles.resizeHandle}
                    onMouseDown={(e) => handleMouseDown(e, col.id)}
                    data-column-id={col.id}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((item) => (
            <tr key={item.id} className={selectedRows.includes(item.id) ? styles.selectedRow : ''}>
              <td>
                <StyledFormCheck
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={(e) => handleSelectRow(e, item.id)}
                  aria-label={`Select row ${item.id}`}
                />
              </td>
              {visibleColumns.map((col) => (
                <td key={col.id}>
                  {col.CellRenderer ? col.CellRenderer(item) : item[col.originalAccessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>

      <div className={styles.paginationContainer}>
        <span className={styles.resultsText}>
          Showing {totalFilteredItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
          {Math.min(currentPage * itemsPerPage, totalFilteredItems)} of {totalFilteredItems} results
        </span>

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
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
    accessor: PropTypes.string.isRequired,
    cell: PropTypes.func, // Optional custom cell renderer
  })),
  addActionLabel: PropTypes.string,
  addActionTo: PropTypes.string,
  showFilterTabs: PropTypes.bool,
  showSearch: PropTypes.bool,
};

export default ResultsTable;
