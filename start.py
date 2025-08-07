import os
import subprocess
import threading
from server.app import app

def start_frontend():
    os.system("npx serve -s build -l 3000")

if __name__ == '__main__':
    # Start frontend in background
    frontend_thread = threading.Thread(target=start_frontend)
    frontend_thread.daemon = True
    frontend_thread.start()
    
    # Start backend
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)