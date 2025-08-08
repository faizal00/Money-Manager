from server.app import app
from flask import send_from_directory, send_file
import os

# Serve React build files
@app.route('/')
def serve_react():
    return send_file('build/index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(f'build/{path}'):
        return send_from_directory('build', path)
    else:
        return send_file('build/index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)