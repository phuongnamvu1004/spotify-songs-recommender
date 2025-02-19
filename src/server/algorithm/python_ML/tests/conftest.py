import pytest
import pandas as pd
from sqlalchemy import create_engine

@pytest.fixture
def mock_db_connection(mocker):
    """Mock database connection"""
    mock_engine = mocker.patch('sqlalchemy.create_engine')
    return mock_engine

@pytest.fixture
def sample_dataframe():
    """Create a sample DataFrame for testing"""
    return pd.DataFrame({
        'danceability': [0.8, 0.7, 0.9],
        'energy': [0.6, 0.8, 0.7],
        'loudness': [-5.0, -4.0, -6.0],
        'valence': [0.5, 0.6, 0.4],
        'tempo': [120, 130, 140]
    })
