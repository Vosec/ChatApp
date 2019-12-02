from datetime import datetime
import psycopg2
import time
from model import credentials as crd

POSTGRES_USER = crd.POSTGRES_USER
POSTGRES_PW = crd.POSTGRES_PW
POSTGRES_DB = crd.POSTGRES_DB
POSTGRES_HOST = crd.POSTGRES_HOST
POSTGRES_PORT = crd.POSTGRES_PORT

connection = psycopg2.connect(user=POSTGRES_USER, password=POSTGRES_PW, host=POSTGRES_HOST,
                              port=POSTGRES_PORT, database=POSTGRES_DB)

cur = connection.cursor()


def check(username):
    """
    Checks if username exists in DB
    :param username: name of user
    :return: returns username, hashed pw, and date of creation
    """
    cur.execute("SELECT * FROM users where username = '{0}'".format(username))
    rv = cur.fetchone()
    return rv


def check_room(room):
    """
    Checks if room exists in DB
    :param room: name of room
    :return: room
    """
    cur.execute("""SELECT * FROM rooms where name = %s""", (str(room),))
    rv = cur.fetchone()
    return rv


def register(username, password):
    """
    User registration into DB
    :param username: name of user
    :param password: hashed password of user
    :return: None
    """
    created = datetime.utcnow()
    cur.execute("""INSERT INTO users (username, userPw, created) VALUES (%s, %s, %s)""", (str(username), str(password),
                str(created)))
    connection.commit()


def save_message(data):
    """
    Saves msg into DB
    :param data: data['username']) data['message']) data['room']
    :return: None
    """
    created = datetime.now()
    cur.execute("""INSERT INTO messages (username, message, created, room) VALUES (%s, %s, %s, %s)""",
                 (str(data['username']), str(data['message']),
                  str(created), str(data['room'])))
    connection.commit()


def get_messages(room):
    """
    Returns all the messages for specific room
    :param room: specific room
    :return: messages for the room as list
    """
    res = []
    cur.execute("""SELECT * FROM messages WHERE room = %s""", (str(room),))
    rv = cur.fetchall()

    for msg in rv:
        # msg[0] = msg, msg[1] = date, msg[2] = userName
        res.append(msg[3] + ": " + msg[2])
    return res


def create_room(room):
    """
    Creates room
    :param room: specific room
    :return: messages for the room as list
    """
    tmp = check_room(room['room'])
    print(tmp)
    if tmp is None:
        cur.execute("""INSERT INTO rooms (name) VALUES (%s)""", (str(room['room']),))
        connection.commit()


def get_rooms():
    """
    Gets all the rooms
    :return: all rooms as list
    """
    res = []
    time.sleep(0.5)
    cur.execute("""SELECT * FROM rooms""")
    rv = cur.fetchall()

    for room in rv:
        res.append(room[0])
    return res


def get_newest_room():
    """
    Gets newest room
    :return: newest room
    """
    cur.execute("""SELECT * FROM rooms ORDER BY id DESC LIMIT 1""")
    rv = cur.fetchone()
    return rv[0]
