# Week 4 — Postgres and RDS (SQL Database)

### Technical Tasks
In this class, we are going to:
- Have a lecture about data modelling in (3rd Normal Form) 3NF for SQL
- Launch Postgres locally via a container
- Seed our Postgres Database table with data
- Write a Postgres adapter
- Write a DDL (Data Definition Language) (for creating schema)
- Write an SQL read query
- Write an SQL write query
- Provision an RDS Postgres instance
- Configure VPC Security Groups
- Configure local backend application to use production connection URL
- Add a caching layer using Momento Serverless Cache
- Propagate metrics from DDB to an RDS metrics table 

### Business Scenario
The CEO met with the primary investor and demoed the web-application. The CEO feels the investor was impressed with our rapid development progress thus far.

The primary investor asked us how we plan to track platform growth. The CEO said that we had already begun implementation on basic tracking growth metrics within a backend dashboard of our platform:
- How many users are on the platform
- How many posts are on the platform
- How many new users per day for the last week
- How many new posts per day for the last week

The CEO is going to meet again with the primary investor next week, and the CEO wants us to deliver on their spur-of-the-moment promise. So we need to rapidly deliver a simple dashboard with platform metrics.

To keep up with the pace of feature development, the CTO has suggested we use Postgres as a relational database. Since our backend does not require the same scale as the customer-facing part of our application.

### Weekly Outcome
- Be able to data model using 3rd normal forms
- Practical working knowledge of utilizing a Postgres database
- Basic knowledge of working with an Online Analytical Processing (OLAP)

### Possible Spend Considerations
- [[Relational Database Service (RDS)]] instance
- [[Relational Database Service (RDS)]] Snapshots
- Momento free-tier limit

### Alternatives and Considerations
- We require a Postgres service if we plan into Authentication which will rely on Postgres to store users for authentication.
- I want both an OnLine Transaction Processing (OLTP) and an OLAP in this project
- Redshift Serverless could be used as an OLAP
- DDB Streams to S3 and then Athena caching to Momento could have been possible as well for our OLAP like solution

### Security Considerations
___
#### Amazon RDS - Security Best Practices - AWS
- Use VPCs: Use Amazon Virtual Private Cloud (VPC) to create a private network for your RDS instance. This helps prevent unauthorized access to your instance from the public internet. 
- Compliance standard is what your business requires
- RDS instances should only be in AWS region that you are legally allowed to be holding.
- Amazon Organizations SCP - to manage RDS deletion, RDS creation, region look, RDS Encryption enforced etc. 
- AWS CloudTrail is enabled and monitored to trigger alerts on malicious RDS behaviour by an identity in AWS
- Amazon Guard duty is enabled in the account and region of RDS. 

#### Amazon RDS - Security Best Practices - Application
- RDS instance to use appropriate Authentication - Use IAM authentication, Kerberos etc (not the default)
- Database User Lifecycle Management - Create, Modify, Delete Users
- AWS User Access Lifecycle Management - Change of Roles / Revoke Roles etc
- Security Group to be restricted only to known IPs
- Not have RDS be internet accessible
- Encryption in Transit from comms between App & RDS
- Secret Management: Master User passwords can be used with AWS secrets manager to automatically rotate the secrets for Amazon RDS. 
- 

### Journal
___

#### What Types of Database is [[Relational Database Service (RDS)]]?
#### Create Amazon RDS Postgres through AWS Website
___
- Make sure you are in the right region you wish to store your data.
- Navigate to `Amazon RDS > Create Database`
	- Choose a database creation method:  `Easy Create`
	- Engine Option: `PostgreSQL`
	- DB Instance Size: `Free tier`
	- DB Instance Identifier: `database-1`
		- **Note**: DB Instance identifier is different from **Database Name**, to configure the database name you will have to manually set it in **Standard Create**
![[assets/Pasted image 20231229011047.png]]
	- Master username: `postgres`
	- Master password: `*********` `// Enoch12345`
	- Set up EC2 connection: `Don't connect to EC2 compute resource`
	- Create Database

#### Create Amazon RDS PostgreSQL through CLI
___
[RDS Doc](https://docs.aws.amazon.com/cli/latest/reference/rds/create-db-instance.html)

Make sure your AWS CLI is setup before running the following commands. 

Create a RDS DB Instance 
```sh
aws rds create-db-instance --db-instance-identifier cruddur-db-instance --db-instance-class db.t3.micro --engine postgres --engine-version 15.4 --master-username cruddur_admin --master-user-password Enoch12345 --allocated-storage 20 --availability-zone ca-central-1a --backup-retention-period 0 --port 5432 --no-multi-az --db-name cruddurdb --storage-type gp2 --publicly-accessible --storage-encrypted --enable-performance-insights --performance-insights-retention-period 7 --no-deletion-protection

```

Navigate to `Amazon RDS > Databases`
Creating a database will take time to create, so wait 5 - 10 mins. 

#### Access your AWS RDS from external Database Explorer
___
**First, Make sure your add inbound rule in your `VPC security groups` to access from external source.** 
	- Navigate to: `EC2 > Security Groups > sb-**********-default`
	![[assets/Pasted image 20231229011818.png]]
	- Edit Inbound rules
	- Add your IP Address, or IP Address of the network you will connect from. 
	![[assets/Pasted image 20231229011926.png]]

**Second, make sure Publicly accessible is turn on: `Yes`**
	- Navigate to : `RDS > Databases > <Database> > Modify`
	- In `Connectivity > Addional Configuration` : `Check Publicly accessible` 
    ![[assets/Pasted image 20231229012020.png]]

**Lastly, go to your desired database explorer, in my case i will be using pgadmin 4 portal**
- Sign In to your pgadmin
- Right click on `Server > Register > Server`
- In General, Name: `cruddur_aws`
- Go to Connection Tab
	- Host name/address: `RDS > Databases > DB_INSTANCE > Endpoint (********.ca-central-1.rds.amazonaws.com`
	- Port: `5432`
	- Maintenance: `postgres`
	- Username: `<master_username>`
	- Password:  `<master_user_password>`



#### Create and Use PostgreSQL in local environment using Docker compose
___
Create a docker compose file with postgreSQL db and pgadmin-4

```yaml TI:"docker-compose.yml"
version: '3.8'
name: cruddur
services:
	# To manage and access our postgreSQL database
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
    #PostgreSQL Database
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
networks:
    internal-network:
        driver: bridge
        name: cruddur
volumes:
    # Save the data in the local driver
    db:
        driver: local
    pgadmin-data:

```

Build and Run the docker compose `docker compose up -d --build`

![[PostgreSQL 101#Common PSQL commands]]

##### Create and Drop Database using PostgreSQL CLI
___
![[PostgreSQL 101#Connect to Database through Postgres CLI]]
#### Import script to quickly setup the schema for the database
___
We want to create a `schema.sql` file to load to postgreSQL and place it in `backend-flask/db`

The command to import:
```sh
psql cruddur < db/schema.sql -h localhost -U postgres
```

##### Add UUID Extension
We are going to have Postgres generate out UUIDs. We’ll need to use an extension called: `uuid-ossp`

```sql TI:"db/schema.sql"
-- Add UUID Extension
CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```


#### Create Database Schemas
___
Create the following schemas

- `schema.sql`
```sql TI:'db/schema.sql'
-- Add UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP ANY EXISTING TABLES
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.activities;


--CREATE TABLE FOR users
CREATE TABLE public.users (
    uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    display_name text NOT NULL,
    handle text NOT NULL,
    email text NOT NULL,
    cognito_user_id text NOT NULL,
    created_at TIMESTAMP default current_timestamp NOT NULL
);

--CREATE TABLE FOR activities
CREATE TABLE public.activities (
    uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_uuid UUID NOT NULL,
    message TEXT NOT NULL,
    replies_count INTEGER DEFAULT 0,
    reposts_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    reply_to_activity_uuid INTEGER,
    expires_at TIMESTAMP,
    created_at TIMESTAMP default current_timestamp NOT NULL
);
```


- schema to seed the database `seed.sql`
```sql TI:"db/seed.sql"
-- this file was manually created
INSERT INTO public.users (display_name, handle, cognito_user_id)
VALUES
    ('Iron Man', 'ironman', 'MOCK'),
    ('Andrew Brown', 'andrewbrown', 'MOCK'),
    ('Super Man', 'superman', 'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES (
        (SELECT uuid from public.users WHERE users.handle = 'andrewbrown' LIMIT 1),
        'This was a imported as seed data!',
        current_timestamp + interval '10 day'
    );

```

#### Create Bash Scripts to load, create and delete database
___
Navigate to `backend-flask > bin` and create the following bash  files

To know where is your bash script is located, run this script in your shell `whereis bash`

**Make sure all these files have permission to be executable by the user, as follows:**
Check if they have `x` for each file in their permissions 
![[assets/Pasted image 20231229183718.png]]

If files doesn’t have permission, run the following command:
```sh
# Add u+x permission to all files in bin folder
chmod u+x bin/*
```


![[Bash Scripting 101#Make prints nicer]]

**To execute these files, you will have to run in your shell**
```sh
. bin/<bash_script_file_name>
# or 
source bin/<bash_script_file_name>
```

- Create a file named `db-create`
```bash
#! /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
printf "${CYAN}-------- CREATING THE DATABASE --------${NO_COLOR}\n"


# Using sed to manipulate string
# Replacing "/cruddur" with empty string
NO_DB_CONNECTION_URL=$(sed 's/\/cruddur_db//g' <<< "$CONNECTION_URL")

psql $NO_DB_CONNECTION_URL -c "CREATE DATABASE cruddur_db;"
```

- Create a file named `db-drop`
```bash
#! /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
printf "${CYAN}-------- DROPPING THE DATABASE --------${NO_COLOR}\n"

# Using sed to manipulate string
# Replacing "/cruddur" with empty string
NO_DB_CONNECTION_URL=$(sed 's/\/cruddur_db//g' <<< "$CONNECTION_URL")

psql $NO_DB_CONNECTION_URL -c "DROP DATABASE cruddur_db;"

```

- Create a file named `db-connect`
```bash TI:"bin/db-connect"
#! /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
printf "${CYAN}-------- CONNECT TO DATABASE --------${NO_COLOR}\n"

psql $CONNECTION_URL
```


- Create a file named `db-schema-load`
```bash
#! /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
printf "${CYAN}-------- CREATING SCHEMA IN THE DATABASE --------${NO_COLOR}\n"


schema_path=$(realpath .)/db/schema.sql

env=$1 ## First arg given by the user

if [ "$env" = "prod" ]; then
    echo "Running in production mode."
    CONN_URL=$PROD_CONNECTION_URL
else
    CONN_URL=$CONNECTION_URL
fi

psql $CONN_URL cruddur_db < $schema_path

```

#### See what connections are connected to our Database
___
```bash TI:"bin/db-sessions"
#! /usr/bin/bash

## List of the places our database is running
CYAN='\033[1;36m'
NO_COLOR='\033[0m'
printf "${CYAN}--------LIST OF ALL DATABASE SESSIONS --------${NO_COLOR}\n"

# Using sed to manipulate string
# Replacing "/cruddur" with empty string
NO_DB_CONNECTION_URL=$(sed 's/\/cruddur_db//g' <<< "$CONNECTION_URL")

psql $NO_DB_CONNECTION_URL -c "SELECT pid AS process_id, \
                                usename as user, \
                                datname as db, \
                                client_addr, \
                                application_name as app, \
                                state \
                            from pg_stat_activity; "
```


#### Create a setup file to run all the necessary bash files to setup database

```bash TI:"bin/db-setup"
#! /usr/bin/bash
-e #stop if it fails at any point

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
printf "${CYAN}======== SETUP THE POSTGRES DATABASE ========${NO_COLOR}\n"

bin_path="$(realpath .)/bin"

source "$bin_path/db-drop"
source "$bin_path/db-create"
source "$bin_path/db-schema-load"
source "$bin_path/db-seed"
```



#### Create Database Connection Pooling using `psycopg 3.2.0`
___
**What is connection pooling?**
- Connection pooling is a strategy that involves recycling database connections for multiple requests instead of closing them immediately when a query has been resolved. 
- Helps to open/close new connections much faster, as they’re are not really opened and closed, they’re just checked out/in to pool. 

##### Installations
___
```txt TI:"backend-flask/requirements.txt"
psycopg[binary]
psycopg[pool]
```

##### Setup
___
**Update and add .env file**
```
CONNECTION_URL="postgresql://postgres:password@db/cruddur_db"
```

Navigate to : `lib/db.py`
```python TI:"lib/db.py"
from psycopg_pool import ConnectionPool
import os

def query_wrap_object(template):
    sql = f""" 
    (SELECT COALESCE(row_to_json(object_row), '{{}}'::json) FROM (
        {template}
    ) object_row);
    """
    return sql

# Convert Array to json format, if null return empty json
def query_wrap_array(template):
    sql = f""" 
    (SELECT COALESCE(array_to_json(array_agg(row_to_json(array_row))), '[]'::json) FROM (
        {template}
    ) array_row) """
    return sql

connection_url = os.getenv("CONNECTION_URL")
pool = ConnectionPool(connection_url)
```


Navigate to: `services/home_activities.py` to load from database
```python TI:"home_activities.py"
from lib.db import pool,query_wrap_array



class HomeActivities:
  def run(cognito_user_id=None):
    # logger.info('hello_from_api_end_point: /api/activities/home')
    now = datetime.now(timezone.utc).astimezone()
    results = []
    
    if(cognito_user_id != None):
      auth_data = {
      'uuid': cognito_user_id,
      'handle':  'enochgeorge',
      'message': 'New data has entered this Cruddur app!',
      'created_at': (now - timedelta(days=2)).isoformat(),
      'expires_at': (now + timedelta(days=5)).isoformat(),
      'likes_count': 522,
      'replies_count': 1,
      'reposts_count': 0,
      'replies': []
      }
      results.insert(0,auth_data)
      
    sql = query_wrap_array("""
    SELECT 
        activities.uuid,
        users.display_name,
        users.handle,
        activities.message,
        activities.replies_count,
        activities.reposts_count,
        activities.likes_count,
        activities.reply_to_activity_uuid,
        activities.expires_at,
        activities.created_at
    FROM public.activities
    LEFT JOIN public.users on users.uuid = activities.user_uuid
    ORDER BY activities.created_at DESC
    """)
    with pool.connection() as conn:
      with conn.cursor() as cur:
            # this will return a tuple
            # the first field being the data
            cur.execute(sql)
            json = cur.fetchone()
            return json[0]
    

    return results


```

#### Connect to Amazon RDS using PostgreSQL Connection URL
___
[[PostgreSQL 101#Connect to Database through Postgres CLI]]

**Create a .env variable for connecting to RDS database**
```dotenv TI:"backend-flask/.env"
PROD_CONNECTION_URL="postgresql://cruddur_admin:password@cruddur-db-instance.cuo0eawszuel.ca-central-1.rds.amazonaws.com:5432/cruddurdb"
```

Now you can connect to your database through bash, as follows:
```bash
export PROD_CONNECTION_URL="postgresql://cruddur_admin:password@cruddur-db-instance.cuo0eawszuel.ca-central-1.rds.amazonaws.com:5432/cruddurdb"

psql $PROD_CONNECTION_URL
```

If you have trouble connecting check your AWS inbound rules to allow your IP address to access the database. Show 👇
[[AWS Cloud Complete Bootcamp Course#Access your AWS RDS from external Database Explorer]]

#### Setup Cognito post using AWS lambda function
___
##### Create Lambda Function
- Navigate to `Lambda > Function > Create Function`
- Function name: `cruddur_post_confrimation`
- Runtime: `Python 3.8`
- Architecture: `x86_64`
- Change default execution role: `Create a new role with basic Lambda permission`
- **Create Function**

- Navigate to `lambda > functions > [your_function] > Code`
- Paste the following code in `code source`
- Click `Deploy`
```python TI:"lambda function"
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

```

##### Add Environment Variables
Navigate to `lambda > functions > [your_function] > Configuration > Environment variables` add `PROD_CONNECTION_URL` we previously created to connect to AWS DB. 

##### Add Layers to our lambda function
- We are adding a layer is because `psycopg2` package will be imported in this lambda function.
- Navigate to `lambda > functions > [your_function] > Code > Layers`
	- Add a layer
	- Specify an ARN 
		- `arn:aws:lambda:[region]:[account_id]:layer:psycopg2-py38:1`
		- In my case the ARN is
			- `arn:aws:lambda:ca-central-1:713079456378:layer:psycopg2-py38:1`
	- **OR**
	- Alternatively you can create your own development layer by downloading the psycopg2-binary source files from: [here](https://pypi.org/project/psycopg2-binary/)
		- Download the package by `pip install psycopg2-binary -t .`
		- Navigate to the source folder
		- and zip all the files in that folder **OR** download the below zip package and upload this zip file in the lambda layer [Video Ref](https://youtu.be/_TUNZuvjyDQ)![[pycopg2.zip]] 
		- Then upload as a new lambda layer to your AWS account
			- Navigate to `Lambda > Layers > Create layer`
			- Name: `pycopg2`
			- `Upload a .zip file` - upload the file you just zipped
			- `x86_64`
			- Compatible runtimes: `python 3.8`
			- **Create**
		- Navigate to `lambda > functions > [your_function] > Code > Layers`
			- Add a layer
			- Custom Layers
			- `Select the pycopg2` we just created

##### Add Trigger to Lambda function
- Navigate to your AWS Cognito: `Amazon Cognito > User Pools > [your_cognito_user_pool]`
- Go to `User pool properties > Add Lambda Trigger`
	- Trigger type: `Sign-up`
	- Sign-up: `Post confirmation trigger`
	- Lambda Function: `cruddur_post_confirmation`
	- `Add Lambda Trigger`


##### Create Custom policy to provide execution permission role to call CreateNetworkInterface on EC2

- Navigate to `Lambda > Functions > [your_function] > Configuration > Permissions`
- Click on the `Role name` link
- You will redirected to `IAM`
- Navigate to `IAM > Policies > Crete Policy`
	- Change to `JSON` view
	-  Add the following policy
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect":"Allow",
			"Action":[
				"ec2:CreateNetworkInterface",
				"ec2:DeleteNetworkInterface",
				"ec2:DescribeNetworkInterfaces",
				"ec2:DescribeInstances",
				"ec2:AttachNetworkInterface"
			],
			"Resource": "*"
		}
	]
}
```
- 
- Navigate to `IAM > Roles > [cruddur_post_confrimation_role] > Permissions > permission policies > Add permissoions > Attach policy`
	- Check for your custom policy `CustomAWSLambdaVPCAccessExecutionRole`
	- `Add permission`
	
##### Attach Lambda function and RDS instance in the same VPC
- Navigate to `Lambda > Functions > [your_function] > VPC > Edit`
- VPC: `default`
- Subnets: `Choose any two subnets`
- Security groups: `default`

##### Test your Lambda function
- Navigate to `Lambda > Monitor > View CloudWatch Logs`
- Go your frontend application, and create a user and check if the logs are logging output. 
- If there are errors or you function logs out any data, you can view all your lambda logs in  CloudWatch.
- Check if data is being saved in your Database.
	- go to `Cognito > User Pools > [user_pool] > Users`
	- **ALSO CHECK YOUR DATABASE**
	- `./bin/db-connect prod`: custom bash script you created to connect to your AWS RDS. 
		- `SELECT * FROM users`
		- if you see your new signed up user. That means everything is working. 

#### Setup create activities in our feed using our CRUD functionality
___
##### Create an SQL folder where you store all your SQL statements.

- Create `db/sql/activities/home.sql`
```sql TI:"home.sql"
SELECT 
    activities.uuid,
    users.display_name,
    users.handle,
    activities.message,
    activities.replies_count,
    activities.reposts_count,
    activities.likes_count,
    activities.reply_to_activity_uuid,
    activities.expires_at,
    activities.created_at
FROM public.activities
LEFT JOIN public.users on users.uuid = activities.user_uuid
ORDER BY activities.created_at DESC
```

- Create `db/sql/activities/create.sql`
```sql TI:"create.sql"
INSERT INTO public.activities (
    user_uuid, 
    message, 
    expires_at
    )
VALUES (
    (SELECT uuid FROM public.users
        WHERE users.handle = %(handle)s
        LIMIT 1
    ),
    %(message)s,
    %(expires_at)s
) 
RETURNING uuid;
```


- Create `db/sql/activities/objects.sql`
```sql TI:"objects.sql"
SELECT 
    activities.uuid,
    users.display_name,
    users.handle,
    activities.message,
    activities.created_at,
    activities.expires_at
FROM public.activities
INNER JOIN public.users ON users.uuid = activities.user_uuid
WHERE
    activities.uuid = %(uuid)s
```


##### Refactoring `db.py` code
```python TI:"lib/db.py"
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
```
#####  Refactoring `home_activities.py` code

```python TI:"services/home_activities.py"
from datetime import datetime, timedelta, timezone
from lib.db import db


class HomeActivities:
  def run(cognito_user_id=None):
    # logger.info('hello_from_api_end_point: /api/activities/home')
    now = datetime.now(timezone.utc).astimezone()
    results = [{}]
    if(cognito_user_id != None):
      auth_data = {
      'uuid': cognito_user_id,
      'handle':  'enochgeorge',
      'message': 'New data has entered this Cruddur app!',
      'created_at': (now - timedelta(days=2)).isoformat(),
      'expires_at': (now + timedelta(days=5)).isoformat(),
      'likes_count': 522,
      'replies_count': 1,
      'reposts_count': 0,
      'replies': []
      }
      results.insert(0,auth_data)
      
    sql = db.template('activities', 'home')
    results = db.query_array_json(sql)
    return results
```

##### Setup backend to create new activities
- Refactor the `data_activities()` route 
```python TI:"app.py"
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

```


- Navigate to `create_actiivty.py` to add an SQL statement to insert records
```python TI:"services/create_activity.py"
import uuid
from datetime import datetime, timedelta, timezone
from lib.db import db

class CreateActivity:
  def __init__(self, message, user_handle, ttl):
    self.message = message
    self.user_handle = user_handle
    self.ttl = ttl

  def run(self):
    model = {
      'errors': None,
      'data': None
    }
    message = self.message
    user_handle = self.user_handle
    ttl = self.ttl

    now = datetime.now(timezone.utc).astimezone()
    if (ttl == '30-days'):
      ttl_offset = timedelta(days=30) 
    elif (ttl == '7-days'):
      ttl_offset = timedelta(days=7) 
    elif (ttl == '3-days'):
      ttl_offset = timedelta(days=3) 
    elif (ttl == '1-day'):
      ttl_offset = timedelta(days=1) 
    elif (ttl == '12-hours'):
      ttl_offset = timedelta(hours=12) 
    elif (ttl == '3-hours'):
      ttl_offset = timedelta(hours=3) 
    elif (ttl == '1-hour'):
      ttl_offset = timedelta(hours=1) 
    else:
      model['errors'] = ['ttl_blank']

    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['user_handle_blank']

    if message == None or len(message) < 1:
      model['errors'] = ['message_blank'] 
    elif len(message) > 280:
      model['errors'] = ['message_exceed_max_chars'] 

    if model['errors']:
      model['data'] = {
        'handle':  user_handle,
        'message': message
      }   
    else:
      expires_at = (now + ttl_offset).isoformat()
      uuid = self.create_activity(user_handle, message, expires_at)
      object_json = self.query_object_activities(uuid)
      model['data'] = object_json
    return model
  
  # Insert a user activity to the database (RDS)
  def create_activity(self,handle, message, expires_at):
    sql = db.template('activities','create')
    uuid = db.query_commit(sql, {
                          'handle':handle,
                          'message':message, 
                          'expires_at':expires_at
                        })
    print("USER UUID ====== ",uuid)
    return uuid;

  # Return a Activities as json
  def query_object_activities(self, uuid):
    sql = db.template('activities', 'objects')
    json = db.query_object_json(sql, {
      'uuid': uuid
    })
    return json
    
```

