import os
import sys
import json

def check_project_structure():
    """Check if the project structure is correct and files exist"""
    current_dir = os.getcwd()
    print(f"Current directory: {current_dir}")
    
    # Check for frontend files
    frontend_files = ['app.html', 'app.js', 'app.css']
    for file in frontend_files:
        if os.path.exists(file):
            print(f"✓ {file} exists")
        else:
            print(f"✗ {file} does not exist")
    
    # Check for backend files
    backend_files = ['server.py', 'util.py']
    for file in backend_files:
        if os.path.exists(file):
            print(f"✓ {file} exists")
        else:
            print(f"✗ {file} does not exist")
    
    # Check for artifacts directory
    artifacts_dir = 'artifacts'
    if os.path.exists(artifacts_dir) and os.path.isdir(artifacts_dir):
        print(f"✓ {artifacts_dir} directory exists")
        
        # Check for model and columns file
        columns_file = os.path.join(artifacts_dir, 'columns.json')
        if os.path.exists(columns_file):
            print(f"✓ {columns_file} exists")
            # Check if columns.json is valid JSON
            try:
                with open(columns_file, 'r') as f:
                    data = json.load(f)
                if 'data_columns' in data:
                    print(f"✓ {columns_file} has valid structure with {len(data['data_columns'])} columns")
                    locations = data['data_columns'][3:]  # First 3 columns are sqft, bath, bhk
                    print(f"✓ {len(locations)} locations found")
                else:
                    print(f"✗ {columns_file} does not have 'data_columns' key")
            except json.JSONDecodeError:
                print(f"✗ {columns_file} is not valid JSON")
        else:
            print(f"✗ {columns_file} does not exist")
            
        model_file = os.path.join(artifacts_dir, 'banglore_home_prices_model.pickle')
        if os.path.exists(model_file):
            print(f"✓ {model_file} exists")
        else:
            print(f"✗ {model_file} does not exist")
    else:
        print(f"✗ {artifacts_dir} directory does not exist")
    
    # Check Flask installation
    try:
        import flask
        print(f"✓ Flask is installed (version {flask.__version__})")
    except ImportError:
        print("✗ Flask is not installed")
    
    # Check CORS installation
    try:
        import flask_cors
        print(f"✓ Flask-CORS is installed")
    except ImportError:
        print("✗ Flask-CORS is not installed")
    
    # Check NumPy installation
    try:
        import numpy
        print(f"✓ NumPy is installed (version {numpy.__version__})")
    except ImportError:
        print("✗ NumPy is not installed")
    
    # Check Scikit-learn installation
    try:
        import sklearn
        print(f"✓ Scikit-learn is installed (version {sklearn.__version__})")
    except ImportError:
        print("✗ Scikit-learn is not installed")

if __name__ == "__main__":
    check_project_structure()