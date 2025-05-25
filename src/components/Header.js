import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import StyledButton from './atoms/StyledButton'; // Import atom
import styles from './Header.module.scss'; // SCSS module

const Header = () => {
  const avatarPlaceholder = <div className={styles.avatarPlaceholder} />;

  return (
    <Navbar expand="lg" className={styles.navbarCustom} fixed="top">
      <Container fluid>
        {/* Branding/Logo */}
        <Navbar.Brand href="#home" className={styles.navbarBrand}>
          AppLogo
        </Navbar.Brand>

        {/* Responsive Toggle Button */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* Collapsible Content */}
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* Main Navigation Links (Left-aligned or Centered) */}
          <Nav className={`me-auto ${styles.mainNav}`}>
            <Nav.Link href="#dashboard" className={styles.navLink}>Dashboard</Nav.Link>
            <Nav.Link href="#academics" className={styles.navLink}>Academics</Nav.Link>
            <Nav.Link href="#administration" className={styles.navLink}>Administration</Nav.Link>
            <Nav.Link href="#finance" className={styles.navLink}>Finance</Nav.Link>
            {/* Example of a NavDropdown in main navigation if needed later */}
            {/* <NavDropdown title="More" id="basic-nav-dropdown-main" className={styles.navLink}>
              <NavDropdown.Item href="#action/3.1">Sub Action 1</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Sub Action 2</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>

          {/* Right-aligned Utility Icons/Links */}
          <Nav className={styles.utilityNav}>
            <StyledButton variant="link" href="#feedback">
              <span className="material-symbols-outlined">feedback</span>
              Send feedback
            </StyledButton>
            <StyledButton variant="link" href="#tutorial">
              <span className="material-symbols-outlined">play_circle</span>
              Video tutorial
            </StyledButton>
            <StyledButton variant="link" href="#manual">
              <span className="material-symbols-outlined">menu_book</span>
              User manual
            </StyledButton>

            {/* User Avatar and Dropdown */}
            <NavDropdown
              title={avatarPlaceholder}
              id="user-nav-dropdown"
              align="end"
              className={styles.userDropdown}
            >
              <NavDropdown.Item href="#profile">
                <span className="material-symbols-outlined">account_circle</span>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings"> {/* Corrected href for React Router */}
                <span className="material-symbols-outlined">settings</span>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout">
                <span className="material-symbols-outlined">logout</span>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
