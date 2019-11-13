from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from flask_socketio import SocketIO, send, join_room, leave_room, emit
from model import User
import time


app = Flask(__name__)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = 'secret'
socketio = SocketIO(app, cors_allowed_origins="*")


# @app.route('/')
# def index():
#     return "xx"


@app.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    :return: json message and http code
    """
    username = request.get_json()['username']
    password = request.get_json()['password']

    rv = User.check(username)
    if rv is None:
        return jsonify({"error": "Invalid username or password"}), 401
    if bcrypt.check_password_hash(rv[1], password):
        access_token = create_access_token(
            identity={'username': rv[0], 'password': rv[1]})
        return jsonify({"token": access_token})
    return jsonify({"error": "Invalid username or password"}), 401


@app.route('/register', methods=['POST'])
def register():
    """
    User register endpoint
    :return: json message and http code
    """
    username = request.get_json()['username']
    password = request.get_json()['password']
    hashed_password = bcrypt.generate_password_hash(request.get_json()['password']).decode('utf-8')

    rv = User.check(username)
    if rv is not None:
        return jsonify({"error": "Username already exists"}), 409
    if len(username) > 11 or len(password) > 11:
        print(username)
        print(password)
        return jsonify({"error": "Maximum length of username and password is 10 chars"}), 409

    User.register(username, hashed_password)
    return jsonify({"result": "user created"})


@app.route('/history', methods=['POST'])
def get_history():
    """
    history of room endpoint
    :return: json chat history
    """
    print("history" + request.get_json()['room'])
    room = request.get_json()['room']
    msgs = User.get_messages(room)
    return jsonify({"history": msgs})


@socketio.on('message')
def message(msg):
    """
    websocket for broadcasting messages to connected rooms
    """
    print('Message: ' + msg['username']+": "+msg['message'])
    User.save_message(msg)
    # TODO: solve len of msg cause of username...
    if len(msg) > 20 or len(msg) <= 0:
        return jsonify({"error": "Maximum length of message is 20 chars, minimum 1"}), 400
    send(msg['username']+": "+msg['message'], broadcast=True, room=msg['room'])


@socketio.on('join')
def on_join(data):
    """
    websocket for joing to the room
    """
    print("changing room")
    username = data['username']
    room = data['room']
    join_room(room)
    print(room)
    send(username + ' has entered the room', room=room)


@socketio.on('leave')
def on_leave(data):
    """
    websocket for leaving the room
    """
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room', room=room)


@socketio.on('createRoom')
def create_room(data):
    """
    websocket for creating the room
    """
    print("create room: " + data['room'])
    User.create_room(data)


@socketio.on('getNewestRoom')
def get_newest_room():
    """
    websocket for getting newest room
    """
    time.sleep(0.5)
    emit("getNewestRoom", User.get_newest_room())


@socketio.on('getRooms')
def get_rooms():
    """
    websocket for getting all the rooms
    """
    print("getrooms")
    emit("getRooms", User.get_rooms())


if __name__ == '__main__':
    app.run()
    socketio.run(app)
