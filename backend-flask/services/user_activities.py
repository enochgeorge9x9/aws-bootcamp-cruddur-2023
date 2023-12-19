from datetime import datetime, timedelta, timezone
# X-RAY ----------
from aws_xray_sdk.core import xray_recorder
class UserActivities:
    def run(user_handle):
        try:
            # X-RAY ----------
            # segment = xray_recorder.begin_segment('user_activities')

            model = {
                'errors': None,
                'data': None
            }
            now = datetime.now(timezone.utc).astimezone()
            # X-RAY ----------
            # dict = {
            #     'now': now.isoformat()
            # }
            # segment.put_metadata('activity', dict, '/api/activities/@<name_tag>')
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
                # subsegment = xray_recorder.begin_subsegment('user_found_mock_data')
                # dict = {
                #     "now": now.isoformat(),
                #     # "result-size": len(model['data'])
                # }
                # subsegment.put_metadata('key', dict, 'namespace')
                # xray_recorder.end_subsegment()
                model['data'] = results	 
        finally:
            # xray_recorder.end_subsegment()
            print('user_activity')
        return model