import pymysql
from datetime import datetime

MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = ''
MYSQL_DB = 'chatapp'

conn = pymysql.connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB)
cur = conn.cursor()


def check(username):
    """
    Checks if username exists in DB
    :param username: name of user
    :return: returns username, hashed pw, and date of creation
    """
    cur.execute("""SELECT * FROM users where userName = %s""", str(username))
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
    cur.execute("""INSERT INTO users (userName, userPw, created) VALUES (%s, %s, %s)""", (str(username), str(password),
                str(created)))
    conn.commit()


def save_message(data):
    created = datetime.now()

    cur.execute("""INSERT INTO messages (userName, message, created, room) VALUES (%s, %s, %s, %s)""",
                 (str(data['username']), str(data['message']),
                  str(created), str(data['room'])))
    conn.commit()


def get_messages(room):
    res = []
    cur.execute("""SELECT * FROM messages WHERE room = %s""", str(room))
    rv = cur.fetchall()
    for msg in rv:
        # msg[0] = msg, msg[1] = date, msg[2] = userName
        res.append(msg[2] + ": " + msg[0])
    return res


def create_room(room):
    cur.execute("""INSERT INTO rooms (name) VALUES (%s)""", (str(room['room'])))
    conn.commit()


def get_rooms():
    res = []
    cur.execute("""SELECT * FROM rooms""")
    rv = cur.fetchall()
    for room in rv:
        res.append(room[1]+":")
    return res
