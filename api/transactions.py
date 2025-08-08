from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb+srv://672021233:Faizal00-@cluster0.xkr24zk.mongodb.net/')
db = client['finance-app']
transactions_collection = db['transactions']

def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def handler(request):
    if request.method == 'GET':
        transactions = list(transactions_collection.find().sort('date', -1))
        return jsonify([serialize_doc(t) for t in transactions])
    
    elif request.method == 'POST':
        data = request.get_json()
        result = transactions_collection.insert_one(data)
        data['_id'] = str(result.inserted_id)
        return jsonify(data)
    
    elif request.method == 'DELETE':
        transaction_id = request.args.get('id')
        transactions_collection.delete_one({'_id': ObjectId(transaction_id)})
        return '', 204