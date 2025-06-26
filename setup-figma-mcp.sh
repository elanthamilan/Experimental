#!/bin/bash

# Figma MCP Server Setup Script for Claude Desktop
# This script configures Claude Desktop to work with the Figma Dev Mode MCP Server

echo "🎨 Figma MCP Server Setup for Claude Desktop"
echo "============================================="

# Determine OS and set config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CLAUDE_DIR="$HOME/Library/Application Support/Claude"
    CONFIG_FILE="$CLAUDE_DIR/claude_desktop_config.json"
    echo "🍎 Detected macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CLAUDE_DIR="$HOME/.config/claude"
    CONFIG_FILE="$CLAUDE_DIR/claude_desktop_config.json"
    echo "🐧 Detected Linux"
else
    echo "❌ Unsupported operating system. Please use the Windows PowerShell script."
    exit 1
fi

# Create Claude directory if it doesn't exist
if [ ! -d "$CLAUDE_DIR" ]; then
    echo "📁 Creating Claude directory..."
    mkdir -p "$CLAUDE_DIR"
    echo "✅ Claude directory created at: $CLAUDE_DIR"
fi

# Check if config file exists and create backup
if [ -f "$CONFIG_FILE" ]; then
    echo "⚠️  Existing configuration found at: $CONFIG_FILE"
    BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d-%H%M%S)"
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo "📋 Backup created at: $BACKUP_FILE"
fi

# Create the MCP configuration
cat > "$CONFIG_FILE" << 'EOF'
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
EOF

if [ $? -eq 0 ]; then
    echo "✅ Configuration written successfully!"
    echo "📍 Config file location: $CONFIG_FILE"
else
    echo "❌ Error writing configuration file"
    exit 1
fi

# Make the script executable
chmod +x "$0"

# Display next steps
echo ""
echo "🚀 Next Steps:"
echo "1. Open Figma Desktop App"
echo "2. Go to Figma menu → Preferences → Enable Dev Mode MCP Server"
echo "3. Restart Claude Desktop"
echo "4. Verify the server is running at http://127.0.0.1:3845/sse"
echo ""
echo "📖 For more information, see the README.md file"
echo "🎉 Setup complete!"
