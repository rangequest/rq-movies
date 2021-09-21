#!/bin/sh

echo "Waiting for MongoDB to start..."
./wait-for db:27017 

node seed.js

echo "Starting the server..."
npm start 