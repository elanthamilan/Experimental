# Figma MCP Integration Guide

This document provides comprehensive instructions for setting up and using the Figma Dev Mode MCP Server with this project.

## Overview

The Figma Dev Mode MCP Server enables AI assistants to directly access Figma design files and generate code from them. This integration allows for:

- **Design-to-Code Generation**: Convert Figma frames directly into React components
- **Design System Integration**: Extract variables, components, and layout data
- **Code Connect Support**: Use your actual components for consistent code generation

## Prerequisites

### Figma Requirements
- Figma Desktop App (latest version)
- Dev or Full seat on Professional, Organization, or Enterprise plan
- Access to Figma files with the designs you want to convert

### Development Environment
- Claude Desktop or compatible MCP client (VS Code, Cursor, Windsurf)
- Node.js (for some MCP configurations)
- This React project set up and running

## Setup Instructions

### Automated Setup

Use the provided setup scripts for quick configuration:

**Windows:**
```powershell
.\setup-figma-mcp.ps1
```

**macOS/Linux:**
```bash
./setup-figma-mcp.sh
```

### Manual Setup

#### Step 1: Enable Figma MCP Server

1. Open the Figma Desktop App
2. Ensure you're on the latest version (Help → Check for Updates)
3. Create or open a Figma Design file
4. Click the Figma menu in the upper-left corner
5. Navigate to **Preferences**
6. Select **Enable Dev Mode MCP Server**
7. Confirm the server is running at `http://127.0.0.1:3845/sse`

#### Step 2: Configure Claude Desktop

1. Locate your Claude Desktop configuration file:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/claude/claude_desktop_config.json`

2. Create the file if it doesn't exist, or add to existing configuration:

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

#### Step 3: Verify Connection

1. Open Claude Desktop
2. Start a new conversation
3. The Figma MCP server should appear in available tools
4. Test by asking Claude to help with a Figma design

## Usage Examples

### Selection-Based Workflow

1. Open your Figma file in the desktop app
2. Select a frame or component you want to convert
3. In Claude Desktop, prompt:
   ```
   "Please help me implement the currently selected Figma frame as a React component for my Student Information System project."
   ```

### Link-Based Workflow

1. In Figma, right-click on a frame and select "Copy link"
2. In Claude Desktop, prompt:
   ```
   "Please implement this Figma design as a React component: [paste Figma link]
   Make sure it follows the existing design patterns in my SIS project."
   ```

### Design System Integration

```
"Extract the design tokens and variables from my current Figma selection and show me how to integrate them with my existing theme system in themes.js"
```

## Best Practices

### For This Project

1. **Consistent Styling**: Ask Claude to match the existing Bootstrap and custom styling patterns
2. **Theme Integration**: Request components that work with the dynamic theming system
3. **Responsive Design**: Ensure generated components follow the responsive patterns
4. **Component Structure**: Ask for components that fit the existing folder structure

### Example Prompts

```
"Generate a React component from this Figma frame that:
- Uses React Bootstrap components where appropriate
- Integrates with the ThemeContext from App.js
- Follows the styling patterns in the existing components
- Is responsive and works with the current layout system"
```

## Troubleshooting

### Common Issues

**Server Not Found**
- Ensure Figma Desktop is running
- Verify MCP server is enabled in Figma preferences
- Check that the server is accessible at `http://127.0.0.1:3845/sse`

**Configuration Not Loading**
- Restart Claude Desktop after configuration changes
- Verify JSON syntax in configuration file
- Check file permissions on configuration directory

**No Design Context**
- Ensure you have a frame selected in Figma
- Verify you have the required Figma plan and seat type
- Try copying and pasting the Figma link instead

### Getting Help

1. Check the Figma MCP server status in Figma Desktop
2. Verify your Figma plan includes Dev Mode access
3. Test the server URL directly in a browser
4. Review Claude Desktop logs for connection errors

## Integration with Project Workflow

### Component Development

1. Design components in Figma following the project's design system
2. Use the MCP server to generate initial React code
3. Refine the generated code to match project patterns
4. Test with the existing theming system
5. Add to the appropriate component directory

### Design System Maintenance

1. Update Figma designs when adding new themes
2. Use MCP to extract design tokens
3. Update `themes.js` with new color palettes
4. Regenerate components that need theme updates

This integration streamlines the design-to-development workflow and ensures consistency between Figma designs and the implemented React components.
