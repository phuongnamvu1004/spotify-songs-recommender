from typing import List
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import sys
import os

# Path to the .env file
from constants import ENV_PATH

try:
    # Load environment variables
    load_dotenv(ENV_PATH)
    
    # Create database URL
    DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    
    # Create SQLAlchemy engine
    engine = create_engine(DATABASE_URL)
    
    # sql_query function to fetch data from the database
    def sql_query(select: List[str], table: str, limit: int = 1000) -> pd.DataFrame:
        """
        Fetch data from database
        
        Args:
            select (List[str]): Columns to select
            table (str): Table name
            limit (int, optional): Limit results. Defaults to 1000.
        
        Returns:
            pd.DataFrame: Results as DataFrame
        
        Raises:
            ValueError: If features list or table name is empty
        """
        if not select:
            raise ValueError("Features list cannot be empty")
        if not table:
            raise ValueError("Table name cannot be empty")
            
        query = f"SELECT {', '.join(select)} FROM \"{table}\" LIMIT {limit}"
        return pd.read_sql(query, engine)    

except Exception as e:
    print(f"Error occurred: {str(e)}")
    sys.exit(1)
