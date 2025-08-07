from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['finance-app']
transactions_collection = db['transactions']
settings_collection = db['settings']

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = list(transactions_collection.find().sort('date', -1))
        return jsonify([serialize_doc(t) for t in transactions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    try:
        data = request.json
        result = transactions_collection.insert_one(data)
        data['_id'] = str(result.inserted_id)
        return jsonify(data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    try:
        transactions_collection.delete_one({'_id': ObjectId(transaction_id)})
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['GET'])
def get_settings():
    try:
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
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['PUT'])
def update_settings():
    try:
        data = request.json
        data['type'] = 'global'
        settings = settings_collection.find_one({'type': 'global'})
        if not settings:
            settings_collection.insert_one(data)
        else:
            settings_collection.update_one({'_id': settings['_id']}, {'$set': data})
        return jsonify(serialize_doc(data))
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)