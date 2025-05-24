import React, { useState, useEffect } from 'react';
import { Nav, Collapse } from 'react-bootstrap';
import StyledButton from './atoms/StyledButton';
import styles from './LeftSidebar.module.scss';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Assuming USER_ROLES is exported via useTheme or directly

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { currentUserRole, USER_ROLES } = useTheme(); // Get role and USER_ROLES from context
  const [activeKey, setActiveKey] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // State for collapsible Level 1 groups
  const [openGroups, setOpenGroups] = useState({
    academics: true, // Example: Keep academics open by default
    administration: false,
    finance: false,
    facilities: false,
    studentServices: false,
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

  // Grouping navigation items logically with paths
  const navGroups = {
    topLevel: [
      { eventKey: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
      { eventKey: 'profile', icon: 'account_circle', label: 'User Profile', path: '/profile' },
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
        { eventKey: 'assignment_student', icon: 'assignment', label: 'My Assignments', path: '/assignments', roles: [USER_ROLES.STUDENT] },
        { eventKey: 'assignment_teacher', icon: 'assignment_turned_in', label: 'Manage Assignments', path: '/assignments/manage', roles: [USER_ROLES.TEACHER] },
      ]
    },
    administration: {
      title: 'Administration',
      items: [
         { eventKey: 'admissions', icon: 'confirmation_number', label: 'Admissions', path: '/admissions', roles: [USER_ROLES.ADMIN] },
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
      ]
    },
     finance: {
      title: 'Finance',
      items: [
        { eventKey: 'billing', icon: 'payments', label: 'Billing', path: '/billing', roles: [USER_ROLES.ADMIN, USER_ROLES.STUDENT] }, // Admin manages, Student views own
      ]
    },
    // Removed facilities and studentServices for brevity in example, can be added back similarly
  };

  // Filter logic based on role and search term
  // Initialize openGroups based on all group keys to ensure new groups are considered
  useEffect(() => {
    const initialOpenGroups = {};
    Object.keys(navGroups).forEach(key => {
      if (key !== 'topLevel') {
        // Default new groups to false, keep existing or default 'academics' to true
        initialOpenGroups[key] = openGroups[key] === undefined ? (key === 'academics') : openGroups[key];
      }
    });
    // Only set if there's a change to avoid potential loop with navGroups dependency
    if (JSON.stringify(openGroups) !== JSON.stringify(initialOpenGroups)) {
      setOpenGroups(initialOpenGroups);
    }
  }, []); // Run once on mount to initialize openGroups for potentially new groups


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

  const handleNavClick = (path, eventKey, isLeaf) => {
    if (isLeaf && path) {
      navigate(path);
      setActiveKey(eventKey);
    }
  };


  // Filter logic
  const lowerSearchTerm = searchTerm.toLowerCase();

  // No longer need to re-declare topLevelItems and groupedItems here, use from state
  const { topLevel: topLevelItems, grouped: groupedItems } = filteredNavGroups;

  return (
    <div className={styles.sidebarContainer}>
      {/* Updated Header based on Softech example */}
      <div className={styles.sidebarHeader}>
         {/* TODO: Replace with actual logo and brand name */}
         <div className={styles.brandContainer}>
            <div className={styles.brandLogoPlaceholder}></div> {/* Placeholder for square logo */}
            <span className={styles.brandName}>School Name</span>
            {/* Subtitle removed as per request for cleaner look with full-width logo */}
         </div>
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

      {/* Updated Nav section */}
      <Nav className={`flex-column ${styles.sidebarNav}`} activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        {/* Render top-level items first */}
        {topLevelItems.length === 0 && searchTerm ? (
          <div className={styles.noResults}>No top-level items found.</div>
        ) : topLevelItems.map(item => (
          <StyledButton
            key={item.eventKey}
            variant="link"
            active={activeKey === item.eventKey}
            onClick={() => handleNavClick(item.path, item.eventKey, true)}
            className={`${styles.navLink} ${activeKey === item.eventKey ? styles.active : ''}`}
          >
            <Icon name={item.icon} className={styles.navLinkIcon} /> {item.label}
          </StyledButton>
        ))}

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

                    return (
                      <div key={item.eventKey} className={styles.level2Wrapper}>
                        <StyledButton
                          variant="link"
                          onClick={() => {
                            if (hasChildren) {
                              toggleSubmenu(item.eventKey);
                            } else {
                              handleNavClick(item.path, item.eventKey, true);
                            }
                          }}
                          active={!hasChildren && activeKey === item.eventKey}
                          className={`${styles.navLink} ${styles.level2Link} ${(!hasChildren && activeKey === item.eventKey) ? styles.active : ''} ${(!searchTerm && hasChildren && item.children.some(child => activeKey === child.eventKey)) ? styles.activePathParent : ''}`}
                          aria-controls={hasChildren ? `submenu-${item.eventKey}` : undefined}
                          aria-expanded={hasChildren ? isSubmenuOpen : undefined}
                          tabIndex={0}
                        >
                          <Icon name={item.icon} className={styles.navLinkIcon} />
                          <span className={styles.linkLabel}>{item.label}</span>
                          {hasChildren && (
                            <Icon
                              name={isSubmenuOpen ? 'expand_more' : 'chevron_right'}
                              className={`${styles.expandIconSubmenu} ${!searchTerm && item.children.some(child => activeKey === child.eventKey) ? styles.activePathIcon : ''}`}
                            />
                          )}
                        </StyledButton>

                        {hasChildren && (
                          <Collapse in={isSubmenuOpen}>
                            <div id={`submenu-${item.eventKey}`} className={styles.level3Container}>
                              {item.children.map(childItem => (
                                <div key={childItem.eventKey} className={styles.level3Wrapper}>
                                  <StyledButton
                                    variant="link"
                                    active={activeKey === childItem.eventKey}
                                    onClick={() => handleNavClick(childItem.path, childItem.eventKey, true)}
                                    className={`${styles.navLink} ${activeKey === childItem.eventKey ? styles.active : ''} ${styles.level3Link}`}
                                  >
                                    {childItem.icon && <Icon name={childItem.icon} className={styles.navLinkIcon} />}
                                    <span className={styles.linkLabel}>{childItem.label}</span>
                                  </StyledButton>
                                </div>
                              ))}
                            </div>
                          </Collapse>
                        )}
                      </div>
                    );
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
