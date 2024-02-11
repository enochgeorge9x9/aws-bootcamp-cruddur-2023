import json
import os
import psycopg2

def lambda_handler(event, context):
    user = event['request']['userAttributes']
    print("User Details ----------")
    print(user)
    conn = None
    sql = f"""
        INSERT INTO public.users (display_name, email, handle, cognito_user_id)
        VALUES('{user["name"]}', '{user["email"]}', '{user["preferred_username"]}', '{user["sub"]}');
        """
    print("SQL Statement Start----------")
    print(sql)
    print("SQL Statement End----------")
    try:
       conn = psycopg2.connect(os.getenv('PROD_CONNECTION_URL'))
       cur = conn.cursor()
       cur.execute(sql)
       conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            cur.close()
            conn.close()
            print('Database connection closed.')
    
    return event