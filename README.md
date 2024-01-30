
# Real Time Chat App

This project uses Web Sockets to perform real time chatting.

The features are based on the homework section of the [Socket.io docs](https://socket.io/get-started/chat#homework).

- Support of nicknames / profile pictures.
- **Insecure** authentication.
- Messages and Users are saved in database.
- "Typing" message when a user is typing.
## Tech Stack

**Client:** VueJS as a single page application

**Server:** Node, ExpressJS

**Database:** Sqlite3

**Libs:** Socket.io, Axios, Bootstrap CSS


## Deployment

#### Prerequisites

- Node >= v20

To deploy this project on your Linux machine, first clone the repo:

```bash
  git clone https://github.com/Rayanworkout/Real_Time_Chat_App.git
```
### Option 1: Development mode
To deploy the app in Dev mode (separate frontend and backend) you need to `cd` into the project's folder and run the `dev_deploy.sh` script
(you may need to make the script executable).

This script will install all dependancies and run both servers in the background. When you're done, kill them by running `killall node`
```bash
cd Real_Time_Chat_App
sudo chmod +x ./dev_deploy.sh
./dev_deploy.sh
```

Alternatively, you can manually install dependancies for both the frontend and the backend and run servers yourself.

```bash
cd Real_Time_Chat_App
cd ./frontend && npm i
cd ../backend && npm i

nohup node server.js &
cd ../frontend
nohup npm run dev &
```

You can now access [http://localhost:5173](http://localhost:5173) and use the app.

### Option 2: Production mode

To deploy the App in production, the steps are almost the same. In Prod, the app is built inside a `dist/` folder and static files are served by express for better performance.

Once the repo is cloned, `cd` into the project folder and run `./prod_deploy.sh`

```bash
git clone https://github.com/Rayanworkout/Real_Time_Chat_App.git
cd Real_Time_Chat_App
sudo chmod +x ./prod_deploy.sh
./prod_deploy.sh
```

You can now access [http://localhost:3000](http://localhost:3000) and use the app.

## License

[MIT](https://choosealicense.com/licenses/mit/)

