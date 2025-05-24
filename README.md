# Student Information System (SIS)

This project is a React-based Student Information System designed to manage various aspects of a university or educational institution. It features a dynamic Material 3 theming system and mock user roles to simulate different user experiences.

## Features

*   **Modular SIS Structure:** Placeholder pages for key SIS functionalities including:
    *   Dashboard
    *   Student Management
    *   Staff Management
    *   Course Management
    *   Grades/Assessment
    *   Admissions
    *   Billing/Finance
    *   Reports
    *   User Profile
*   **Dynamic Theming System:**
    *   Utilizes a Material 3 inspired theming approach.
    *   Offers **30 pre-defined themes** categorized by style (e.g., Corporate, Modern, Elegant, Dynamic, Earthy, Neutral).
    *   Themes control color palettes (primary, secondary, tertiary, surface, background, etc.) and typography (display/headline and body/UI fonts).
    *   **Theme Selector:** Easily switch themes via the "Change Theme" (palette icon) option in the utility sidebar found on the right (on desktop view).
*   **Mock User Roles:**
    *   Simulates different user perspectives within the SIS.
    *   Available roles: **Admin**, **Teacher**, **Student**.
    *   **Role Selector:** Switch roles using the dropdown in the utility sidebar (right side of the screen on desktop).
    *   The main navigation sidebar on the left dynamically adapts to show relevant sections based on the selected role.
*   **Responsive Design:** Basic responsiveness for mobile and desktop views.

## Getting Started

### Prerequisites

*   Node.js (v16 or later recommended)
*   npm (or yarn)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  Install dependencies:
    ```bash
    npm install
    # OR
    # yarn install
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm start
    # OR
    # yarn start
    ```
2.  Open your browser and navigate to `http://localhost:3000` (or the port specified in your console).

## Using the Application

*   **Navigation:** Use the main `LeftSidebar` to navigate between different sections of the SIS.
*   **Theming:** Click the palette icon in the right-hand `UtilitySidebar` to open the theme selection modal. Choose any of the 30 available themes.
*   **User Roles:** Select a user role (Admin, Teacher, Student) from the dropdown in the right-hand `UtilitySidebar` to see how the application experience (primarily the navigation sidebar) changes for different users.

## Available Themes (Examples)

The application includes 30 themes. Here are a few examples to try:

*   **Corporate & Authoritative (Deep Teal):** Professional and trustworthy. (Primary: `#006C74`, Display: Inter, Body: Roboto)
*   **Modern & Accessible (Vivid Blue):** Clean and user-friendly. (Primary: `#006E88`, Display: Montserrat, Body: Noto Sans)
*   **Elegant & Sophisticated (Deep Lavender):** Luxurious and refined. (Primary: `#6750A4`, Display: Playfair Display, Body: Libre Baskerville)
*   **Dynamic & Impactful (Vibrant Red):** Strong and energetic. (Primary: `#D32F2F`, Display: Oswald, Body: Roboto Condensed)
*   **Earthy & Organic (Bright Green):** Tranquil and natural. (Primary: `#4CAF50`, Display: Noto Serif Display, Body: Noto Sans)
*   **Subtle & Sophisticated Neutrals (Muted Blue Gray):** Clean and adaptable. (Primary: `#5A6B70`, Display: Inter, Body: Source Sans Pro)

*(Refer to `src/themes.js` for a full list of theme definitions if needed.)*

## Project Structure (Key Areas)

*   `src/App.js`: Main application component, routing, context providers.
*   `src/themes.js`: Contains all theme definitions and theme application logic.
*   `src/components/`: Shared UI components.
    *   `src/components/LeftSidebar.js`: Main navigation.
    *   `src/components/Header.js`: Top application header.
    *   `App.js` (contains `UtilitySidebar`): Sidebar for theme/role switching.
*   `src/pages/`: Placeholder pages for different SIS modules.
*   `src/data/`: Mock data for SIS entities.
*   `src/styles/`: Global styles and SCSS variables.

```
