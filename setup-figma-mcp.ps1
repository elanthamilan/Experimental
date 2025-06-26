# Figma MCP Server Setup Script for Claude Desktop
# This script configures Claude Desktop to work with the Figma Dev Mode MCP Server

Write-Host "🎨 Figma MCP Server Setup for Claude Desktop" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Define paths
$claudeDir = "$env:APPDATA\Claude"
$configFile = "$claudeDir\claude_desktop_config.json"

# Create Claude directory if it doesn't exist
if (-not (Test-Path $claudeDir)) {
    Write-Host "📁 Creating Claude directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
    Write-Host "✅ Claude directory created at: $claudeDir" -ForegroundColor Green
}

# Check if config file exists
$configExists = Test-Path $configFile
if ($configExists) {
    Write-Host "⚠️  Existing configuration found at: $configFile" -ForegroundColor Yellow
    $backup = "${configFile}.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $configFile $backup
    Write-Host "📋 Backup created at: $backup" -ForegroundColor Green
}

# Define the MCP configuration
$mcpConfig = @{
    mcpServers = @{
        "figma-dev-mode" = @{
            command = "node"
            args = @()
            env = @{}
            transport = @{
                type = "sse"
                url = "http://127.0.0.1:3845/sse"
            }
        }
    }
}

# If config exists, merge with existing configuration
if ($configExists) {
    try {
        $existingConfig = Get-Content $configFile -Raw | ConvertFrom-Json -AsHashtable
        if (-not $existingConfig.mcpServers) {
            $existingConfig.mcpServers = @{}
        }
        $existingConfig.mcpServers["figma-dev-mode"] = $mcpConfig.mcpServers["figma-dev-mode"]
        $finalConfig = $existingConfig
        Write-Host "🔄 Merged with existing configuration" -ForegroundColor Blue
    }
    catch {
        Write-Host "❌ Error reading existing config. Using new configuration." -ForegroundColor Red
        $finalConfig = $mcpConfig
    }
}
else {
    $finalConfig = $mcpConfig
}

# Write configuration to file
try {
    $finalConfig | ConvertTo-Json -Depth 10 | Set-Content $configFile -Encoding UTF8
    Write-Host "✅ Configuration written successfully!" -ForegroundColor Green
    Write-Host "📍 Config file location: $configFile" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error writing configuration: $_" -ForegroundColor Red
    exit 1
}

# Display next steps
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open Figma Desktop App" -ForegroundColor White
Write-Host "2. Go to Figma menu → Preferences → Enable Dev Mode MCP Server" -ForegroundColor White
Write-Host "3. Restart Claude Desktop" -ForegroundColor White
Write-Host "4. Verify the server is running at http://127.0.0.1:3845/sse" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more information, see the README.md file" -ForegroundColor Yellow
Write-Host "🎉 Setup complete!" -ForegroundColor Green
