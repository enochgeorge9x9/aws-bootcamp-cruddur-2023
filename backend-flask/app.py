from flask import Flask,request
from flask_cors import CORS, cross_origin
import os
import logging

# Cognito JWT Token -----
from lib.cognito_jwt_token import CognitoJwtToken,TokenVerifyError

from services.home_activities import *
from services.notifications_activities import *
from services.user_activities import *
from services.create_activity import *
from services.create_reply import *
from services.search_activities import *
from services.message_groups import *
from services.messages import *
from services.create_message import *
from services.show_activity import *
# XRay --------
# from aws_xray_sdk.core import xray_recorder
# from aws_xray_sdk.ext.flask.middleware import XRayMiddleware

# CloudWatch Logs ----
# import watchtower
# import logging
# from time import strftime

## Rollbar ----
import os
import rollbar
import rollbar.contrib.flask
from flask import got_request_exception

app = Flask(__name__)
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
if __name__ == "__main__":
  app.run(debug=True)

# Cognito JWT Token -----
cognito_jwt_token = CognitoJwtToken(
  user_pool_id=os.getenv('AWS_COGNITO_USER_POOLS_ID'),
  user_pool_client_id=os.getenv('AWS_COGNITO_CLIENT_ID'),
  region=os.getenv('AWS_COGNITO_REGION')
)

# XRay --------
# xray_url = os.getenv("AWS_XRAY_URL")
# xray_recorder.configure(service='Cruddur', dynamic_naming=xray_url)
# XRayMiddleware(app, xray_recorder)

# CloudWatch Logs ------
# LOGGER = logging.getLogger(__name__)
# LOGGER.setLevel(logging.DEBUG)
# console_handler= logging.StreamHandler()
# cw_handler = watchtower.CloudWatchLogHandler(log_group='cruddur')
# LOGGER.addHandler(console_handler)
# LOGGER.addHandler(cw_handler)
# LOGGER.info("Currently in app.py file")

frontend = os.getenv('FRONTEND_URL') # FRONTEND_URL='http://172.27.42.5:4000'
backend = os.getenv('BACKEND_URL') # BACKEND_URL='http://172.27.42.5:5000'
origins = [frontend, backend]
cors = CORS(
    app, 
    resources={r"/api/*": {"origins": origins}},
    headers=['Content-Type', 'Authorization'],
    expose_headers = 'Authorization',
    methods="GET,OPTIONS,HEAD,POST",
)


# CloudWatch Logs ------
# Log an error after every single request
# @app.after_request
# def after_request(response):
#     timestamp = strftime('[%Y-%b-%d %H:%M]')
#     LOGGER.error('%s %s %s %s %s %s', timestamp, request.remote_addr, request.method, request.scheme, request.full_path, response.status)
#     return response

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

# API endpoint which will cause error, to check rollbar is logging the error in their portal
# BROKEN API ROUTE
@app.route('/rollbar/test')
def rollbar_test():
    rollbar.report_message('/rollbar/test: Hello Rollbar Test endpoint', 'warning')
    x = None
    x[0] = 10
    return "Hello Rollbar Test endpoint"

@app.route("/api/activities/home", methods=['GET'])
def data_home():
  access_token = CognitoJwtToken.extract_access_token(request.headers, 'Authorization')
  try:
    claims = cognito_jwt_token.verify(access_token)
    app.logger.debug('Authenticated Cognito User -----')
    cognito_user_id = claims['sub']
    app.logger.debug(cognito_user_id)
    data = HomeActivities.run(cognito_user_id=cognito_user_id)
    return data,200
  except TokenVerifyError as e:
    app.logger.error('Unauthenticated User')
    data = HomeActivities.run()
    return data,200


@app.route("/api/message_groups", methods=['GET'])
def data_message_groups():
  user_handle  = 'andrewbrown'
  model = MessageGroups.run(user_handle=user_handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200

@app.route("/api/messages/@<string:handle>", methods=['GET'])
def data_messages(handle):
  user_sender_handle = 'andrewbrown'
  user_receiver_handle = request.args.get('user_reciever_handle')

  model = Messages.run(user_sender_handle=user_sender_handle, user_receiver_handle=user_receiver_handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

@app.route("/api/messages", methods=['POST','OPTIONS'])
@cross_origin()
def data_create_message():
  user_sender_handle = 'andrewbrown'
  user_receiver_handle = request.json['user_receiver_handle']
  message = request.json['message']

  model = CreateMessage.run(message=message,user_sender_handle=user_sender_handle,user_receiver_handle=user_receiver_handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return


@app.route("/api/activities/notifications", methods=['GET'])
def data_notification():
  data = NotificationsActivities.run()
  return data, 200

@app.route("/api/activities/@<string:handle>", methods=['GET'])
def data_handle(handle):
  model = UserActivities.run(handle)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200

@app.route("/api/activities/search", methods=['GET'])
def data_search():
  term = request.args.get('term')
  model = SearchActivities.run(term)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

@app.route("/api/activities", methods=['POST','OPTIONS'])
@cross_origin()
def data_activities():
  user_handle  = request.json['user_handle']
  message = request.json['message']
  ttl = request.json['ttl']
  CreateActivityObj = CreateActivity(message, user_handle, ttl)
  model = CreateActivityObj.run()
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200


@app.route("/api/activities/<string:activity_uuid>", methods=['GET'])
def data_show_activity(activity_uuid):
  data = ShowActivities.run(activity_uuid=activity_uuid)
  return data, 200

@app.route("/api/activities/<string:activity_uuid>/reply", methods=['POST','OPTIONS'])
@cross_origin()
def data_activities_reply(activity_uuid):
  user_handle  = 'andrewbrown'
  message = request.json['message']
  model = CreateReply.run(message, user_handle, activity_uuid)
  if model['errors'] is not None:
    return model['errors'], 422
  else:
    return model['data'], 200
  return

