from psycopg_pool import ConnectionPool
import os
import re
import sys
from flask import current_app as app

class Db:
    def __init__(self):
        self.init_pool();
    
    def init_pool(self):
        connection_url = os.getenv("PROD_CONNECTION_URL")
        self.pool = ConnectionPool(connection_url)
    
    # Template to read SQL query statement from a file
    def template(self, *args):
        path = list((app.root_path,'db','sql')+ args)
        path[-1] = path[-1]+ '.sql'
        template_path = os.path.join(*path)

        bold = '\033[1m'
        blue = '\033[94m'
        no_color = '\033[0m'
        print(f'{blue}{bold}READING SQL FROM FILE PATH:  [{template_path}]-------{no_color}\n')

        with open(template_path, 'r') as f:
             template_content = f.read()
        return template_content 


    # Colorize your SQL print statement in your output terminal
    def print_sql(self,title, sql):
        cyan = '\033[96m'
        bold = '\033[1m'
        blue = '\033[94m'
        no_color = '\033[0m'
        print('\n')
        print(f'{cyan}{bold}SQL STATEMENT START -[{title.upper()}]--------{no_color}\n')
        print(f'{blue}{sql}{no_color}')
        print(f'{cyan}{bold}SQL STATEMENT END --------{no_color}\n')

    # we want to commit data such as an insert
    def query_commit(self, sql, params={}):
        self.print_sql('commit', sql)
        # checking if RETURNING string exits in the SQL statement
        pattern = r"\bRETURNING\b"
        is_returning_id = re.search(pattern,sql)
        try:
            with self.pool.connection() as conn:
                cur = conn.cursor()
                cur.execute(sql, params)
                #if return uuid exits, return the UUID
                if is_returning_id:
                    returning_id = cur.fetchone()[0]
                conn.commit()
                if is_returning_id:
                    return returning_id
        except Exception as error:
                self.print_sql_error(error)
                # conn.rollback()

    # when we want to return a json object
    def query_object_json(self, sql, params={}):
        self.print_sql('object', sql)
        wrapped_sql = self.query_wrap_object(sql)
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
            # this will return a tuple
            # the first field being the data
                cur.execute(wrapped_sql, params)
                json = cur.fetchone()
                return json[0]
    
    # when we want to return a an array of json objects
    def query_array_json(self, sql, params = {}):
        self.print_sql('array', sql)
        wrapped_sql = self.query_wrap_array(sql)
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
            # this will return a tuple
            # the first field being the data
                cur.execute(wrapped_sql, params)
                json = cur.fetchone()
                return json[0]


    def query_wrap_object(self,template):
        sql = f""" 
        (SELECT COALESCE(row_to_json(object_row), '{{}}'::json) FROM (
            {template}
        ) object_row);
        """
        return sql

    # Convert Array to json format, if null return empty json
    def query_wrap_array(self,template):
        sql = f""" 
        (SELECT COALESCE(array_to_json(array_agg(row_to_json(array_row))), '[]'::json) FROM (
            {template}
        ) array_row) """
        return sql

    # define a function that handles and parses psycopg2 exceptions [https://kb.objectrocket.com/postgresql/python-error-handling-with-the-psycopg2-postgresql-adapter-645]
    def print_sql_error(self,err):
        # get details about the exception
        err_type, err_obj, traceback = sys.exc_info()

        # get the line number when exception occured
        line_num = traceback.tb_lineno

        # print the connect() error
        print ("\npsycopg2 ERROR:", err, "on line number:", line_num)
        print ("psycopg2 traceback:", traceback, "-- type:", err_type)

        # print the pgcode and pgerror exceptions
        # print ("pgerror:", err.pgerror)
        # print ("pgcode:", err.pgcode, "\n")



        
db = Db();