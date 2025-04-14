from flask import Flask, jsonify, render_template, request, session, redirect, url_for, flash
import os
import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np

app = Flask(__name__, static_url_path='/static')

app.secret_key = os.urandom(24)  # Set a secret key for session management

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/api/predict_sentiment', methods=['POST'])
def predict_sentiment():
    # Load the saved model and tokenizer
    model = AutoModelForSequenceClassification.from_pretrained("LaBSE")
    tokenizer = AutoTokenizer.from_pretrained("LaBSE")

    # Get the text input from the form
    text = request.form['text']
    
    # Tokenize the input text
    inputs = tokenizer(text, padding=True, truncation=True,
                    return_tensors="pt")
    
    # Make predictions
    with torch.no_grad():
        outputs = model(**inputs)

    # Get predicted probabilities
    probabilities = torch.softmax(outputs.logits, dim=1)

    # Get predicted label (0 or 1)
    predicted_label = np.argmax(probabilities.numpy(), axis=1)[0]

    # Map the predicted label to a human-readable label
    label_map = {0: "Non-Toxic", 1: "Toxic"}
    output_label = label_map[predicted_label]

    return jsonify({
        'text': text,
        'predicted_label': output_label,
        'probabilities': probabilities.numpy().tolist()
    })
    
if __name__ == "__main__":
    app.run(debug=True)