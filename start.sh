#!/bin/bash

# Start Flask server in background
cd server
./venv/bin/python run.py &
SERVER_PID=$!

# Start React app
cd ..
npm start &
REACT_PID=$!

# Wait for both processes
wait $SERVER_PID $REACT_PID