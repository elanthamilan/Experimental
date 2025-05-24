import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import StyledButton from './atoms/StyledButton'; // Import atom
import styles from './Header.module.scss'; // SCSS module

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className={styles.navbarCustom}>
      <Container fluid>
        {/* Removed Navbar.Brand containing logo and MIT text */}
        {/* Add a placeholder or title if needed, or leave empty for links/avatar only */}
        <span className="flex-grow-1"></span> {/* Spacer to push links right */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Use Nav for alignment, but StyledButton for the links */}
          <Nav className={`ms-auto align-items-center ${styles.navLinksContainer}`}>
            {/* Removed redundant classes, styling comes from StyledButton variant="link" */}
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
            {/* User Avatar */}
            <div className={styles.avatarPlaceholder} />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
