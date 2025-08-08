#!/bin/bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies and build React
npm install
npm run build