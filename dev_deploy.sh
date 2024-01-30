#!/bin/bash


RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Stop if an error occurs
set -e

# Install dependencies

echo "> Installing dependencies ..."
cd ./frontend
npm i

cd ../backend
npm i
cd ..
echo -e "${BLUE}> Dependencies ok${NC}"


echo -e "> Starting backend server ...${NC}"

cd ./backend
nohup npm run start &

echo -e "${BLUE}> Backend server ok${NC}"
echo "> Starting frontend server ..."

cd ../frontend

nohup npm run dev &

echo -e "${BLUE}> Frontend server ok${NC}"

echo -e "${GREEN}-------------------------------------------------------------"
echo "Server started, app is now available at http://localhost:5173"
echo -e "-------------------------------------------------------------${NC}"
echo -e "-> Run ${RED}killall node${NC} to stop the server"
echo -e "-> Or alternatively ${RED}lsof -i :3000 and kill -9 <PID>${NC} both for frontend and backend${NC}"
echo
echo -e ${GREEN}"Enjoy !${NC}"
echo "-------------------------------------------------------------"
