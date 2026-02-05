import psycopg2

def connect_db():
    return psycopg2.connect(
        dbname="vesuvius_db2", 
        user="postgres",
        password="1234", 
        host="localhost"
    )

def register_user(username, password):
    conn = connect_db(); cur = conn.cursor()
    try:
        cur.execute("INSERT INTO researchers (username, password) VALUES (%s, %s)", (username, password))
        conn.commit(); return True
    except: return False
    finally: cur.close(); conn.close()

def login_user(username, password):
    conn = connect_db(); cur = conn.cursor()
    cur.execute("SELECT username FROM researchers WHERE username=%s AND password=%s", (username, password))
    user = cur.fetchone()
    cur.close(); conn.close()
    return user