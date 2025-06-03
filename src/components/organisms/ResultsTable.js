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

const LOCALSTORAGE_KEY = 'resultsTableUserSettings_v1';

const loadSettingsFromLocalStorage = () => {
  try {
    const serializedSettings = localStorage.getItem(LOCALSTORAGE_KEY);
    if (serializedSettings === null) {
      return undefined;
    }
    const settings = JSON.parse(serializedSettings);
    if (settings && settings.version === 1) {
      return settings;
    } else {
      localStorage.removeItem(LOCALSTORAGE_KEY);
      return undefined;
    }
  } catch (error) {
    console.warn("Could not load table settings from localStorage:", error);
    return undefined;
  }
};

const initializeManagedColumns = (propsColumns, savedColumnSettingsArray) => {
  let initialColumns = propsColumns.map((col, index) => ({
    id: col.accessor,
    originalAccessor: col.accessor,
    headerContent: col.header,
    CellRenderer: col.cell,
    isVisible: col.isVisible !== undefined ? col.isVisible : true, // Respect prop default
    width: 150, // Default width
    minWidth: 50,
    order: index,
    canResize: true,
    canReorder: true,
    canSort: true,
    sortDirection: null,
    sortType: col.sortType || 'alphanumeric',
    canFilter: col.canFilter !== undefined ? col.canFilter : true,
    filterType: col.filterType || 'text',
  }));

  if (savedColumnSettingsArray) {
    const savedSettingsMap = new Map(
      savedColumnSettingsArray.map(cs => [cs.id, cs])
    );

    initialColumns.forEach(col => {
      if (savedSettingsMap.has(col.id)) {
        const savedCol = savedSettingsMap.get(col.id);
        col.width = savedCol.width !== undefined ? savedCol.width : col.width;
        col.order = savedCol.order !== undefined ? savedCol.order : col.order;
        col.isVisible = savedCol.isVisible !== undefined ? savedCol.isVisible : col.isVisible;
      }
    });

    initialColumns.sort((a, b) => a.order - b.order);
    // Re-normalize order
    initialColumns = initialColumns.map((col, index) => ({ ...col, order: index }));
  }
  return initialColumns;
};


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
  const loadedSettings = React.useMemo(() => loadSettingsFromLocalStorage(), []);

  const [itemsPerPage, setItemsPerPage] = useState(() => loadedSettings?.itemsPerPage || 10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Not saved/loaded for now
  const headerCheckboxRef = useRef(null);
  const [managedColumns, setManagedColumns] = useState([]);
  const [resizingColumn, setResizingColumn] = useState(null);
  const [draggingColumnId, setDraggingColumnId] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);
  const [density, setDensity] = useState(() => loadedSettings?.density || 'regular');
  const [sortConfig, setSortConfig] = useState(() => loadedSettings?.sortConfig || { columnId: null, direction: 'none' });
  const [columnFilters, setColumnFilters] = useState(() => loadedSettings?.columnFilters || {});
  const [activeFilterPopover, setActiveFilterPopover] = useState(null);
  const [currentPopoverFilterValue, setCurrentPopoverFilterValue] = useState('');
  const [showColumnVisibilityMenu, setShowColumnVisibilityMenu] = useState(false);
  const columnVisibilityMenuRef = useRef(null);

  // Filter/Tab state - Counts updated based on new data
  const [activeFilter, setActiveFilter] = useState('All'); // Tab filter state not saved

  useEffect(() => {
    setManagedColumns(initializeManagedColumns(columns, loadedSettings?.columnSettings));
  }, [columns, loadedSettings]);

  // Click-away listener for column visibility menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColumnVisibilityMenu &&
          columnVisibilityMenuRef.current &&
          !columnVisibilityMenuRef.current.contains(event.target)) {
        // Check if the click is on the toggle button itself to avoid immediate re-close
        // This can be done by adding a ref to the button or checking class names,
        // but for now, the button's own toggle logic might be sufficient.
        // A more robust way is to pass the event target to the toggle function from button and check there.
        // However, the current setup for button is just setShowColumnVisibilityMenu(prev => !prev)
        // Let's find the button by a temporary ID or class if needed, or rely on event propagation.
        // For now, let's assume the button is not inside the menu, so this check is okay.

        // A common pattern is to ensure the click wasn't on the button that opens the menu.
        // If the button has a specific ref or class, we can check here.
        // For this example, we assume the button is outside columnVisibilityMenuRef.
        // If the button itself is clicked, its own onClick will handle toggling.
        // This listener is primarily for clicks *not* on the menu or its toggle button.

        // Let's refine: if the click is on the toggle button, its own handler should work.
        // This effect should close the menu if the click is anywhere else.
        // We need to ensure the button click doesn't also trigger this immediately.
        // A simple way is to check if the target is the button.
        // For this, the button would need a ref.
        // Let's assume the button's onClick handles its own toggle and this handles "away" clicks.

        // A better approach for click-away that correctly handles the toggle button:
        // Check if the event target is outside the menu AND outside the button.
        // This requires a ref on the button. Let's add `columnVisibilityButtonRef`.
        // For now, the provided logic is:
        if (!event.target.closest(`.${styles.columnVisibilityButton}`)) { // Check if click is not on or inside the button
             setShowColumnVisibilityMenu(false);
        }
      }
    };

    if (showColumnVisibilityMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnVisibilityMenu]); // Dependency: showColumnVisibilityMenu


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

  const handleColumnFilterChange = (columnId, value) => {
    setColumnFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (value === null || value === '') { // Define "empty" criteria
        delete newFilters[columnId];
      } else {
        newFilters[columnId] = value;
      }
      return newFilters;
    });
    setCurrentPage(1);
  };

  const clearAllColumnFilters = () => {
    setColumnFilters({});
    setCurrentPage(1);
  };

  const resetTableSettings = () => {
    localStorage.removeItem(LOCALSTORAGE_KEY);
    setItemsPerPage(10);
    setDensity('regular');
    setSortConfig({ columnId: null, direction: 'none' });
    setColumnFilters({});
    setCurrentPage(1);
    // Re-initialize columns to their default state from props
    setManagedColumns(initializeManagedColumns(columns, undefined));
    // activeFilterPopover and currentPopoverFilterValue are transient, reset if needed
    setActiveFilterPopover(null);
    setCurrentPopoverFilterValue('');
    // searchTerm is also transient for now
    setSearchTerm('');
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

    // Apply global text search (searchTerm) - Assuming it's a simple "contains" search across all stringifiable fields
    // This is a basic implementation. For more complex scenarios, consider more specific search logic.
    if (searchTerm) {
      items = items.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply tab filters (based on activeFilter)
    let dataAfterTabFilters = items;
    if (showFilterTabs && activeFilter !== 'All' && dataAfterTabFilters.some(item => item.hasOwnProperty('status'))) {
      dataAfterTabFilters = dataAfterTabFilters.filter(item => {
        if (activeFilter === 'Pending') return item.status === 'PENDING';
        if (activeFilter === 'Verified') return item.status === 'VERIFIED';
        if (activeFilter === 'Finalized') return item.status === 'FINALIZED';
        if (activeFilter === 'Published to portal') return item.status === 'PUBLISHED';
        return true; // Should not happen if activeFilter is one of the above
      });
    }

    // Apply Column Filters
    let dataAfterAllFilters = dataAfterTabFilters;
    if (Object.keys(columnFilters).length > 0) {
      dataAfterAllFilters = dataAfterTabFilters.filter(item => {
        for (const columnId in columnFilters) {
          const filterValue = columnFilters[columnId];
          if (filterValue === null || filterValue === '') continue;

          const columnConfig = managedColumns.find(c => c.id === columnId);
          if (!columnConfig) continue;

          const itemValue = item[columnConfig.originalAccessor];

          if (itemValue == null) return false; // If item value is null/undefined, it can't match

          if (columnConfig.filterType === 'text') {
            if (!String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
              return false;
            }
          } else if (columnConfig.filterType === 'number') {
            const numItemValue = parseFloat(itemValue);
            const numFilterValue = parseFloat(filterValue);
            if (isNaN(numItemValue) || isNaN(numFilterValue) || numItemValue !== numFilterValue) {
                // Fallback for partial matches or if user is typing non-numeric for a number field
                if (!String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
                    return false;
                }
            }
          } else if (columnConfig.filterType === 'date') {
            // Basic string contains for date. Assumes user types something that can be found in date string.
            // For more robust date filtering, consider date range pickers and proper date object comparisons.
            if (!String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
              return false;
            }
          }
        }
        return true; // Item passes all active column filters
      });
    }

    const totalFilteredItems = dataAfterAllFilters.length;

    // Apply sorting
    let sortedData = [...dataAfterAllFilters]; // Sort the data that has passed all filters
    if (sortConfig.columnId && sortConfig.direction !== 'none') {
      const columnToSortBy = managedColumns.find(col => col.id === sortConfig.columnId);
      if (columnToSortBy) {
        sortedData.sort((a, b) => {
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
    const itemsToDisplay = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    return { itemsToDisplay, totalFilteredItems };
  }, [data, searchTerm, activeFilter, showFilterTabs, columnFilters, sortConfig, managedColumns, currentPage, itemsPerPage]);

  const { itemsToDisplay, totalFilteredItems } = processedItemsResult;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

  const saveSettingsToLocalStorage = (settings) => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn("Could not save table settings to localStorage:", error);
    }
  };

  useEffect(() => {
    const currentSettings = {
      version: 1,
      columnSettings: managedColumns.map(col => ({
        id: col.id,
        order: col.order,
        width: col.width,
        isVisible: col.isVisible,
      })),
      density: density,
      sortConfig: sortConfig,
      columnFilters: columnFilters,
      itemsPerPage: itemsPerPage,
    };
    saveSettingsToLocalStorage(currentSettings);
  }, [managedColumns, density, sortConfig, columnFilters, itemsPerPage]);


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

  const handleToggleColumnVisibility = (columnId) => {
    setManagedColumns(prevCols =>
      prevCols.map(col =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col
      )
    );
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
            {Object.keys(columnFilters).length > 0 && (
              <StyledButton
                variant="link"
                onClick={clearAllColumnFilters}
                className={styles.clearAllFiltersButton}
              >
                Clear All Filters
              </StyledButton>
            )}
            {loadedSettings && (
              <StyledButton
                variant="link"
                onClick={resetTableSettings}
                className={styles.resetTableSettingsButton}
                title="Reset all table customizations (order, width, filters, etc.)"
              >
                Reset View
              </StyledButton>
            )}
            <StyledButton
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowColumnVisibilityMenu(prev => !prev)}
              title="Show/Hide Columns"
              className={styles.columnVisibilityButton}
            >
              <span className="material-symbols-outlined">view_column</span>
              Columns
            </StyledButton>
            {showColumnVisibilityMenu && (
              <div ref={columnVisibilityMenuRef} className={styles.columnVisibilityMenu}>
                <div className={styles.popoverTitle}>Show/Hide Columns</div>
                {managedColumns.map(col => (
                  <StyledFormCheck
                    key={col.id}
                    type="checkbox"
                    label={col.headerContent || col.id}
                    checked={col.isVisible}
                    onChange={() => handleToggleColumnVisibility(col.id)}
                    className={styles.visibilityMenuItem}
                  />
                ))}
              </div>
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
                        <span className="material-symbols-outlined">unfold_more</span>
                      ) : (
                        <span className="material-symbols-outlined">unfold_more</span>
                      )}
                    </span>
                  )}
                  {col.canFilter && (
                    <span
                      className={`${styles.filterIcon} ${columnFilters[col.id] ? styles.filterActive : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeFilterPopover === col.id) {
                          setActiveFilterPopover(null);
                        } else {
                          setCurrentPopoverFilterValue(columnFilters[col.id] || '');
                          setActiveFilterPopover(col.id);
                        }
                      }}
                    >
                      <span className="material-symbols-outlined">filter_list</span>
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
                {activeFilterPopover === col.id && (() => {
                  const columnBeingFiltered = managedColumns.find(c => c.id === activeFilterPopover);
                  return (
                    <div className={styles.filterPopover} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.popoverTitle}>
                        Filter: {columnBeingFiltered?.headerContent || 'Column'}
                      </div>
                      {columnBeingFiltered?.filterType === 'text' && (
                        <StyledFormControl
                          type="text"
                          value={currentPopoverFilterValue}
                          onChange={(e) => setCurrentPopoverFilterValue(e.target.value)}
                          placeholder={`Filter ${columnBeingFiltered?.headerContent || ''}...`}
                          size="sm"
                        />
                      )}
                      {columnBeingFiltered?.filterType === 'number' && (
                        <StyledFormControl
                          type="number"
                          value={currentPopoverFilterValue}
                          onChange={(e) => setCurrentPopoverFilterValue(e.target.value)}
                          placeholder={`Filter ${columnBeingFiltered?.headerContent || ''}...`}
                          size="sm"
                        />
                      )}
                      {columnBeingFiltered?.filterType === 'date' && (
                        <StyledFormControl
                          type="text" // Using text for broader input, actual date parsing can be complex
                          value={currentPopoverFilterValue}
                          onChange={(e) => setCurrentPopoverFilterValue(e.target.value)}
                          placeholder={`Filter ${columnBeingFiltered?.headerContent || ''} (e.g., YYYY-MM-DD)...`}
                          size="sm"
                        />
                      )}
                      <div className={styles.popoverFooter}>
                        <StyledButton size="sm" onClick={() => { handleColumnFilterChange(col.id, ''); setCurrentPopoverFilterValue(''); setActiveFilterPopover(null); }}>Clear</StyledButton>
                        <StyledButton size="sm" variant="primary" onClick={() => { handleColumnFilterChange(activeFilterPopover, currentPopoverFilterValue); setActiveFilterPopover(null); }}>Apply</StyledButton>
                      </div>
                    </div>
                  );
                })()}
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
