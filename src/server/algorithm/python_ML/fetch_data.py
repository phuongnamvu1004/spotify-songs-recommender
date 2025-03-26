from typing import List
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv
import sys
import os

# Path to the .env file
from constants import ENV_PATH

try:
    # Load environment variables
    load_dotenv(ENV_PATH)
    
    # Create database URL
    DATABASE_URL = os.getenv('DB_URL')
    
    # Create SQLAlchemy engine
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,  # Number of connections in the pool
        max_overflow=5,  # Additional connections allowed beyond the pool size
        pool_timeout=30,  # Timeout for getting a connection from the pool
        pool_recycle=1800,  # Recycle connections after 30 minutes
    )
    
    # sql_query function to fetch data from the database
    def sql_query(select: List[str], table: str, offset: int = 0, limit: int = 1000) -> pd.DataFrame:
        """
        Fetch data from database in batches.
        """
        if not select:
            raise ValueError("Features list cannot be empty")
        if not table:
            raise ValueError("Table name cannot be empty")
            
        query = f"SELECT {', '.join(select)} FROM \"{table}\" OFFSET {offset} LIMIT {limit}"
        return pd.read_sql(query, engine)   
    
    def fetch_all_data_in_batches(select: List[str], table: str, batch_size: int = 5000) -> pd.DataFrame:
        """
        Fetch all rows from the database in batches.

        Args:
            select (List[str]): Columns to select.
            table (str): Table name.
            batch_size (int): Number of rows to fetch per batch.

        Returns:
            pd.DataFrame: Combined DataFrame with all rows.
        """
        offset = 0
        all_data = pd.DataFrame()

        while True:
            # Fetch a batch of data
            batch = sql_query(select, table, offset=offset, limit=batch_size)
            
            # Break the loop if no more rows are returned
            if batch.empty:
                break
            
            # Append the batch to the combined DataFrame
            all_data = pd.concat([all_data, batch], ignore_index=True)
            
            # Increment the offset for the next batch
            offset += batch_size

        return all_data

except Exception as e:
    print(f"Error occurred: {str(e)}")
    sys.exit(1)
