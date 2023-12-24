# Week 2 — Distributed Tracing

### Technical Tasks
- Instrument our backend flask application to use Open Telemetry (OTEL) with Honeycomb.io as the provider
- Run queries to explore traces within Honeycomb.io
- Instrument AWS X-Ray into backend flask application
- Configure and provision X-Ray daemon within docker-compose and send data back to X-Ray API
- Observe X-Ray traces within the AWS Console
- Integrate Rollbar for Error Logging
- Trigger an error an observe an error with Rollbar
- Install WatchTower and write a custom logger to send application log data to CloudWatch Log group
### Weekly Outcome
- The fractional CTO has suggested that we implement distributed tracing first so because as we begin to add cloud services it will become difficult to pinpoint issue and we want to keep pace with the (probably unrealistic) development timeline

### Homework Challenges 
- [ ] Instrument Honeycomb for the frontend-application to observe network latency between frontend and backend[HARD]
- [ ] Add custom instrumentation to Honeycomb to add more attributes eg. UserId, Add a custom span
- [ ] Run custom queries in Honeycomb and save them later eg. Latency by UserID, Recent Traces

### Journal

#### What is Distributed Tracing? 
- Distributed tracing is like a detective following clues to figure out how things work in your application. 
![[assets/Pasted image 20231215135349.png]]

#### Honeycomb.io [Link](https://www.honeycomb.io/)
##### What is Honeycomb?

Honeycomb is a web application that helps you quickly make sense of the billions of rows of data needed to fully represent the user experience in your complex, unpredictable systems. You get better uptime, higher-quality and faster user experiences, more time for innovation, and better business outcomes—the markers of high-performance engineering teams.

TODO: DO THIS AGAIN SOMETHING IS WRONG WITH THEIR INSTALLATION DOC. [VID LINK](https://youtu.be/zA8guDqfv40?t=46364)
##### Setup Honeycomb in your backend 
- [Login](https://ui.honeycomb.io/login) in to your dashboard
- Create a Curddur Environment
	- Keep note of your **API Key**
- Setting up OpenTelemetry for Python [Doc](https://docs.honeycomb.io/getting-data-in/opentelemetry/python-distro/)
```txt TI:"backend-flask/requirements.txt"
opentelemetry-api
opentelemetry-sdk
opentelemetry-exporter-otlp-proto-http
opentelemetry-instrumentation-flask
opentelemetry-instrumentation-requests
```
- Install the above packages 
	-  `pip install -r requirements.txt`
- Setup your environment variables
```dotenv TI:"backend-flask/.env"
OTEL_SERVICE_NAME="backend-flask"
HONEYCOMB_API_KEY="your-api-key"
```

- Add the following codes to your app.py file
```python TI:"backend-flask/app.py"

# Honeycomb --------
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# Honeycomb --------
# Initialize tracing and an exporter that send data to Honeycomb
provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

# Honeycomb --------
# Initialize automatic instrumentation with Flask
app = Flask(__name__)
FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

```

#### Observability - Centralized Tracing for Security & Speed in AWS Cloud
- Logging & Application Workloads
- Monolith Application
- Microservices
- Distributed Services
- Traditional Logging System
![[assets/Pasted image 20231216122848.png]]
##### Why logging is cumbersome?
- Time Consuming
- Tons of data with no context for Why of the security events?
- Needle in a haystack to find things
- Monolith vs Services vs Microservices
- Modern Applications are distributed
- Increase Alert Fatigue for SOC teams & application teams (SREs, DevOps etc)

##### Why Observability
- Decreased Alert Fatigue for Security Operation Teams
- Visibility of end2end of Logs, metrics & tracing
- Troubleshoot and resolve things quickly without costing too much money
- Understand application health
- Accelerate collaboration between teams
- Reduce overall operational cost
- increase customer satisfaction

##### Observability vs Monitoring
Observability is a way to breakout multiple processes and helps us to find metrics, traces and logs
![[assets/Pasted image 20231216123950.png]]
##### Observability 3 pillars
- Metrics 
- Traces
- Logs
##### AWS Observability Services
- AWS CloudWatch Logs
- AWS CloudWatch Metrics
- AWS X Ray Traces
![[assets/Pasted image 20231216124233.png]]

##### Tracing
![[assets/Pasted image 20231216125407.png]]

##### Building Security Metrics, Logs for Tracing
- What Application? (Crown Jewels)
- Type of application (compute, monolith, microservices)
- Threat modelling session
- Identity attack vectors
- Map attack vectors to TTP in Attack MITRE Framework
- Identify instrumentation agents to create tracing (CloudWatch or FireLens agent, 3rd party agents etc)
- AWS services like AWS Distro for OpenTelemetry (ADOT) for metrics and traces
- Dashboard for practical attack vectors only for that application
- Repeat for next application. 

#### AWS X-Ray

- AWS X-Ray makes it easy for developers to analyze the behavior of their distributed applications by providing request tracing, exception collection and profiling capabilities. 
	- Debugging
	- Tracing
	- Service Map

- What are the best practices for setting up x-ray daemon?[Link](https://stackoverflow.com/questions/54236375/what-are-the-best-practises-for-setting-up-x-ray-daemon)
![[assets/Pasted image 20231216212859.png]]


##### AWS SDK [Docs](https://docs.aws.amazon.com/)
![[assets/Pasted image 20231216213424.png]]

- Select the documentation for the language your want to implement the AWS SDK
- In this study we will be using python for our flask application
##### Setup Instrument AWS X-Ray for Flask

Add to the `requirements.txt`
```txt TI:"reqirements.txt"
aws-xray-sdk
```

Install python dependencies
```sh
pip install -r requirements.txt
```

Add to .env
```env TI:".env"
#AWS XRAY
AWS_XRAY_URL='http://172.27.42.5:5000/'
AWS_XRAY_DAEMON_ADDRESS="xray-daemon:2000"
```

Add to `app.py`
```python TI:"app.py"
# X-RAY --------
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.ext.flask.middleware import XRayMiddleware

app = Flask(__name__)
# X-RAY --------
xray_url = os.getenv("AWS_XRAY_URL")
xray_recorder.configure(service='backend-flask', dynamic_naming=xray_url)
XRayMiddleware(app, xray_recorder)
 


```

###### Setup AWS X-Ray Resources

Add `aws/json/xray.json`
```json TI:"xray.json"
{
    "SamplingRule":{
        "RuleName": "Cruddur",
        "ResourceARN":"*",
        "Priority": 9000,
        "FixedRate":0.1,
        "ReservoirSize":5, 
        "ServiceName": "backend-flask",
        "ServiceType": "*",
        "Host": "*",
        "HTTPMethod": "*",
        "URLPath":"*",
        "Version": 1
    }
}
```

```sh
## Source: https://docs.aws.amazon.com/xray/latest/devguide/xray-api-configuration.html#xray-api-configuration-groups
## <!-- Create group for XRay Logs-->

aws xray create-group --group-name "Cruddur" --filter-expression "service(\"backend-flask\")"
```
	
**To check if it was added to X-Ray group**
Go to `CloudWatch > Settings > Traces > X-Ray Traces > Groups - View Settings`
![[assets/Pasted image 20231216221111.png]]

![[assets/Pasted image 20231216221131.png]]

###### Create Sampling Rule
```sh
aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json 
```

##### Install X-RAY Daemon

__GitHub aws-xray-daemon X-Ray Docker compose example
wget__ 

```bash
https://s3.us-east-2.amazonaws.com/aws-xray-assets.us-east-2/xray-daemon/aws-xray-daemon-3.x.deb
sudo dpkg -i **.deb
```

###### Add Daemon Service to Docker Compose
```yaml TI:"docker-compose.yml"

services:
	xray-daemon:
		image: "amazon/aws-xray-daemon"
		environment:
			AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
			AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
			AWS_REGION: "${AWS_DEFAULT_REGION}"
		command:
		  - "xray -o -b xray-daemon:2000"
		ports:
		  - 2000:2000/udp

```

###### Start a custom segment/subsegment
Adding custom tracers for particular endpoints, to know specifically know where the endpoints are hitting. 
**Default begin/end functions:**

```python TI:"example.py"

from aws_xray_sdk.core import xray_recorder

segment = xray_recorder.begin_segment('segment_name')
dict = {
	'now': now.isoformat()
	}
# Add metadata or annotation here if necessary
segment.put_metadata('key', dict, 'namespace')

subsegment = xray_recorder.begin_subsegment('subsegment_name')
subsegment.put_annotation('key', 'value')
#Do something here

subsegment2 = xray_recorder.begin_subsegment('subsegment_name_2')
subsegment2.put_annotation('key2', 'value2')
#Do something here
xray_recorder.end_subsegment()

```

```python TI:"backend-flask\services\user_activities.py"
from datetime import datetime, timedelta, timezone
# X-RAY ----------
from aws_xray_sdk.core import xray_recorder
class UserActivities:
    def run(user_handle):
        try:
            # X-RAY ----------
            segment = xray_recorder.begin_segment('user_activities')

            model = {
                'errors': None,
                'data': None
            }
            now = datetime.now(timezone.utc).astimezone()
            # X-RAY ----------
            dict = {
                'now': now.isoformat()
            }
            segment.put_metadata('activity', dict, '/api/activities/@<name_tag>')
            if user_handle == None or len(user_handle) < 1:
                model['errors'] = ['blank_user_handle']
            else:
                now = datetime.now()
                results = [{
                'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
                'handle':  'Andrew Brown',
                'message': 'Cloud is fun!',
                'created_at': (now - timedelta(days=1)).isoformat(),
                'expires_at': (now + timedelta(days=31)).isoformat()
                }]
                  # X-RAY ----------
                subsegment = xray_recorder.begin_subsegment('user_found_mock_data')
                dict = {
                    "now": now.isoformat(),
                    # "result-size": len(model['data'])
                }
                subsegment.put_metadata('key', dict, 'namespace')
                xray_recorder.end_subsegment()
                model['data'] = results	 
        finally:
            xray_recorder.end_subsegment()
        return model
```

###### Check if everything is running properly
- Run `docker compose up -d --build`
- Go to : `http://172.27.42.5:5000/api/activities/home`
- Go back to `CloudWatch > X-Ray traces > Traces`
- You will have to wait awhile for traces to show up
![[assets/Pasted image 20231218214301.png]]
![[assets/Pasted image 20231218214222.png]]

#### AWS CloudWatch Logs for Flask App
Add to the requirements.txt
```txt TI:"requirements.txt"
watchtower
```

Set .env variables for AWS Credentials
```dotenv TI:".env"
AWS_ACCESS_KEY_ID = "${AWS_ACCESS_KEY_ID}"
AWS_SECRET_ACCESS_KEY =  "${AWS_SECRET_ACCESS_KEY}"
AWS_DEFAULT_REGION = "${AWS_DEFAULT_REGION}"
```

or setup environment variables in docker-compose file
```yaml TI:"docker-compose.yaml"
services:
    backend-flask:
        environment:
            AWS_ACCESS_KEY_ID: '${AWS_ACCESS_KEY_ID}'
            AWS_SECRET_ACCESS_KEY: '${AWS_SECRET_ACCESS_KEY}'
            AWS_DEFAULT_REGION: '${AWS_DEFAULT_REGION}'
        env_file:
            - ./backend-flask/.env
        build:
            context: ./backend-flask
            dockerfile: Dockerfile.dev
        ports:
            - '5000:4567'
        volumes:
            - ./backend-flask:/backend-flask
```

Import the packages and configure the `LOGGER` in root folder

```python TI:"app.py"
# CloudWatch Logs ----
import watchtower
import logging
from time import strftime

app = Flask(__name__)

# CloudWatch Logs ------
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.DEBUG)
console_handler= logging.StreamHandler()
cw_handler = watchtower.CloudWatchLogHandler(log_group='cruddur')
LOGGER.addHandler(console_handler)
LOGGER.addHandler(cw_handler)
LOGGER.info("Currently in app.py file")

# CloudWatch Logs ------
# Log an error after every single request
@app.after_request
def after_request(response):
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    LOGGER.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
    return response
```

We’ll log something in an API endpoint
```python TI:"app.py"
@app.route("/api/activities/home", methods=['GET'])
def data_home():
  data = HomeActivities.run(LOGGER) #pass logger intance in home activities endpoint
  return data, 200
```

```python TI:"backend-flask\services\home_activities.py"
from datetime import datetime, timedelta, timezone
class HomeActivities:
  def run(logger):
    logger.info('hello_from_api_end_point: /api/activities/home')
    now = datetime.now(timezone.utc).astimezone()
    results = [{
      'uuid': '68f126b0-1ceb-4a33-8
      .
      .
      .
      .
      
```

- Startup the application, and go to different endpoints where you setup your `logger`
- To check go to your AWS CloudWatch: `CloudWatch > Logs > Log Groups > <your_log_name>`
![[assets/Pasted image 20231217180222.png]]

![[assets/Pasted image 20231217180416.png]]




#### HOW TO: Find a career path and build a learning plan.
[starttime](https://youtu.be/zA8guDqfv40?t=57267)
[endtime](https://youtu.be/zA8guDqfv40?t=60399)

##### Rollbar [Link](https://rollbar.com/)

Rollbar provides full coverage across all the applications that your users depend on and love. Automate real-time error response, ensure happier customers, and more productive development teams.

###### Create a new project in Rollbar called Cruddur

**Add to `requirement.txt`**
```txt TI:"requirement.txt"
blinker
rollbar
```

**Install deps**
```sh
pip install -r requirements.txt
```

**We need to set our access token**
```sh
export ROLLBAR_ACCESS_TOKEN=""
```
OR 
```dotenv TI:".env"
ROLLBAR_ACCESS_TOKEN=""
```


**Add Rollbar to your Flask Application**
```python TI:"app.py"
from flask import Flask
app = Flask(__name__)

## Rollbar ----
import os
import rollbar
import rollbar.contrib.flask
from flask import got_request_exception

## Rollbar ----
rollbar_access_token = os.getenv('ROLLBAR_ACCESS_TOKEN')
with app.app_context():
    """init rollbar module"""
    rollbar.init(
        # access token
        rollbar_access_token,
        # environment name
        'production',
        # server root directory, makes tracebacks prettier
        root=os.path.dirname(os.path.realpath(__file__)),
        # flask already sets up logging
        allow_logging_basic_config=False)

    # send exceptions from `app` to rollbar, using flask's signal system.
    got_request_exception.connect(rollbar.contrib.flask.report_exception, app)
```

**We’ll add an endpoint just for testing rollbar to `app.py`**
```python TI:"app.py"
# API endpoint which will cause error, to check rollbar is logging the error in their portal
# BROKEN API ROUTE
@app.route('/rollbar/test')
def rollbar_test():
	rollbar.report_message('/rollbar/test: Hello Rollbar Test endpoint', 'warning')
    x = None
    x[0] = 10
    return "Hello Rollbar Test endpoint"```

**Start your Flask app and go to `/rollbar/test`** and then navigate to the rollbar dashboard.
![[assets/Pasted image 20231218201750.png]]

![[assets/Pasted image 20231218201811.png]]
