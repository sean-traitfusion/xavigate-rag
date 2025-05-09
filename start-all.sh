#!/bin/bash

echo "🚀 Starting Xavigate backend..."
cd backend
uvicorn api:app --reload --port 8010 &
cd ..

echo "🌐 Starting Xavigate frontend..."
cd frontend
npm run dev
