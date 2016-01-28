from bottle import route, run, template, static_file, get, post, request
import json, MySQLdb

STARTING_HP = 100
STARTING_GOLD = 10


def createUser(user_n, current_story_id, current_adv_id):
    checkUser(user_n)
    query = "INSERT INTO users (user_name, HP, Gold, Current_step, Current_Adventure, Weapon) VALUES (\'%s\', \'%d\', \'%d\', \'%d\', \'%d\', \'%s\')" % (user_n, int(STARTING_HP), int(STARTING_GOLD), int(current_story_id), int(current_adv_id), 'None')

    print query

    db = MySQLdb.connect(host="localhost",  # our server, in our case localhost
                         user="root",  # our username, in our case root
                         passwd="",  # our password, in our case blank
                         db="adventuregame")  # name of the specific database/scheme in the server
    db.autocommit(True)

    # you must create a Cursor object. It will let
    cur = db.cursor()
    # Use all the SQL you like
    #  The cursor executes the query

    cur.execute(query)
    db.close()



def checkUser():
    pass


@get("/")
def index():
    return template("adventure.html")


@post("/start")
def start():
    user_name = request.forms.get('name')
    current_adv_id = request.forms.get('adventure_id')

    user_id = 0  # todo check if exists and if not create it
    current_story_id = 0  # todo change

    # TESTS
    createUser(user_name, current_adv_id, current_story_id)
    # TESTS


    # todo add the next step based on db
    return json.dumps({"user": user_id,
                       "adventure": current_adv_id,
                       "current": current_story_id,
                       "text": "You meet a mysterious creature in the woods, what do you do?",
                       "image": "troll.png",
                       "option_1": ["I fight it", 1],
                       "option_2": ["I give him 10 coins", 2],
                       "option_3": ["I tell it that I just, want to go home", 3],
                       "option_4": ["I run away quickly", 4]
                       })


@post("/story")
def story():
    user_id = request.forms.get('user')
    current_adv_id = request.forms.get('adventure')
    next_story_id = request.forms.get('next')

    # todo add the next step based on db
    return json.dumps({"user": user_id,
                       "adventure": current_adv_id,
                       "text": "Some other question?",
                       "image": "choice.jpg",
                       "option_1": ["Option 1", 1],
                       "option_2": ["Option 2", 2],
                       "option_3": ["Option 3", 3],
                       "option_4": ["Option 4", 4]
                       })


@get('/js/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='js')


@get('/css/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='css')


@get('/images/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root='images')


run(host='localhost', port=7000)
