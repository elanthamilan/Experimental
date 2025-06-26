import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
// react-bootstrap components removed
import StyledButton from '../atoms/StyledButton';
import StyledFormSelect from '../atoms/StyledFormSelect';
import styles from './LeftSidebar.module.scss';
// useNavigate is not used, so removing it. If it was intended for a specific action, that action needs to be clear.
// import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App'; // Import ThemeContext

const LeftSidebar = () => {
  // const navigate = useNavigate(); // Not used
  const { currentUserRole, setCurrentUserRole, USER_ROLES, customLogoUrl } = useContext(ThemeContext);
  const [activeKey, setActiveKey] = useState('atoms'); // Default to atoms page
  const [searchTerm, setSearchTerm] = useState('');

  // State for collapsible Level 1 groups
  const [openGroups, setOpenGroups] = useState({
    designSystem: true, // Default new group to open
    settings: true,     // Default new group to open
  });
  // State for collapsible Level 2 submenus
  const [openSubmenus, setOpenSubmenus] = useState({}); // Track expanded L2 items by eventKey
  // State for collapsible Level 3 sub-submenus (Removed as unused)
  // const [openSubSubmenus, setOpenSubSubmenus] = useState({}); // Track expanded L3 items by eventKey

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const toggleSubmenu = (itemKey) => {
    setOpenSubmenus(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
    // Optionally collapse deeper levels when a parent is toggled?
  };

  // const toggleSubSubmenu = (itemKey) => { // Removed as unused
  //   setOpenSubSubmenus(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  // };

  // Using Material Symbols
  const Icon = ({ name, className = '' }) => <span className={`material-symbols-outlined ${className}`}>{name}</span>;

  // Grouping navigation items logically with paths - memoized
  const navGroups = useMemo(() => ({
    topLevel: [
      // No top-level items for now. Default route is to /design/atoms.
      // { eventKey: 'atoms', icon: 'home', label: 'Home (Atoms)', path: '/design/atoms' }, // Example if a "home" link is desired
    ],
    designSystem: {
      title: 'Design System',
      items: [
        { eventKey: 'atoms', icon: 'grain', label: 'Atoms', path: '/design/atoms' },
        { eventKey: 'molecules', icon: 'category', label: 'Molecules', path: '/design/molecules' },
        { eventKey: 'organisms', icon: 'view_quilt', label: 'Organisms', path: '/design/organisms' },
      ]
      // No roles needed for these pages currently
    },
    settings: {
      title: 'Application',
      items: [
        { eventKey: 'settings', icon: 'settings', label: 'Theme Settings', path: '/settings' },
      ]
      // No roles needed for settings page currently
    }
  }), [/* USER_ROLES */]); // USER_ROLES can be removed if not used by any nav items

  // Filter logic based on role and search term
  // Initialize openGroups based on all group keys from the new navGroups
  useEffect(() => {
    const initialOpenGroupsState = {};
    let changed = false;
    Object.keys(navGroups).forEach(key => {
      if (key !== 'topLevel') { // Process only grouped items
        if (openGroups[key] === undefined) { // If group not in current state
          initialOpenGroupsState[key] = true; // Default new groups to open
          changed = true;
        } else {
          initialOpenGroupsState[key] = openGroups[key]; // Keep existing state
        }
      }
    });
    if (changed) {
      // Ensure we only update if there's a structural need, not just re-affirming existing state
      // This check might be redundant if `changed` already covers it well.
      if (JSON.stringify(openGroups) !== JSON.stringify(initialOpenGroupsState)) {
         setOpenGroups(initialOpenGroupsState);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navGroups]); // Only run when navGroups definition changes


  const [filteredNavGroups, setFilteredNavGroups] = useState({ topLevel: [], grouped: [] });

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    // Filter topLevel items
    let newTopLevel = (navGroups.topLevel || []).filter(item =>
      item.label.toLowerCase().includes(lowerSearch)
      // Add role check if any topLevel items have roles: && (!item.roles || item.roles.includes(currentUserRole))
    );

    // Filter grouped items
    let newGrouped = Object.entries(navGroups)
      .filter(([key]) => key !== 'topLevel')
      .map(([groupKey, groupData]) => {
        // Add group-level role check if necessary: if (groupData.roles && !groupData.roles.includes(currentUserRole)) return null;

        const filteredItems = groupData.items.reduce((acc, item) => {
          // Add item-level role check if necessary: if (item.roles && !item.roles.includes(currentUserRole)) return acc;

          if (item.label.toLowerCase().includes(lowerSearch)) {
            acc.push(item);
          } else if (item.children) { // If item itself doesn't match, check children
            const filteredChildren = item.children.filter(child =>
              child.label.toLowerCase().includes(lowerSearch)
              // Add child-level role check: && (!child.roles || child.roles.includes(currentUserRole))
            );
            if (filteredChildren.length > 0) {
              acc.push({ ...item, children: filteredChildren });
            }
          }
          return acc;
        }, []);
        return filteredItems.length > 0 ? [groupKey, { ...groupData, items: filteredItems }] : null;
      })
      .filter(Boolean);

    setFilteredNavGroups({ topLevel: newTopLevel, grouped: newGrouped });

    // Auto-expand groups if searching and items are found
    if (searchTerm) {
      const allOpen = {};
      newGrouped.forEach(([key]) => allOpen[key] = true);
      setOpenGroups(prev => ({ ...prev, ...allOpen })); // Merge with previous to keep user's non-searched group states

      const openSubs = {};
      newGrouped.forEach(([, groupData]) => {
        groupData.items.forEach(item => {
          if (item.children && item.children.length > 0 &&
              (item.label.toLowerCase().includes(lowerSearch) || item.children.some(c => c.label.toLowerCase().includes(lowerSearch)))) {
            openSubs[item.eventKey] = true;
          }
        });
      });
      setOpenSubmenus(prev => ({ ...prev, ...openSubs }));
    }
  }, [currentUserRole, searchTerm, navGroups]); // currentUserRole might be removed if not used for filtering


  // Filter logic
  // const lowerSearchTerm = searchTerm.toLowerCase(); // Removed as searchTerm.toLowerCase() is used directly

  const { topLevel: topLevelItems, grouped: groupedItems } = filteredNavGroups;

  return (
    <div className={styles.sidebarContainer}>
      {/* Updated Header based on Softech example */}
      <div className={styles.sidebarHeader}>
        {customLogoUrl ? (
          <img src={customLogoUrl} alt="Custom Logo" className={styles.customLogo} />
        ) : (
          <div className={styles.brandContainer}> {/* Keep brandContainer if logo is not present */}
            <div className={styles.brandLogoPlaceholder}></div> {/* Placeholder for square logo */}
            <span className={styles.brandName}>School Name</span>
          </div>
        )}
         {/* Icon can be kept or removed based on design preference with new logo style */}
         {/* <Icon name="unfold_more" className={styles.brandExpandIcon} /> */}
      </div>

      {/* Search Functionality */}
      <div className={styles.sidebarSearchContainer}>
        <Icon name="search" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search navigation..."
          aria-label="Search navigation" // Added aria-label
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Role Selector Added Here */}
      <div className={styles.roleSelectorContainer}>
        <div className={styles.roleSelectorLabel} id="role-selector-label"> {/* Added id for aria-labelledby */}
          <Icon name="admin_panel_settings" className={styles.roleSelectorIcon} />
          <span>Current Role</span>
        </div>
        <StyledFormSelect
          value={currentUserRole}
          onChange={(e) => setCurrentUserRole(e.target.value)}
          aria-labelledby="role-selector-label" // Changed from aria-label to aria-labelledby
          className={styles.roleSelectorDropdown}
          size="sm"
        >
          <option value={USER_ROLES.ADMIN}>Admin</option>
          <option value={USER_ROLES.TEACHER}>Teacher</option>
          {/* Student option intentionally excluded */}
        </StyledFormSelect>
      </div>

      {/* Updated Nav section to UL */}
      <ul className={`flex-column ${styles.sidebarNav}`} > {/* Removed activeKey and onSelect, handled by Link components */}
        {/* Render top-level items first */}
        {topLevelItems.length === 0 && searchTerm ? (
          <li className={styles.noResults}>No top-level items found.</li>
        ) : topLevelItems.map(item => (
          <li key={item.eventKey} className={styles.navItem}>
            <Link
              to={item.path}
              className={`${styles.navLink} ${activeKey === item.eventKey ? styles.active : ''} d-flex align-items-center px-3 py-2`}
              onClick={() => setActiveKey(item.eventKey)}
              style={{ textDecoration: 'none' }}
            >
              <Icon name={item.icon} className={styles.navLinkIcon} /> <span className="ms-2">{item.label}</span>
            </Link>
          </li>
        ))}

        {groupedItems.length === 0 && searchTerm && topLevelItems.length > 0 ? (
          <li className={styles.noResults}>No grouped items found.</li>
        ) : groupedItems.length === 0 && searchTerm && topLevelItems.length === 0 ? (
          <li className={styles.noResults}>No navigation items found.</li>
        ) : (
          groupedItems.map(([groupKey, groupData]) => {
            const isGroupOpen = searchTerm ? true : openGroups[groupKey];
            const isGroupActivePath = !searchTerm && groupData.items.some(item =>
              activeKey === item.eventKey ||
              (item.children && item.children.some(child => activeKey === child.eventKey))
            );
            return (
              <li key={groupKey} className={styles.navGroupItem}> {/* Changed div to li */}
                <div
                  className={styles.groupHeader}
                  onClick={() => toggleGroup(groupKey)}
                  aria-controls={`collapse-${groupKey}`}
                  aria-expanded={isGroupOpen}
                >
                  {groupData.title} <Icon name={isGroupOpen ? 'expand_more' : 'chevron_right'} className={isGroupActivePath ? styles.activePathIcon : ''} />
                </div>
                <div
                  id={`collapse-${groupKey}`}
                  className={`${styles.collapsibleContent} ${isGroupOpen ? styles.isExpanded : ''} ${styles.groupItemsContainer}`}
                >
                  <ul className={styles.nestedList}> {/* Added UL for nested items */}
                    {groupData.items.map(item => {
                      const hasChildren = item.children && item.children.length > 0;
                      const isSubmenuOpen = searchTerm && hasChildren ? true : openSubmenus[item.eventKey];

                      if (item.path) {
                        return (
                          <li key={item.eventKey} className={`${styles.navItem} ${styles.level2Wrapper}`}>
                            <Link
                              to={item.path}
                              onClick={(e) => {
                                // Prevent navigation if it's meant to be a toggle for children, allow if no children or if search term exists
                                if (hasChildren && !searchTerm) {
                                   // e.preventDefault(); // This might be too aggressive if parent itself is clickable
                                }
                                setActiveKey(item.eventKey);
                                if (hasChildren) {
                                  toggleSubmenu(item.eventKey);
                                }
                              }}
                              className={`${styles.navLink} ${styles.level2Link} ${(!hasChildren && activeKey === item.eventKey) ? styles.active : ''} ${(!searchTerm && hasChildren && item.children && item.children.some(child => activeKey === child.eventKey)) ? styles.activePathParent : ''} d-flex justify-content-between align-items-center w-100`}
                              aria-controls={hasChildren ? `submenu-${item.eventKey}` : undefined}
                              aria-expanded={hasChildren ? isSubmenuOpen : undefined}
                              style={{ textDecoration: 'none' }}
                            >
                              <div className="d-flex align-items-center">
                                <Icon name={item.icon} className={styles.navLinkIcon} />
                                <span className={`${styles.linkLabel} ms-2`}>{item.label}</span>
                              </div>
                              {hasChildren && (
                                <Icon
                                  name={isSubmenuOpen ? 'expand_more' : 'chevron_right'}
                                  className={`${styles.expandIconSubmenu} ${!searchTerm && item.children.some(child => activeKey === child.eventKey) ? styles.activePathIcon : ''}`}
                                />
                              )}
                            </Link>
                            {hasChildren && (
                              <div
                                id={`submenu-${item.eventKey}`}
                                className={`${styles.collapsibleContent} ${isSubmenuOpen ? styles.isExpanded : ''} ${styles.level3Container}`}
                              >
                                <ul className={styles.nestedList}> {/* Added UL for L3 items */}
                                  {item.children.map(childItem => (
                                    <li key={childItem.eventKey} className={`${styles.navItem} ${styles.level3Wrapper}`}>
                                      <Link
                                        to={childItem.path}
                                        className={`${styles.navLink} ${activeKey === childItem.eventKey ? styles.active : ''} ${styles.level3Link} d-flex align-items-center w-100`}
                                        onClick={() => setActiveKey(childItem.eventKey)}
                                        style={{ textDecoration: 'none' }}
                                      >
                                        {childItem.icon && <Icon name={childItem.icon} className={styles.navLinkIcon} />}
                                        <span className={`${styles.linkLabel} ms-2`}>{childItem.label}</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        );
                      } else if (hasChildren) { // Purely a toggle (item.path is false)
                        return (
                          <li key={item.eventKey} className={`${styles.navItem} ${styles.level2Wrapper}`}>
                            <StyledButton // This is a toggle-only button
                              variant="link" // Ensure this variant looks like other nav links
                              onClick={() => toggleSubmenu(item.eventKey)}
                              className={`${styles.navButtonAsLink} ${styles.level2Link} ${(!searchTerm && item.children && item.children.some(child => activeKey === child.eventKey)) ? styles.activePathParent : ''} d-flex justify-content-between align-items-center w-100`}
                              aria-controls={`submenu-${item.eventKey}`}
                              aria-expanded={isSubmenuOpen}
                            >
                              <div className="d-flex align-items-center">
                                <Icon name={item.icon} className={styles.navLinkIcon} />
                                <span className={`${styles.linkLabel} ms-2`}>{item.label}</span>
                              </div>
                              <Icon
                                name={isSubmenuOpen ? 'expand_more' : 'chevron_right'}
                                className={styles.expandIconSubmenu}
                              />
                            </StyledButton>
                            <div
                              id={`submenu-${item.eventKey}`}
                              className={`${styles.collapsibleContent} ${isSubmenuOpen ? styles.isExpanded : ''} ${styles.level3Container}`}
                            >
                              <ul className={styles.nestedList}> {/* Added UL for L3 items */}
                                {item.children.map(childItem => (
                                  <li key={childItem.eventKey} className={`${styles.navItem} ${styles.level3Wrapper}`}>
                                    <Link
                                      to={childItem.path}
                                      className={`${styles.navLink} ${activeKey === childItem.eventKey ? styles.active : ''} ${styles.level3Link} d-flex align-items-center w-100`}
                                      onClick={() => setActiveKey(childItem.eventKey)}
                                      style={{ textDecoration: 'none' }}
                                    >
                                      {childItem.icon && <Icon name={childItem.icon} className={styles.navLinkIcon} />}
                                      <span className={`${styles.linkLabel} ms-2`}>{childItem.label}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        );
                      }
                      return null; // Fallback
                    })}
                  </ul>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default LeftSidebar;
