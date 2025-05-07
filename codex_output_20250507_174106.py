FastAPI is a modern, fast (high-performance), web framework for building APIs with Python. Here's a basic example of how you could write a FastAPI route to fetch user goals from a database:

```python
from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel

# Assuming we've imported and configured our database somehow
from .database import Session, engine, Base

app = FastAPI()

# Defining a Pydantic model for UserGoals
class UserGoal(BaseModel):
    id: int
    user_id: int
    goal: str

@app.get("/user_goals/{user_id}", response_model=List[UserGoal])
async def fetch_user_goals(user_id: int):
    session = Session()
    user_goals = session.query(UserGoal).filter(UserGoal.user_id == user_id).all()
    if user_goals is None:
        raise HTTPException(status_code=404, detail="No goals found for this user")
    return user_goals
```

In this example, the `@app.get("/user_goals/{user_id}")` decorator tells FastAPI that this function is a route that should handle GET requests at the `/user_goals/{user_id}` endpoint. 

The `{user_id}` signifies a dynamic part of the URL path: when you call the endpoint, you replace `{user_id} `with the actual user_id you want to query. FastAPI automatically interprets it from the URL path as an integer because of the `user_id: int` function argument.

The `response_model=List[UserGoal]` indicates that the endpoint will result in a list of UserGoal models. FastAPI will use this for generating an accurate OpenAPI schema, and it will also automatically convert outgoing data to match this schema.