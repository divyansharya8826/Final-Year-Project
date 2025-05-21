ToxiScan - Toxicity Detection System
====================================

Overview
--------
ToxiScan is a deep learning-based web application for detecting toxic content in text. It uses a fine-tuned transformer model to analyze user-submitted text and provides a toxicity assessment with confidence scores. The platform is built with Flask and leverages HuggingFace Transformers for model inference.

Project Structure
-----------------
- app.py                : Main Flask application and API endpoints.
- requirements.txt      : Python dependencies.
- static/
    css/styles.css      : Main stylesheet for the web UI.
    js/script.js        : Frontend logic for text submission and result display.
    logo/               : Project logo assets.
- templates/
    index.html          : Home page with text analysis form.
    contact.html        : Help & contact page with FAQ and contact form.
- LaBSE/                : Directory containing the pre-trained model and tokenizer files.
- base/                 : Python virtual environment (not tracked by git).

Setup Instructions
------------------
1. **Clone the repository** and navigate to the project directory.

2. **Create and activate a virtual environment** (optional but recommended):
    ```
    python3 -m venv base
    source base/bin/activate
    ```

3. **Install dependencies**:
    ```
    pip install -r requirements.txt
    ```

4. **Ensure the LaBSE model files are present** in the `LaBSE/` directory. These include:
    - config.json
    - model.safetensors
    - special_tokens_map.json
    - tokenizer_config.json
    - tokenizer.json
    - vocab.txt

5. **Run the application**:
    ```
    python app.py
    ```
    The app will be available at `http://127.0.0.1:5000/`.

Usage
-----
- Go to the home page.
- Enter or paste text in the input box and click "Analyze Content".
- The app will display whether the content is toxic or non-toxic, along with confidence scores.
- Visit the "Help & Contact" page for support or to send a message.

API Endpoint
------------
- `POST /api/predict_sentiment`
    - Form data: `text` (string)
    - Returns: JSON with `predicted_label` and `probabilities`.

Notes
-----
- The model is loaded from the `LaBSE/` directory on each API call for simplicity. For production, consider loading the model once at startup for better performance.
- The virtual environment (`base/`) and model files (`LaBSE/`) are excluded from version control via `.gitignore`.

License
-------
This project is for academic and demonstration purposes.

Contact
-------
For help or questions, use the contact form on the website or email: support@toxiscan.ai
