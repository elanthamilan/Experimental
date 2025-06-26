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
  const [activeKey, setActiveKey] = useState('dashboard'); // To track active link
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

  // Grouping navigation items logically with paths - memoized to prevent infinite re-renders
  const navGroups = useMemo(() => ({
    topLevel: [
      { eventKey: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/' },
      // UserProfilePage link removed from here if it existed
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
        },
        {
          eventKey: 'attendance',
          icon: 'rule_folder', // Using rule_folder as an example icon
          label: 'Attendance',
          path: '/academic/attendance', // Path matches the route set in App.js
          roles: [USER_ROLES.ADMIN, USER_ROLES.TEACHER] // Assuming Admin and Teacher can access
        },
        {
          eventKey: 'attendance_dashboard',
          icon: 'insights',
          label: 'Attendance Dashboard',
          path: '/academic/attendance-dashboard',
          roles: [USER_ROLES.ADMIN, USER_ROLES.TEACHER]
        },
      ]
    },
    administration: {
      title: 'Administration',
      items: [
         {
           eventKey: 'admissions_group',
           icon: 'confirmation_number',
           label: 'Admissions',
           // path attribute removed, making this a non-navigable group header
           roles: [USER_ROLES.ADMIN],
           children: [
             // { eventKey: 'admissions_dashboard', label: 'Admissions Overview', path: '/admissions', roles: [USER_ROLES.ADMIN] }, // Link to existing page - REMOVED
             { eventKey: 'app_form_fields', label: 'Form Fields Config', path: '/admin/admissions/formfields', roles: [USER_ROLES.ADMIN] },
             {
               eventKey: 'submitted_applications', // This child and its path are kept
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
         // { eventKey: 'reports', icon: 'analytics', label: 'Reports', path: '/reports', roles: [USER_ROLES.ADMIN] }, // Reports link removed
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
        // { eventKey: 'billing', icon: 'payments', label: 'Billing', path: '/billing', roles: [USER_ROLES.ADMIN, USER_ROLES.STUDENT] }, // Billing link removed
        {
          eventKey: 'financial_year_mgmt',
          icon: 'account_balance_wallet',
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
        { eventKey: 'manual', icon: 'library_books', label: 'User Manual', path: '/manual' }, // This will be removed by removing the whole group
      ]
    }
    // Help & Resources group will be removed entirely in a subsequent diff block
  }), [USER_ROLES]);

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
  }, [navGroups]);


  const [filteredNavGroups, setFilteredNavGroups] = useState({ topLevel: [], grouped: [] });

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const availableNavGroups = { ...navGroups };
    // Remove 'helpAndResources' group before filtering if it exists
    // This ensures it's completely gone from processing
    if (availableNavGroups.helpAndResources) {
      delete availableNavGroups.helpAndResources;
    }
    // Also remove if any topLevel item pointed to /profile
    const newTopLevelNav = availableNavGroups.topLevel ? availableNavGroups.topLevel.filter(item => item.path !== '/profile') : [];


    let newTopLevel = newTopLevelNav.filter(item =>
      (!item.roles || item.roles.includes(currentUserRole)) &&
      item.label.toLowerCase().includes(lowerSearch)
    );

    let newGrouped = Object.entries(availableNavGroups)
      .filter(([key]) => key !== 'topLevel' && key !== 'helpAndResources') // Explicitly filter out helpAndResources here too
      .map(([groupKey, groupData]) => {
        if (groupData.roles && !groupData.roles.includes(currentUserRole)) {
          return null;
        }
        const filteredItems = groupData.items.reduce((acc, item) => {
          if (item.roles && !item.roles.includes(currentUserRole)) {
            return acc;
          }
          // Remove specific paths if they are being deleted
          if (item.path === '/admissions' || item.path === '/billing' || item.path === '/reports') {
              // If item has children, keep the item but remove its path, making it a toggle only
              if (item.children && item.children.length > 0) {
                  const itemWithoutPath = { ...item };
                  delete itemWithoutPath.path;
                  // Now check if children or label match search
                  if (itemWithoutPath.label.toLowerCase().includes(lowerSearch)) {
                      acc.push(itemWithoutPath);
                  } else {
                      const filteredChildren = itemWithoutPath.children.filter(child =>
                          (!child.roles || child.roles.includes(currentUserRole)) &&
                          child.label.toLowerCase().includes(lowerSearch)
                      );
                      if (filteredChildren.length > 0) {
                          acc.push({ ...itemWithoutPath, children: filteredChildren });
                      }
                  }
                  return acc;
              }
              return acc; // If no children, remove the item entirely
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

    if (searchTerm) {
      const allOpen = {};
      newGrouped.forEach(([key]) => allOpen[key] = true);
      setOpenGroups(prev => ({ ...prev, ...allOpen }));
      const openSubs = {};
      newGrouped.forEach(([, groupData]) => {
        groupData.items.forEach(item => {
          if (item.children && item.children.length > 0) {
            openSubs[item.eventKey] = true;
          }
        });
      });
      setOpenSubmenus(prev => ({ ...prev, ...openSubs }));
    }

  }, [currentUserRole, searchTerm, navGroups]);


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
