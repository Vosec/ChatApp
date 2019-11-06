from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from flask_socketio import SocketIO, send
from model import User

app = Flask(__name__)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = 'secret'
socketio = SocketIO(app, cors_allowed_origins="*")


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


@app.route('/history', methods=['GET'])
def get_history():
    msgs = User.get_messages()
    return jsonify({"history": msgs})


@socketio.on('message')
def message(msg):
    # for k, v in msg.items():
    #     print(k, v)
    print('Message: ' + msg)
    User.save_message(msg)
    # TODO: solve len of msg cause of username...
    if len(msg) > 20 or len(msg) <= 0:
        return jsonify({"error": "Maximum length of message is 20 chars, minimum 1"}), 400
    send(msg, broadcast=True)


if __name__ == '__main__':
    app.run()
    socketio.run(app)
