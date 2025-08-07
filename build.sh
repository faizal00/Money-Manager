#!/bin/bash
# Install backend dependencies
cd server
pip install -r requirements.txt
cd ..

# Install frontend dependencies and build
npm install
npm run build