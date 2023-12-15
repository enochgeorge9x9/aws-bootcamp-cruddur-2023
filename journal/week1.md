# Week 1 — App Containerization
#### What is Docker?
![[Docker 101]]
#### What is App Containerization?

#### Containerize Backend.

##### Run backend application with flask locally

```bash
cd backend-flask
# setting up Env Vars for app.py to run properly
export FRONTEND_URL="*"
export BACKEND_URL="*"
python3 -m flask run --host=0.0.0.0 --port=4567
```

- Go to the browser: `http://localhost:4567/api/activities/home`
- Success ✅
![[assets\Pasted image 20231206163558.png]]
##### Add Dockerfile 🐋
```dockerfile TI:"backend-flask/Dockerfile"
# Getting the starting image from dockerhub
# Installing python image in the container
FROM python:3.10-slim-buster

# Creating a backend-flask folder in the container
WORKDIR /backend-flask

# Copying requirements file form host to container
COPY requirements.txt requirements.txt
# installing the requirement.txt in the container
RUN pip3 install -r requirements.txt

# copying all the files from host to container
COPY . .

# Set environemtn variables (Env Vars)
# Inside the container and remain there when container is running
ENV FLASK_ENV=development

EXPOSE ${PORT}
# CMD (Command)
# In the container CLI it will run: python3 -m flask run --host=0.0.0.0 --port=4567
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567" ]
```

###### Build the Docker Container
- Go to your root directory
```bash
cd aws-bootcamp-cruddur-2023
# -t=tag backend-flask 
# ./backend-flask: check the backend-flask directory for a Dockerfile
docker build -t backend-flask ./backend-flask
```

###### Run  the Docker Container
```bash

# --rm: remove when you stop the container
# -p: which port to host the app
# -it: 
docker run --rm -p 4567:4567 -it backend-flask

# or 

# setting up env vars to run the application properly
# -e: env list `set environment variables`
docker run --rm -p 4567:4567 -it -e FRONTEND_URL='*' -e BACKEND_ULR='*' backend-flask

# or 
# -d: run in the background
docker run --rm -p 4567:4567 -it -e FRONTEND_URL='*' -e BACKEND_ULR='*' -d backend-flask
```


#### Containerize Frontend.

##### Run locally the frontend application
```bash

cd frontend-vite
npm install
npm run dev
```
- Navigate to the browser:  **localhost:3000**
##### Add Dockerfile
```dockerfile title=aws-bootcamp-cruddur-2023/frontend-react-js/Dockerfile

# Make the workdir in host to /frontend-react-js
WORKDIR /frontend-react-js

# Copy all files from host to container ./frontend-react-js
COPY . .
# Install all packages in package.json
RUN npm install
#Expose the port you want to serve your app
EXPOSE ${PORT}
# Run the command: `npm start` to start the app
CMD ['npm', 'start']

```

- Add the following configs in your `vite.config.js`
```javascript TI:"vite.config.js"

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
    // eslint-disable-next-line no-undef
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react(), svgr()],
        server: {
            watch: {
                usePolling: true,
            },
            host: true, // needed for the Docker Container port mapping to work
            strictPort: true,
            port: 3000, // you can replace this port with any port
        },
        define: {
            // 'process.env.YOUR_STRING_VARIABLE': JSON.stringify(env.YOUR_STRING_VARIABLE),
            // 'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
            // If you want to exposes all env variables, which is not recommended
            'process.env': env,
        },
    };
});
```

#### Create a Docker Compose File to build and run multiple containers

```yaml TI:"aws-bootcamp-cruddur-2023/docker-compose.yml"

version: '3.8'
name: cruddar
services:
    backend-flask:
        environment:
            FRONTEND_URL: 'http://172.27.42.5:4000/'
            BACKEND_URL: 'http://172.27.42.5:5000/'
        build:
            context: ./backend-flask
            dockerfile: Dockerfile.dev
        ports:
            - '5000:4567'
        volumes:
            - ./backend-flask:/backend-flask
    frontend-vite:
        restart: unless-stopped
        env_file:
            - ./frontend-vite/.env
        build:
            context: ./frontend-vite
            dockerfile: Dockerfile.dev
        ports:
            - '4000:3000'
        volumes:
            - ./frontend-vite:/app
            - '/app/node_modules'
```

#### Security Steps and Tools to secure your container or app

![[Docker 101#Top 10 Security Best Practices]]

##### Tools To Secure your Application
- **Snyk Opensource Security:** automatically find and fix vulnerabilities in your code open source and containers. 
- **Secret Managment Tools**
	- **AWS Secret Manager**: Store and manage all your password or secrets in a AWS secret manager
	- **Hashicorp Vault**: Free open source secret manager, you will have to host yourself for the free version, and paid version they will do the heavy lifting for you. 
- **Image Vulnerability Scanning**
	- **Amazon Inspector -** Check for vulnerability in your container.
	- **Clair** - Open source you have to host yourself 
	- **Snyk Container Security** - Open sources container scanning for vulnerabilities. 

#### Create Notification for your Application

###### Document New Endpoint in OpenAPI Doc
- Added new API gateway for notification.
```yaml TI:"/backend-flask/openapi-3.0.yml"

/api/activities/notifications:
    get:
      description: 'Return a feed of notification for all those that I follow'
      tags:
        - activities
      parameters: []
      responses:
        '200':
          description: Return array of notifications
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Activity'
```

###### Add endpoint to backend-flask
```python TI:"backend-flask/services/notifications_activities.py"
from datetime import datetime, timedelta, timezone
class NotificationsActivities:
  def run():
    now = datetime.now(timezone.utc).astimezone()
    results = [{
      'uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
      'handle':  'Enoch George',
      'message': 'Learning is fun!',
      'created_at': (now - timedelta(days=2)).isoformat(),
      'expires_at': (now + timedelta(days=5)).isoformat(),
      'likes_count': 5,
      'replies_count': 1,
      'reposts_count': 0,
      'replies': [{
        'uuid': '26e12864-1c26-5c3a-9658-97a10f8fea67',
        'reply_to_activity_uuid': '68f126b0-1ceb-4a33-88be-d90fa7109eee',
        'handle':  'Worf',
        'message': 'This post has no honor!',
        'likes_count': 0,
        'replies_count': 0,
        'reposts_count': 0,
        'created_at': (now - timedelta(days=2)).isoformat()
      }],
    }
    ]
    return results


```

```python TI:"backend-flask/app.py"
from services.notifications_activities import *

@app.route("/api/activities/notifications", methods=['GET'])
def data_notification():
  data = NotificationsActivities.run()
  return data, 200
```

###### Add Notification feature in the frontend

```css TI:"src/pages/NotificationFeedPage.css"
article {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
```

```jsx TI:"src/pages/NotificationFeedPage.jsx"

import './NotificationFeedPage.css';
import React from 'react';

import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

// [TODO] Authenication
import Cookies from 'js-cookie';

export default function NotificationFeedPage() {
	const [activities, setActivities] = React.useState([]);
	const [popped, setPopped] = React.useState(false);
	const [poppedReply, setPoppedReply] = React.useState(false);
	const [replyActivity, setReplyActivity] = React.useState({});
	const [user, setUser] = React.useState(null);
	const dataFetchedRef = React.useRef(false);

	const loadData = async () => {
		try {
			// eslint-disable-next-line no-undef
			const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/notifications`;
			const res = await fetch(backend_url, {
				method: 'GET',
			});
			let resJson = await res.json();
			if (res.status === 200) {
				setActivities(resJson);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const checkAuth = async () => {
		console.log('🚀 ~ file: HomeFeedPage.jsx:40 ~ checkAuth ~ checkAuth:', 'checkAuth');
		// [TODO] Authentication
		if (Cookies.get('user.logged_in')) {
			setUser({
				display_name: Cookies.get('user.name'),
				handle: Cookies.get('user.username'),
			});
		}
	};

	React.useEffect(() => {
		//prevents double call
		if (dataFetchedRef.current) return;
		dataFetchedRef.current = true;

		checkAuth();
		loadData();
	}, []);

	return (
		<article>
			<DesktopNavigation user={user} active={'notifications'} setPopped={setPopped} />
			<div className='content'>
				<ActivityForm popped={popped} setPopped={setPopped} setActivities={setActivities} />
				<ReplyForm activity={replyActivity} popped={poppedReply} setPopped={setPoppedReply} setActivities={setActivities} activities={activities} />
				<ActivityFeed title='Notifications' setReplyActivity={setReplyActivity} setPopped={setPoppedReply} activities={activities} />
			</div>
			<DesktopSidebar user={user} />
		</article>
	);
}
```

#### Adding DynamoDB & Postgres in Docker

##### Postgres Docker compose
```yaml TI:"docker-compose.yaml"

services:
	pgadmin:
        image: dpage/pgadmin4
        container_name: pgadmin4
        restart: always
        ports:
            - '8888:80'
        environment:
            PGADMIN_DEFAULT_EMAIL: admin@gmail.com
            PGADMIN_DEFAULT_PASSWORD: password
        volumes:
            - pgadmin-data:/var/lib/pgadmin
        depends_on:
            - db

	db:
		image: postgres:13-alpine
		restart: always
		environment:
			- POSTGRES_USER=postgres
			- POSTGRES_PASSWORD=password
		ports:
			- '5432:5432'
		volumes:
			#map db volume to contianers postgres volume
			- "db:/var/lib/postgresql/data"
volumes:
	db:
		# Save the data in the local driver
		driver: local
	pgadmin-data:
```

###### To install Postgres Client into Gitpod [VidlInk](https://youtu.be/zA8guDqfv40?t=42735)
```sh 
	- name: postgres
	  init: |
		
```

##### DynamoDB Local Docker compose

```yaml TI:"docker-compose.yaml"
version: '3.8'
services:
# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
 dynamodb-local:
	 # We needed to add user:root to get this working
	user: root
	command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"
	image: "amazon/dynamodb-local:latest"
	container_name: dynamodb-local
	ports:
     - "8000:8000"
   volumes:
     - "./docker/dynamodb:/home/dynamodblocal/data"
   working_dir: /home/dynamodblocal
```

##### Complete Docker compose with postgres and dynamoDB

```yaml TI:"docker-compose.yaml" HL"29-62"
version: '3.8'
name: cruddar
services:
    backend-flask:
        environment:
            FRONTEND_URL: 'http://172.27.42.5:4000/'
            BACKEND_URL: 'http://172.27.42.5:5000/'
        build:
            context: ./backend-flask
            dockerfile: Dockerfile.dev
        ports:
            - '5000:4567'
        volumes:
            - ./backend-flask:/backend-flask
    frontend-vite:
        restart: unless-stopped
        env_file:
            - ./frontend-vite/.env
        # environment:
        #     REACT_APP_BACKEND_URL: 'http://172.27.42.5:5000/'
        build:
            context: ./frontend-vite
            dockerfile: Dockerfile.dev
        ports:
            - '4000:3000'
        volumes:
            - ./frontend-vite:/app
            - '/app/node_modules'
    db:
        image: postgres:13-alpine
        restart: always
        environment:
            - POSTGRES_USER=postgres
            - POSTGRES_PASSWORD=password
        ports:
            - '5432:5432'
        volumes:
            #map db volume to contianers postgres volume
            - 'db:/var/lib/postgresql/data'
    # https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
    dynamodb-local:
        # We needed to add user:root to get this working
        user: root
        command: '-jar DynamoDBLocal.jar -sharedDb -dbPath ./data'
        image: 'amazon/dynamodb-local:latest'
        container_name: dynamodb-local
        ports:
            - '8000:8000'
        volumes:
            - './docker/dynamodb:/home/dynamodblocal/data'
        working_dir: /home/dynamodblocal
# the name flag is a hack to change the default prepend folder
# name when outputting the image names
networks:
    internal-network:
        driver: bridge
        name: cruddur
volumes:
    # Save the data in the local driver
    db:
        driver: local

```
