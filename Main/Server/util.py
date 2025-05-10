import json
import pickle
import numpy as np

__locations = None
__data_columns = None
__model = None

def load_saved_artifacts():
    print("Loading artifacts...")
    global __data_columns
    global __locations
    global __model

    try:
        with open("./artifacts/columns.json", "r") as f:
            __data_columns = json.load(f)['data_columns']
            __locations = __data_columns[3:]  # assuming first 3 are sqft, bath, bhk
        print("Loaded columns:", __data_columns)
    except Exception as e:
        print("Error loading columns.json:", e)

    try:
        with open("./artifacts/bangalore_home_prices_model.pickle", "rb") as f:
            __model = pickle.load(f)
        print("Model loaded successfully.")
    except Exception as e:
        print("Error loading model:", e)


def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(__model.predict([x])[0], 2)


def get_location_names():
    return __locations


def get_data_columns():
    return __data_columns
