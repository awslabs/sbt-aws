#!/bin/bash

# Security Check Script for SBT-AWS
# This script runs security checks across all package.json files in the project

set -e

echo "🔒 Running Security Checks for SBT-AWS"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to run npm audit in a directory
run_audit() {
    local dir=$1
    local name=$2
    
    echo ""
    print_status $YELLOW "Checking $name..."
    
    if [ -f "$dir/package.json" ]; then
        cd "$dir"
        
        # Check if node_modules exists, if not install dependencies
        if [ ! -d "node_modules" ]; then
            print_status $YELLOW "Installing dependencies for $name..."
            npm install --silent
        fi
        
        # Run npm audit
        if npm audit --audit-level=moderate; then
            print_status $GREEN "✅ No moderate or high vulnerabilities found in $name"
        else
            print_status $RED "❌ Vulnerabilities found in $name"
            echo "Run 'npm audit fix' in $dir to attempt automatic fixes"
        fi
        
        cd - > /dev/null
    else
        print_status $YELLOW "⚠️  No package.json found in $dir"
    fi
}

# Check root project
run_audit "." "Root Project"

# Check website
run_audit "website" "Website"

# Check point-solutions library
run_audit "src/point-solutions/libraries" "Point Solutions Library"

echo ""
print_status $YELLOW "Checking for outdated packages..."

# Function to check outdated packages
check_outdated() {
    local dir=$1
    local name=$2
    
    if [ -f "$dir/package.json" ]; then
        echo ""
        print_status $YELLOW "Outdated packages in $name:"
        cd "$dir"
        npm outdated || true
        cd - > /dev/null
    fi
}

check_outdated "." "Root Project"
check_outdated "website" "Website"
check_outdated "src/point-solutions/libraries" "Point Solutions Library"

echo ""
print_status $GREEN "🔒 Security check completed!"
echo ""
echo "Additional security recommendations:"
echo "1. Keep dependencies updated regularly"
echo "2. Review security advisories for your dependencies"
echo "3. Use 'npm audit fix' to automatically fix vulnerabilities"
echo "4. Consider using 'npm ci' in production for reproducible builds"
echo "5. Enable Dependabot alerts in your GitHub repository"
echo ""
print_status $YELLOW "For more information, see SECURITY.md"