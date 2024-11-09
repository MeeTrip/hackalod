from flask import Flask, jsonify
import serial
import time
import threading

app = Flask(__name__)
arduino = serial.Serial(port='/dev/ttyACM0', baudrate=9600, timeout=.1)

# Variable to hold the latest reading
latest_data = ""
data_lock = threading.Lock()

def poll_serial():
    global latest_data
    while True:
        time.sleep(0.05)
        data = arduino.readline().decode().strip()
        if data:
            with data_lock:
                latest_data = data

@app.route('/read-data', methods=['GET'])
def get_data():
    with data_lock:
        return jsonify({"data": latest_data})

if __name__ == '__main__':
    # Start the background thread to poll the serial port
    polling_thread = threading.Thread(target=poll_serial, daemon=True)
    polling_thread.start()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000)
