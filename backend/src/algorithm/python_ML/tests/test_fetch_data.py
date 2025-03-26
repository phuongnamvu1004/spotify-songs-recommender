import pytest
import pandas as pd
from src.server.algorithm.python_ML.fetch_data import sql_query

def test_sql_query_returns_dataframe(mock_db_connection, sample_dataframe):
    # Arrange
    mock_db_connection.return_value.execute.return_value = sample_dataframe
    features = ["danceability", "energy", "loudness", "valence", "tempo"]
    
    # Act
    result = sql_query(features, "Songs", 3)
    
    # Assert
    assert isinstance(result, pd.DataFrame)
    assert len(result) == 3
    assert all(feature in result.columns for feature in features)

def test_sql_query_with_empty_features():
    # Arrange
    features = []
    
    # Act & Assert
    with pytest.raises(ValueError, match="Features list cannot be empty"):
        sql_query(features, "songs")

def test_sql_query_with_invalid_table():
    # Arrange
    features = ["danceability"]
    
    # Act & Assert
    with pytest.raises(ValueError, match="Table name cannot be empty"):
        sql_query(features, "")
