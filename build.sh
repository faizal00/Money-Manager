#!/bin/bash
set -e

# Install Python dependencies
python -m pip install -r requirements.txt

# Install Node dependencies and build React
npm install
npm run build