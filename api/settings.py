from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb+srv://672021233:Faizal00-@cluster0.xkr24zk.mongodb.net/')
db = client['finance-app']
settings_collection = db['settings']

def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def handler(request):
    if request.method == 'GET':
        settings = settings_collection.find_one({'type': 'global'})
        if not settings:
            default_settings = {
                'type': 'global',
                'categories': {
                    'income': ['Salary', 'Freelance', 'Investment', 'Other'],
                    'expense': ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Other']
                },
                'transactionTypes': ['income', 'expense'],
                'spendingLimit': None
            }
            settings_collection.insert_one(default_settings)
            settings = default_settings
        return jsonify(serialize_doc(settings))
    
    elif request.method == 'PUT':
        data = request.get_json()
        data['type'] = 'global'
        settings = settings_collection.find_one({'type': 'global'})
        if not settings:
            settings_collection.insert_one(data)
        else:
            settings_collection.update_one({'_id': settings['_id']}, {'$set': data})
        return jsonify(serialize_doc(data))