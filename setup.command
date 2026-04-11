#!/bin/bash
# ============================================================
# Nitely Reel Editor — One-Time Setup
# Double-click this file to install everything you need.
# (Claude Cowork must be installed separately from claude.ai)
# ============================================================

set -e

echo ""
echo "========================================="
echo "  Nitely Reel Editor — Setup"
echo "========================================="
echo ""

# Navigate to the project folder (wherever this script lives)
cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"
echo "Project folder: $PROJECT_DIR"
echo ""

# -----------------------------------------------------------
# 1. Check for Xcode Command Line Tools (needed for git, etc.)
# -----------------------------------------------------------
echo "[1/6] Checking Xcode Command Line Tools..."
if ! xcode-select -p &>/dev/null; then
    echo "  → Installing Xcode Command Line Tools (you may see a popup — click Install)..."
    xcode-select --install
    echo "  → Waiting for installation to finish. Press Enter when done."
    read -r
else
    echo "  → Already installed ✓"
fi

# -----------------------------------------------------------
# 2. Install Homebrew (if not already installed)
# -----------------------------------------------------------
echo ""
echo "[2/6] Checking Homebrew..."
if ! command -v brew &>/dev/null; then
    echo "  → Installing Homebrew (this may take a minute)..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Add brew to PATH for Apple Silicon Macs
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    fi
    echo "  → Homebrew installed ✓"
else
    echo "  → Already installed ✓"
fi

# -----------------------------------------------------------
# 3. Install Node.js via Homebrew
# -----------------------------------------------------------
echo ""
echo "[3/6] Checking Node.js..."
if ! command -v node &>/dev/null; then
    echo "  → Installing Node.js..."
    brew install node
    echo "  → Node.js $(node -v) installed ✓"
else
    echo "  → Already installed ($(node -v)) ✓"
fi

# -----------------------------------------------------------
# 4. Install ffmpeg (needed for video processing)
# -----------------------------------------------------------
echo ""
echo "[4/6] Checking ffmpeg..."
if ! command -v ffmpeg &>/dev/null; then
    echo "  → Installing ffmpeg (this may take a few minutes)..."
    brew install ffmpeg
    echo "  → ffmpeg installed ✓"
else
    echo "  → Already installed ✓"
fi

# -----------------------------------------------------------
# 5. Install git-filter-repo (for repo maintenance)
# -----------------------------------------------------------
echo ""
echo "[5/6] Checking git-filter-repo..."
if ! command -v git-filter-repo &>/dev/null; then
    echo "  → Installing git-filter-repo..."
    brew install git-filter-repo
    echo "  → git-filter-repo installed ✓"
else
    echo "  → Already installed ✓"
fi

# -----------------------------------------------------------
# 6. Install project dependencies (npm install)
# -----------------------------------------------------------
echo ""
echo "[6/6] Installing project dependencies..."
if [[ -f "$PROJECT_DIR/package.json" ]]; then
    cd "$PROJECT_DIR"
    npm install
    echo "  → npm dependencies installed ✓"
else
    echo "  → ERROR: package.json not found in $PROJECT_DIR"
    echo "    Make sure you cloned the repo and this script is in the project root."
    exit 1
fi

# -----------------------------------------------------------
# Make preview.command executable
# -----------------------------------------------------------
if [[ -f "$PROJECT_DIR/preview.command" ]]; then
    chmod +x "$PROJECT_DIR/preview.command"
fi

# -----------------------------------------------------------
# Done!
# -----------------------------------------------------------
echo ""
echo "========================================="
echo "  Setup complete! ✓"
echo "========================================="
echo ""
echo "  Node.js:  $(node -v)"
echo "  npm:      $(npm -v)"
echo "  ffmpeg:   $(ffmpeg -version 2>&1 | head -1)"
echo "  Project:  $PROJECT_DIR"
echo ""
echo "  Next steps:"
echo "  1. Install Claude Desktop from claude.ai/download"
echo "  2. Install GitHub Desktop from desktop.github.com"
echo "  3. Double-click preview.command to test the editor"
echo "  4. Read EDITING_GUIDE.md for how to make reels"
echo ""
echo "Press Enter to close this window."
read -r
