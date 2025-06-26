#!/usr/bin/env node

/**
 * Figma MCP Server Connection Test
 * This script tests the connection to the Figma Dev Mode MCP Server
 */

const http = require('http');
const https = require('https');

const SERVER_URL = 'http://127.0.0.1:3845/sse';

console.log('🧪 Testing Figma MCP Server Connection');
console.log('=====================================');
console.log(`📡 Testing connection to: ${SERVER_URL}`);

// Parse URL
const url = new URL(SERVER_URL);
const client = url.protocol === 'https:' ? https : http;

// Test connection
const req = client.request({
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'GET',
    timeout: 5000
}, (res) => {
    console.log(`✅ Connection successful!`);
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    if (res.statusCode === 200) {
        console.log('🎉 Figma MCP Server is running and accessible!');
    } else {
        console.log('⚠️  Server responded but with unexpected status code');
    }
});

req.on('error', (error) => {
    console.log('❌ Connection failed!');
    console.log('🔍 Error details:', error.message);
    console.log('');
    console.log('💡 Troubleshooting steps:');
    console.log('1. Ensure Figma Desktop App is running');
    console.log('2. Enable Dev Mode MCP Server in Figma preferences');
    console.log('3. Check that no firewall is blocking port 3845');
    console.log('4. Verify you have the required Figma plan');
});

req.on('timeout', () => {
    console.log('⏰ Connection timed out');
    console.log('💡 The server might not be running or accessible');
    req.destroy();
});

req.end();

// Additional checks
console.log('');
console.log('🔧 System Information:');
console.log(`Node.js Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);

// Check if Claude Desktop config exists
const os = require('os');
const fs = require('fs');
const path = require('path');

let configPath;
if (process.platform === 'win32') {
    configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
} else if (process.platform === 'darwin') {
    configPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
} else {
    configPath = path.join(os.homedir(), '.config', 'claude', 'claude_desktop_config.json');
}

console.log(`📁 Expected Claude config path: ${configPath}`);

if (fs.existsSync(configPath)) {
    console.log('✅ Claude Desktop configuration file found');
    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.mcpServers && config.mcpServers['figma-dev-mode']) {
            console.log('✅ Figma MCP server configuration found');
        } else {
            console.log('⚠️  Figma MCP server not configured in Claude Desktop');
        }
    } catch (error) {
        console.log('❌ Error reading Claude Desktop configuration:', error.message);
    }
} else {
    console.log('❌ Claude Desktop configuration file not found');
    console.log('💡 Run the setup script to create the configuration');
}
