import json
import paho.mqtt.client as mqtt
import time
import threading
import sys
from pymongo import MongoClient
import random
from threading import Timer
import atexit


client = MongoClient()
db = client.demo


print("\n")
for i in range(0, 30):
	print("*", end=" ")
for i in range(0, 4):
	print("\n")
	if i == 1:
		print("\t\tEMOORING DEMO")
for i in range(0, 30):
	print("*", end=" ")
print("\n")


num_of_reps = input("\nEnter number of iterations: ")
num_of_sensors = input("\nEnter number of sensors: ")
print("\nProcessing............")
time.sleep(2)
print("\nProcessing............DONE")
print("\n")


class Repeat(object):

	count = 0

	@staticmethod
	def repeat(rep, delay, func):
	    """repeat func rep times with a delay given in seconds"""
	    if Repeat.count < rep:
	        # call func, you might want to add args here
	        func()
	        Repeat.count += 1
	        # setup a timer which calls repeat recursively
	        # again, if you need args for func, you have to add them here
	        timer = Timer(delay, Repeat.repeat, (rep, delay, func))
	        # register timer.cancel to stop the timer when you exit the interpreter
	        atexit.register(timer.cancel)
	        timer.start()


def insert_db(msg):
	db.widgets.insert_one(msg)


def update_db(msg):
	sensor_id = msg["_id"]
	data_array = msg["timeline"]["data"]
	last_element = data_array[len(data_array) - 1]
	query = { '_id': sensor_id }
	update = {
	    '$push': { 
	        "timeline.data": {
	            "$each": [
	                {
	                    "content": last_element["content"],
	                    "start": last_element["start"],
	                    "end": last_element["end"]
	                }  
	            ]    
	        }
	    }
	}
	db.widgets.update_one(query, update, True)


def check_for_id(sensor_id):
    query = { "_id": sensor_id }
    if db.widgets.find(query).count() == 1:
        return 1
    else:
        return 0


def mqtt_client_call(msg, id):
    client = mqtt.Client(str(id))
    print("Sending to MQTT broker sensor data with ID: " + str(id) + "\n")
    try:
        client.connect('localhost', 1883, 60)
    except:
        print ("WARNING: Could not connect to MQTT.")
    client.loop_start()
    client.publish("eMooring", payload=json.dumps(msg), qos=1, retain=False)
    client.disconnect()
    return


def create_mqtt_doc():
    """Return dictionary to be sent on mqtt broker"""
    sensor_id = random.randint(1, int(num_of_sensors))
    mqtt_doc = dict({
        '_id': sensor_id,
        'timeline': {
            'data': [{
                'content': "Sensor No. " + str(sensor_id),
                'start': int(round(time.time()*1000)),
                'end': int(round((time.time()*1000)+5000))
            }],
        },
    })
    mqtt_client_call(mqtt_doc, sensor_id)
    mqtt_db_state = check_for_id(sensor_id)
    if mqtt_db_state == 0:
    	print("Inserting into MongoDB sensor data with ID: " + str(sensor_id) + "\n")
    	insert_db(mqtt_doc)
    else:
    	print("Updating MongoDB with sensor data with ID: " + str(sensor_id) + "\n")
    	update_db(mqtt_doc)

Repeat.repeat(int(num_of_reps), 5, create_mqtt_doc)
