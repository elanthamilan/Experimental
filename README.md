# Student Information System (SIS)

This project is a React-based Student Information System designed to manage various aspects of a university or educational institution. It features a dynamic Material 3 theming system and mock user roles to simulate different user experiences.

## Figma MCP Integration

This project is configured to work with the Figma Dev Mode MCP Server, allowing AI assistants to directly access Figma design files and generate code from them. See the [Figma MCP Setup Guide](#figma-mcp-setup) below for configuration instructions.

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

## Figma MCP Setup

The Figma Dev Mode MCP Server allows AI assistants to access Figma design files and generate code directly from them. Follow these steps to set it up:

### Prerequisites

- Figma Desktop App (latest version)
- Dev or Full seat on Professional, Organization, or Enterprise plan
- Claude Desktop or compatible MCP client (VS Code, Cursor, Windsurf, etc.)

### Step 1: Enable Figma MCP Server

1. Open the Figma Desktop App and update to the latest version
2. Create or open a Figma Design file
3. In the upper-left corner, open the Figma menu
4. Under **Preferences**, select **Enable Dev Mode MCP Server**
5. You should see a confirmation that the server is running at `http://127.0.0.1:3845/sse`

### Step 2: Configure Claude Desktop

**Quick Setup (Recommended):**
```bash
npm run setup-figma-mcp
```

**Manual Setup:**
1. Create or edit the Claude Desktop configuration file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the following configuration:

```json
{
  "mcpServers": {
    "figma-dev-mode": {
      "command": "node",
      "args": [],
      "env": {},
      "transport": {
        "type": "sse",
        "url": "http://127.0.0.1:3845/sse"
      }
    }
  }
}
```

3. Restart Claude Desktop

### Step 3: Test the Connection

Verify that the Figma MCP server is working:
```bash
npm run test-figma-mcp
```

This will check:
- Server connectivity at `http://127.0.0.1:3845/sse`
- Claude Desktop configuration
- System compatibility

### Step 4: Using the Figma MCP Server

Once configured, you can:

1. **Selection-based**: Select a frame in Figma and ask Claude to implement it
2. **Link-based**: Copy a Figma frame link and ask Claude to implement the design

### Features Available

- **Generate code from selected frames**: Turn Figma designs into React components
- **Extract design context**: Pull variables, components, and layout data
- **Code Connect integration**: Use your actual components for consistent code generation

### Troubleshooting

- Ensure Figma Desktop App is running with MCP server enabled
- Verify the server is accessible at `http://127.0.0.1:3845/sse`
- Restart both Figma Desktop and Claude Desktop if connection fails
- Check that you have the required Figma plan and seat type
