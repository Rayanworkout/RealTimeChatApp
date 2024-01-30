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


echo "> Starting build process ..."
cd ./frontend

npm run build

echo -e "${BLUE}> Build ok${NC}"

echo "> Copying dist folder to ./backend/public ..."
cd ..
mkdir -p ./backend/public/dist
cp -r ./frontend/dist ./backend/public/

echo -e "${BLUE}> Copy ok, app is now served by express${NC}"

echo "> Starting App ..."
cd ./backend

nohup npm run start &

echo -e "${GREEN}-------------------------------------------------------------"
echo "Server started, app is now available at http://localhost:3000"
echo -e "-------------------------------------------------------------${NC}"
echo -e "-> Run ${RED}killall node${NC} to stop the server"
echo -e "-> Or alternatively ${RED}lsof -i :3000 and kill -9 <PID>${NC}"
echo
echo -e ${GREEN}"Enjoy !${NC}"
echo "-------------------------------------------------------------"
