import React, { useState } from 'react';
import { Nav, Collapse } from 'react-bootstrap'; // Removed unused InputGroup
// import StyledFormControl from './atoms/StyledFormControl'; // Removed unused atom
import StyledButton from './atoms/StyledButton'; // Import atom
import styles from './LeftSidebar.module.scss';

const LeftSidebar = () => {
  const [activeKey, setActiveKey] = useState('dashboard'); // Default active item
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

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

  // Grouping navigation items logically
  const navGroups = {
    // Top Level Items (if any, like Home, Dashboard)
    topLevel: [
      { eventKey: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
      // Add Home, Favorites, Notifications if they belong here based on original design
      // { eventKey: 'home', icon: 'home', label: 'Home' },
      // { eventKey: 'favorites', icon: 'favorite', label: 'Favorites' },
      // { eventKey: 'notifications', icon: 'notifications', label: 'Notifications' },
    ],
    // Grouped Items
    academics: {
      title: 'Academics',
      items: [
        { eventKey: 'academic_plan', icon: 'schedule', label: 'Academic Plan', children: [{eventKey: 'ap_1', label: 'View Plans'}, {eventKey: 'ap_2', label: 'Create Plan'}] },
        { eventKey: 'assignment', icon: 'assignment', label: 'Assignment', children: [{eventKey: 'as_1', label: 'View Assignments'}, {eventKey: 'as_2', label: 'Submit Assignment'}] },
        { eventKey: 'exam_mgmt', icon: 'person_check', label: 'Exam Mgmt.', children: [{eventKey: 'em_1', label: 'Schedule Exam'}, {eventKey: 'em_2', label: 'View Results'}] },
        {
          eventKey: 'assessment', icon: 'quiz', label: 'Assessment', children: [ 
            { eventKey: 'assessment_list', label: 'List' }, 
            { eventKey: 'assessment_types', label: 'Types' },
            { eventKey: 'assessment_grades', label: 'Grades' } 
          ]
        },
        { eventKey: 'obe', icon: 'menu_book', label: 'OBE', children: [{eventKey: 'obe_1', label: 'Dashboard'}, {eventKey: 'obe_2', label: 'Reports'}] },
        { eventKey: 'rubrics', icon: 'grid_view', label: 'Rubrics', children: [{eventKey: 'rb_1', label: 'Manage Rubrics'}, {eventKey: 'rb_2', label: 'Templates'}] },
        { eventKey: 'accreditation', icon: 'flag', label: 'Accreditation', children: [{eventKey: 'ac_1', label: 'Status'}, {eventKey: 'ac_2', label: 'Documents'}] },
        { eventKey: 'leap', icon: 'rocket_launch', label: 'LEAP', children: [{eventKey: 'lp_1', label: 'My LEAP'}, {eventKey: 'lp_2', label: 'Programs'}] },
      ]
    },
    administration: {
      title: 'Administration',
      items: [
         { eventKey: 'enterprise', icon: 'domain', label: 'Enterprise', children: [{eventKey: 'en_1', label: 'Settings'}, {eventKey: 'en_2', label: 'Branches'}] },
         { eventKey: 'admissions', icon: 'confirmation_number', label: 'Admissions', children: [{eventKey: 'adm_1', label: 'Applications'}, {eventKey: 'adm_2', label: 'Process'}] },
         { eventKey: 'students', icon: 'school', label: 'Students', children: [{eventKey: 'std_1', label: 'View All'}, {eventKey: 'std_2', label: 'Add Student'}] },
         { eventKey: 'staff', icon: 'groups', label: 'Staff', children: [{eventKey: 'stf_1', label: 'View All'}, {eventKey: 'stf_2', label: 'Add Staff'}] },
         { eventKey: 'security_group', icon: 'security', label: 'Security Group', children: [{eventKey: 'sg_1', label: 'Manage Roles'}, {eventKey: 'sg_2', label: 'Permissions'}] },
         { eventKey: 'leave_mgmt', icon: 'person_alert', label: 'Leave Mgmt.', children: [{eventKey: 'lm_1', label: 'Apply Leave'}, {eventKey: 'lm_2', label: 'Approve Leave'}] },
         { eventKey: 'log_book', icon: 'book', label: 'Log Book', children: [{eventKey: 'lb_1', label: 'View Logs'}, {eventKey: 'lb_2', label: 'Entry'}] },
         { eventKey: 'visitor_mgmt', icon: 'badge', label: 'Visitor Mgmt.', children: [{eventKey: 'vm_1', label: 'Check-in'}, {eventKey: 'vm_2', label: 'History'}] },
         { eventKey: 'communication', icon: 'hub', label: 'Communication', children: [{eventKey: 'cm_1', label: 'Notices'}, {eventKey: 'cm_2', label: 'Messages'}] },
         { eventKey: 'enquiry', icon: 'support_agent', label: 'Enquiry', children: [{eventKey: 'eq_1', label: 'View Enquiries'}, {eventKey: 'eq_2', label: 'New Enquiry'}] },
         { eventKey: 'reports', icon: 'analytics', label: 'Reports', children: [{eventKey: 'rp_1', label: 'Generate'}, {eventKey: 'rp_2', label: 'View Saved'}] },
         { eventKey: 'system', icon: 'lan', label: 'System', children: [{eventKey: 'sys_1', label: 'Settings'}, {eventKey: 'sys_2', label: 'Backup'}] },
         { eventKey: 'migration', icon: 'transfer_within_a_station', label: 'Migration', children: [{eventKey: 'mg_1', label: 'Import'}, {eventKey: 'mg_2', label: 'Export'}] },
      ]
    },
     finance: {
      title: 'Finance',
      items: [
        { eventKey: 'billing', icon: 'payments', label: 'Billing', children: [{eventKey: 'bl_1', label: 'Invoices'}, {eventKey: 'bl_2', label: 'Statements'}] },
        { eventKey: 'payments', icon: 'credit_card', label: 'Payments', children: [{eventKey: 'py_1', label: 'Record Payment'}, {eventKey: 'py_2', label: 'History'}] },
        { eventKey: 'scholarship', icon: 'workspace_premium', label: 'Scholarship', children: [{eventKey: 'sc_1', label: 'Manage'}, {eventKey: 'sc_2', label: 'Applications'}] },
        { eventKey: 'voluntary_deposits', icon: 'savings', label: 'Voluntary Deposits', children: [{eventKey: 'vd_1', label: 'View'}, {eventKey: 'vd_2', label: 'New Deposit'}] },
      ]
    },
     facilities: {
       title: 'Facilities',
       items: [
         { eventKey: 'cafeteria', icon: 'restaurant', label: 'Cafeteria', children: [{eventKey: 'cf_1', label: 'Menu'}, {eventKey: 'cf_2', label: 'Orders'}] },
         { eventKey: 'assets', icon: 'database', label: 'Assets', children: [{eventKey: 'as_f_1', label: 'View Assets'}, {eventKey: 'as_f_2', label: 'Manage'}] },
         { eventKey: 'transportation', icon: 'directions_bus', label: 'Transportation', children: [{eventKey: 'tr_1', label: 'Routes'}, {eventKey: 'tr_2', label: 'Vehicles'}] },
         { eventKey: 'room_mgmt', icon: 'meeting_room', label: 'Room Mgmt.', children: [{eventKey: 'rm_1', label: 'Bookings'}, {eventKey: 'rm_2', label: 'Availability'}] },
         { eventKey: 'library', icon: 'local_library', label: 'Library', children: [{eventKey: 'lb_lib_1', label: 'Search Books'}, {eventKey: 'lb_lib_2', label: 'Issue/Return'}] },
         { eventKey: 'courier_system', icon: 'local_shipping', label: 'Courier System', children: [{eventKey: 'cs_1', label: 'Track'}, {eventKey: 'cs_2', label: 'Dispatch'}] },
       ]
     },
     studentServices: {
       title: 'Student Services',
       items: [
          { eventKey: 'project', icon: 'integration_instructions', label: 'Project', children: [{eventKey: 'prj_1', label: 'My Projects'}, {eventKey: 'prj_2', label: 'Submit'}] },
          { eventKey: 'placement', icon: 'work', label: 'Placement', children: [{eventKey: 'plc_1', label: 'Companies'}, {eventKey: 'plc_2', label: 'Applications'}] },
          { eventKey: 'services', icon: 'construction', label: 'Services', children: [{eventKey: 'srv_1', label: 'Request Service'}, {eventKey: 'srv_2', label: 'Status'}] },
          { eventKey: 'engage', icon: 'spatial_tracking', label: 'Engage', children: [{eventKey: 'eng_1', label: 'Events'}, {eventKey: 'eng_2', label: 'Clubs'}] },
          { eventKey: 'gate_pass', icon: 'door_back', label: 'Gate Pass', children: [{eventKey: 'gp_1', label: 'Apply'}, {eventKey: 'gp_2', label: 'History'}] },
          { eventKey: 'clearance', icon: 'do_not_disturb_on', label: 'Clearance', children: [{eventKey: 'clr_1', label: 'Status'}, {eventKey: 'clr_2', label: 'Apply'}] },
       ]
     }
  };

  // Filter logic
  let topLevelItems = navGroups.topLevel || [];
  let groupedItems = Object.entries(navGroups).filter(([key]) => key !== 'topLevel');

  // Filter logic
  const lowerSearchTerm = searchTerm.toLowerCase();

  if (lowerSearchTerm) {
    topLevelItems = topLevelItems.filter(item => 
      item.label.toLowerCase().includes(lowerSearchTerm)
    );

    groupedItems = groupedItems.map(([groupKey, groupData]) => {
      const filteredItems = groupData.items.reduce((acc, item) => {
        if (item.label.toLowerCase().includes(lowerSearchTerm)) {
          acc.push(item); // Keep item if it matches
        } else if (item.children) {
          // If item itself doesn't match, check its children
          const filteredChildren = item.children.filter(child => 
            child.label.toLowerCase().includes(lowerSearchTerm)
          );
          if (filteredChildren.length > 0) {
            // If children match, include the parent item with only matched children
            acc.push({ ...item, children: filteredChildren });
          }
        }
        return acc;
      }, []);
      
      // If after filtering, the group has items, return it, otherwise filter out the group
      return filteredItems.length > 0 ? [groupKey, { ...groupData, items: filteredItems }] : null;
    }).filter(Boolean); // Remove null entries (groups with no matching items)

    // Optionally, expand all groups when searching
    // This is a simple approach; more sophisticated would be to expand only groups with matches
    if (searchTerm && !Object.values(openGroups).every(Boolean)) {
      const allOpen = {};
      groupedItems.forEach(([key]) => allOpen[key] = true);
      // Consider if L2/L3 should also auto-expand. For now, only L1.
      // setOpenGroups(allOpen); // This might cause issues if called directly in render.
                               // Better to manage this effect-fully or by user action.
                               // For now, user has to manually expand.
    }
  }


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
          // Use StyledButton, apply existing classes for sidebar-specific style
          <StyledButton
            key={item.eventKey}
            variant="link" // Base variant
            eventKey={item.eventKey} // Pass eventKey for Nav onSelect
            active={activeKey === item.eventKey} // Pass active state
            onClick={() => setActiveKey(item.eventKey)} // Handle click for active state
            className={`${styles.navLink} ${activeKey === item.eventKey ? styles.active : ''}`} // Apply sidebar styles
          >
            <Icon name={item.icon} className={styles.navLinkIcon} /> {item.label}
          </StyledButton>
        ))}

        {/* Render grouped items */}
        {groupedItems.length === 0 && searchTerm && topLevelItems.length > 0 ? ( // Show if top-level items exist but no grouped items
          <div className={styles.noResults}>No grouped items found.</div>
        ) : groupedItems.length === 0 && searchTerm && topLevelItems.length === 0 ? ( // Show if no items at all
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
                    // If searching, L2 submenus with children should also be open to show matched L3 items
                    const isSubmenuOpen = searchTerm && hasChildren ? true : openSubmenus[item.eventKey]; 

                    return (
                      <div key={item.eventKey} className={styles.level2Wrapper}>
                        <StyledButton
                          variant="link" // Keep link variant for base styling
                        onClick={() => {
                          if (hasChildren) {
                            toggleSubmenu(item.eventKey);
                          } else {
                            // For leaf nodes, Nav's onSelect (if eventKey is passed) or this direct setActiveKey will handle it.
                            // console.log(`L2 Leaf StyledButton Clicked: ${item.label}, eventKey: ${item.eventKey}, hasChildren: ${hasChildren}`);
                            setActiveKey(item.eventKey);
                          }
                        }}
                        // Pass eventKey ONLY if it's a leaf node, to allow Nav's onSelect to work for selection.
                        // For parent nodes, we don't want Nav's onSelect to interfere with our toggle.
                        eventKey={!hasChildren ? item.eventKey : undefined}
                        active={!hasChildren && activeKey === item.eventKey} // Active state only for leaf nodes
                        className={`${styles.navLink} ${styles.level2Link} ${(!hasChildren && activeKey === item.eventKey) ? styles.active : ''} ${(!searchTerm && hasChildren && item.children.some(child => activeKey === child.eventKey)) ? styles.activePathParent : ''}`}
                        aria-controls={hasChildren ? `submenu-${item.eventKey}` : undefined}
                        aria-expanded={hasChildren ? isSubmenuOpen : undefined}
                        // Ensure the button itself is focusable if it's interactive
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

                      {/* Render Level 3 items */}
                      {hasChildren && (
                        <Collapse in={isSubmenuOpen}>
                          <div id={`submenu-${item.eventKey}`} className={styles.level3Container}>
                            {item.children.map(childItem => {
                              // L3 items do not have further children in this simplified search logic
                              // const hasGrandChildren = childItem.children && childItem.children.length > 0;
                              // const isSubSubmenuOpen = openSubSubmenus[childItem.eventKey];

                              return (
                                <div key={childItem.eventKey} className={styles.level3Wrapper}>
                                  <StyledButton
                                    variant="link"
                                    eventKey={childItem.eventKey}
                                    active={activeKey === childItem.eventKey}
                                    onClick={() => setActiveKey(childItem.eventKey)}
                                    className={`${styles.navLink} ${activeKey === childItem.eventKey ? styles.active : ''} ${styles.level3Link}`}
                                  >
                                    {childItem.icon && <Icon name={childItem.icon} className={styles.navLinkIcon} />}
                                    <span className={styles.linkLabel}>{childItem.label}</span>
                                    {/* L3 items are leaves, no expand icon */}
                                  </StyledButton>
                                </div>
                              );
                            })}
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
