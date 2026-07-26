from app.database.database import engine, Base
from app.database import models

print("Registered tables:", list(Base.metadata.tables.keys()))

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")