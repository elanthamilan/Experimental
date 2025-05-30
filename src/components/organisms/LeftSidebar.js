import React, { useState, useEffect, useMemo, useContext } from 'react'; // Added useContext
import { Link } from 'react-router-dom';
import { Nav, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap'; // Added OverlayTrigger, Tooltip
import StyledButton from '../atoms/StyledButton';
import StyledFormSelect from '../atoms/StyledFormSelect'; // Added StyledFormSelect
import styles from './LeftSidebar.module.scss';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App'; // Import ThemeContext

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { currentUserRole, setCurrentUserRole, USER_ROLES, customLogoUrl } = useContext(ThemeContext); // Consume customLogoUrl
  const [activeKey, setActiveKey] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // State for collapsible Level 1 groups
  const [openGroups, setOpenGroups] = useState({
    academics: true, // Example: Keep academics open by default
    administration: false,
    finance: false,
    facilities: false,
    studentServices: false,
    helpAndResources: false, // Add new group here, default to closed
  });
  // State for collapsible Level 2 submenus
  const [openSubmenus, setOpenSubmenus] = useState({}); // Track expanded L2 items by eventKey
  // State for collapsible Level 3 sub-submenus
  const [openSubSubmenus, setOpenSubSubmenus] = useState({}); // Track expanded L3 items by eventKey

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const toggleSubmenu = (itemKey) => {
    setOpenSubmenus(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
    // Optionally collapse deeper levels when a parent is toggled?
  };

  const toggleSubSubmenu = (itemKey) => {
    setOpenSubSubmenus(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  // Using Material Symbols
  const Icon = ({ name, className = '' }) => <span className={`material-symbols-outlined ${className}`}>{name}</span>;

  // Grouping navigation items logically with paths - memoized to prevent infinite re-renders
  const navGroups = useMemo(() => ({
    topLevel: [
      { eventKey: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    ],
    academics: {
      title: 'Academics',
      items: [
        {
          eventKey: 'courses', icon: 'menu_book', label: 'Courses', path: '/courses',
          // Assuming courses list is viewable by all, but management is admin/teacher
          children: [
            { eventKey: 'course_list', label: 'Course List', path: '/courses' }, // All users
            { eventKey: 'add_course', label: 'Add New Course', path: '/courses/new', roles: [USER_ROLES.ADMIN, USER_ROLES.TEACHER] }
          ]
        },
        {
          eventKey: 'program_mgmt',
          icon: 'article',
          label: 'Programs',
          path: '/admin/programs',
          roles: [USER_ROLES.ADMIN]
        },
        {
          eventKey: 'semester_mgmt',
          icon: 'date_range',
          label: 'Semesters',
          path: '/admin/semesters',
          roles: [USER_ROLES.ADMIN]
        },
        {
          eventKey: 'gradebook', icon: 'assessment', label: 'Gradebook', path: '/grades',
          roles: [USER_ROLES.TEACHER, USER_ROLES.STUDENT] // Teachers manage, Students view their own
        },
        // { eventKey: 'assignment_student', icon: 'assignment', label: 'My Assignments', path: '/assignments', roles: [USER_ROLES.STUDENT] }, // Removed
        // { eventKey: 'assignment_teacher', icon: 'assignment_turned_in', label: 'Manage Assignments', path: '/assignments/manage', roles: [USER_ROLES.TEACHER] }, // Removed
        {
          eventKey: 'exam_schedules',
          icon: 'event_note', // Example icon
          label: 'Exam Schedules',
          path: '/academic/examschedules',
          roles: [USER_ROLES.ADMIN, USER_ROLES.TEACHER]
        }
      ]
    },
    administration: {
      title: 'Administration',
      items: [
         {
           eventKey: 'admissions_group', // New eventKey for parent
           icon: 'confirmation_number',
           label: 'Admissions',
           // path: '/admissions', // Optional: parent can still link to main admissions page
           roles: [USER_ROLES.ADMIN],
           children: [
             { eventKey: 'admissions_dashboard', label: 'Admissions Overview', path: '/admissions', roles: [USER_ROLES.ADMIN] }, // Link to existing page
             { eventKey: 'app_form_fields', label: 'Form Fields Config', path: '/admin/admissions/formfields', roles: [USER_ROLES.ADMIN] },
             {
               eventKey: 'submitted_applications',
               label: 'Submitted Applications',
               path: '/admissions/applications',
               roles: [USER_ROLES.ADMIN]
             }
           ]
         },
         {
           eventKey: 'students', icon: 'school', label: 'Students', path: '/students', roles: [USER_ROLES.ADMIN],
           children: [
             { eventKey: 'student_list', label: 'Student List', path: '/students', roles: [USER_ROLES.ADMIN]},
             { eventKey: 'add_student', label: 'Add New Student', path: '/students/new', roles: [USER_ROLES.ADMIN]}
           ]
         },
         {
           eventKey: 'staff', icon: 'groups', label: 'Staff', path: '/staff', roles: [USER_ROLES.ADMIN],
           children: [
             { eventKey: 'staff_list', label: 'Staff List', path: '/staff', roles: [USER_ROLES.ADMIN]},
             { eventKey: 'add_staff', label: 'Add New Staff', path: '/staff/new', roles: [USER_ROLES.ADMIN]}
           ]
         },
         {
           eventKey: 'faculty_mgmt',
           icon: 'supervisor_account',
           label: 'Faculty',
           path: '/admin/faculty',
           roles: [USER_ROLES.ADMIN]
         },
         { eventKey: 'reports', icon: 'analytics', label: 'Reports', path: '/reports', roles: [USER_ROLES.ADMIN] },
         {
           eventKey: 'department_mgmt',
           icon: 'corporate_fare', // Example icon
           label: 'Departments',
           path: '/admin/masterdata/departments',
           roles: [USER_ROLES.ADMIN] // Assuming Admin role
         },
         {
           eventKey: 'org_hierarchy',
           icon: 'account_tree', // Example icon
           label: 'Org Hierarchy',
           path: '/admin/organisation/hierarchy',
           roles: [USER_ROLES.ADMIN]
         },
         {
           eventKey: 'component_preview',
           icon: 'science',
           label: 'Component Preview',
           path: '/component-preview',
           roles: [USER_ROLES.ADMIN]
         }, // Added Component Preview link
         {
          eventKey: 'sub_institution_mgmt',
          icon: 'domain_add', 
          label: 'Sub-Institutions',
          path: '/admin/sub-institutions', 
          roles: [USER_ROLES.ADMIN]
        }
      ]
    },
     finance: {
      title: 'Finance',
      items: [
        { eventKey: 'billing', icon: 'payments', label: 'Billing', path: '/billing', roles: [USER_ROLES.ADMIN, USER_ROLES.STUDENT] }, // Admin manages, Student views own
        {
          eventKey: 'financial_year_mgmt',
          icon: 'account_balance_wallet', // Example icon
          label: 'Financial Years',
          path: '/admin/financialyears',
          roles: [USER_ROLES.ADMIN]
        }
      ]
    },
    // Removed facilities and studentServices for brevity in example, can be added back similarly
    helpAndResources: { // Added Help & Resources group
      title: 'Help & Resources',
      items: [
        { eventKey: 'feedback', icon: 'feedback', label: 'Feedback', path: '/feedback' },
        { eventKey: 'tutorial', icon: 'integration_instructions', label: 'Tutorial', path: '/tutorial' },
        { eventKey: 'manual', icon: 'library_books', label: 'User Manual', path: '/manual' },
      ]
    }
  }), [USER_ROLES]); // Only recreate when USER_ROLES changes

  // Filter logic based on role and search term
  // Initialize openGroups based on all group keys to ensure new groups are considered
  useEffect(() => {
    const initialOpenGroupsState = { ...openGroups }; // Start with current open groups
    let changed = false;
    Object.keys(navGroups).forEach(key => {
      if (key !== 'topLevel' && initialOpenGroupsState[key] === undefined) {
        // Default new groups to false, keep existing or default 'academics' to true
        initialOpenGroupsState[key] = (key === 'academics'); // Default academics to open, others to closed
        changed = true;
      }
    });
    if (changed) {
      setOpenGroups(initialOpenGroupsState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navGroups]); // Rerun if navGroups structure changes (e.g. new group added)
  // Removed openGroups from dependency array to prevent loop, as we are setting it here.
  // This hook's purpose is to initialize open state for *newly added* groups.


  const [filteredNavGroups, setFilteredNavGroups] = useState({ topLevel: [], grouped: [] });

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    let newTopLevel = navGroups.topLevel.filter(item =>
      (!item.roles || item.roles.includes(currentUserRole)) &&
      item.label.toLowerCase().includes(lowerSearch)
    );

    let newGrouped = Object.entries(navGroups)
      .filter(([key]) => key !== 'topLevel')
      .map(([groupKey, groupData]) => {
        if (groupData.roles && !groupData.roles.includes(currentUserRole)) {
          return null; // Filter out group if role doesn't match
        }
        const filteredItems = groupData.items.reduce((acc, item) => {
          if (item.roles && !item.roles.includes(currentUserRole)) {
            return acc; // Filter out item if role doesn't match
          }
          if (item.label.toLowerCase().includes(lowerSearch)) {
            acc.push(item);
          } else if (item.children) {
            const filteredChildren = item.children.filter(child =>
              (!child.roles || child.roles.includes(currentUserRole)) &&
              child.label.toLowerCase().includes(lowerSearch)
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

    // Auto-expand groups when searching
    if (searchTerm) {
      const allOpen = {};
      newGrouped.forEach(([key]) => allOpen[key] = true);
      setOpenGroups(prev => ({ ...prev, ...allOpen }));
      // Auto-expand submenus with children if they contain search results
      const openSubs = {};
      newGrouped.forEach(([, groupData]) => {
        groupData.items.forEach(item => {
          if (item.children && item.children.length > 0) { // Check if item has children after filtering
            openSubs[item.eventKey] = true;
          }
        });
      });
      setOpenSubmenus(prev => ({ ...prev, ...openSubs }));
    }

  }, [currentUserRole, searchTerm, navGroups]); // Rerun on role or search term change


  // Filter logic
  const lowerSearchTerm = searchTerm.toLowerCase();

  // No longer need to re-declare topLevelItems and groupedItems here, use from state
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
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Role Selector Added Here */}
      <div className={styles.roleSelectorContainer}>
        <div className={styles.roleSelectorLabel}>
          <Icon name="admin_panel_settings" className={styles.roleSelectorIcon} />
          <span>Current Role</span>
        </div>
        <StyledFormSelect
          value={currentUserRole}
          onChange={(e) => setCurrentUserRole(e.target.value)}
          aria-label="Select User Role"
          className={styles.roleSelectorDropdown}
          size="sm"
        >
          <option value={USER_ROLES.ADMIN}>Admin</option>
          <option value={USER_ROLES.TEACHER}>Teacher</option>
          {/* Student option intentionally excluded */}
        </StyledFormSelect>
      </div>

      {/* Updated Nav section */}
      <Nav className={`flex-column ${styles.sidebarNav}`} activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        {/* Render top-level items first */}
        {topLevelItems.length === 0 && searchTerm ? (
          <div className={styles.noResults}>No top-level items found.</div>
        ) : topLevelItems.map(item => {
      if (item.eventKey === 'dashboard') { // Specifically target the dashboard link
        return (
          <Link
            to={item.path} // Should be '/dashboard'
            key={item.eventKey}
            className={`${styles.navLink} ${activeKey === item.eventKey ? styles.active : ''} d-flex align-items-center px-3 py-2`} // Basic styling, you might need to adjust
            onClick={() => setActiveKey(item.eventKey)} // Keep active state update
            style={{ textDecoration: 'none' }}
          >
            <Icon name={item.icon} className={styles.navLinkIcon} /> <span className="ms-2">{item.label}</span>
          </Link>
        );
      }
      // For other top-level items, use the existing StyledButton
      // Convert other top-level items (e.g., User Profile)
      if (item.path) { // Ensure it's a navigation item
         return (
           <Link
             to={item.path}
             key={item.eventKey}
             className={`${styles.navLink} ${activeKey === item.eventKey ? styles.active : ''} d-flex align-items-center px-3 py-2`}
             onClick={() => setActiveKey(item.eventKey)}
             style={{ textDecoration: 'none' }}
           >
             <Icon name={item.icon} className={styles.navLinkIcon} /> <span className="ms-2">{item.label}</span>
           </Link>
         );
      }
      // Fallback or non-navigational items (if any)
      return null;
    })}

        {groupedItems.length === 0 && searchTerm && topLevelItems.length > 0 ? (
          <div className={styles.noResults}>No grouped items found.</div>
        ) : groupedItems.length === 0 && searchTerm && topLevelItems.length === 0 ? (
           <div className={styles.noResults}>No navigation items found.</div>
        ) : (
          groupedItems.map(([groupKey, groupData]) => (
            <div key={groupKey} className={styles.navGroup}>
              {(() => {
                const isGroupActivePath = !searchTerm && groupData.items.some(item =>
                  activeKey === item.eventKey ||
                  (item.children && item.children.some(child => activeKey === child.eventKey))
                );
                return (
                  <div className={styles.groupHeader} onClick={() => toggleGroup(groupKey)} aria-controls={`collapse-${groupKey}`} aria-expanded={searchTerm ? true : openGroups[groupKey]}>
                    {groupData.title} <Icon name={(searchTerm ? true : openGroups[groupKey]) ? 'expand_more' : 'chevron_right'} className={isGroupActivePath ? styles.activePathIcon : ''} />
                  </div>
                );
              })()}
              <Collapse in={searchTerm ? true : openGroups[groupKey]}>
                <div id={`collapse-${groupKey}`} className={styles.groupItemsContainer}>
                  {groupData.items.map(item => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isSubmenuOpen = searchTerm && hasChildren ? true : openSubmenus[item.eventKey];

                    // Refactored Level 2 items based on detailed instructions
                    if (item.path) { // If it's meant to be a link
                      return (
                        <div key={item.eventKey} className={styles.level2Wrapper}>
                          <Link
                            to={item.path}
                            key={item.eventKey}
                            onClick={() => {
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
                            <Collapse in={isSubmenuOpen}>
                              <div id={`submenu-${item.eventKey}`} className={styles.level3Container}>
                                {/* Refactored Level 3 items */}
                                {item.children.map(childItem => {
                                  if (childItem.path) { // Ensure it's a navigational item
                                    return (
                                      <div key={childItem.eventKey} className={styles.level3Wrapper}>
                                        <Link
                                          to={childItem.path}
                                          key={childItem.eventKey}
                                          className={`${styles.navLink} ${activeKey === childItem.eventKey ? styles.active : ''} ${styles.level3Link} d-flex align-items-center w-100`}
                                          onClick={() => setActiveKey(childItem.eventKey)}
                                          style={{ textDecoration: 'none' }}
                                        >
                                          {childItem.icon && <Icon name={childItem.icon} className={styles.navLinkIcon} />}
                                          <span className={`${styles.linkLabel} ms-2`}>{childItem.label}</span>
                                        </Link>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </Collapse>
                          )}
                        </div>
                      );
                    } else if (hasChildren) { // Purely a toggle, not a link itself (item.path is false)
                        return (
                          <div key={item.eventKey} className={styles.level2Wrapper}>
                            <StyledButton // This is a toggle-only button
                              variant="link"
                              onClick={() => toggleSubmenu(item.eventKey)}
                              className={`${styles.navButton} ${styles.level2Link} ${(!searchTerm && item.children && item.children.some(child => activeKey === child.eventKey)) ? styles.activePathParent : ''} d-flex justify-content-between align-items-center w-100`}
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
                            <Collapse in={isSubmenuOpen}>
                              <div id={`submenu-${item.eventKey}`} className={styles.level3Container}>
                                {/* Level 3 items under a toggle-only parent */}
                                {item.children.map(childItem => { // These children should still be Links
                                  if (childItem.path) {
                                    return (
                                      <div key={childItem.eventKey} className={styles.level3Wrapper}>
                                        <Link
                                          to={childItem.path}
                                          key={childItem.eventKey}
                                          className={`${styles.navLink} ${activeKey === childItem.eventKey ? styles.active : ''} ${styles.level3Link} d-flex align-items-center w-100`}
                                          onClick={() => setActiveKey(childItem.eventKey)}
                                          style={{ textDecoration: 'none' }}
                                        >
                                          {childItem.icon && <Icon name={childItem.icon} className={styles.navLinkIcon} />}
                                          <span className={`${styles.linkLabel} ms-2`}>{childItem.label}</span>
                                        </Link>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </Collapse>
                          </div>
                        );
                    }
                    // Fallback for items that don't fit above criteria (e.g. no path, no children)
                    return null;
                  })}
                </div>
              </Collapse>
            </div>
        )))}
      </Nav>
    </div>
  );
};

export default LeftSidebar;
