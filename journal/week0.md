# Week 0 — Billing and Architecture

### Technical Tasks

- Discussing the format of the bootcamp    
- Going over the business use-case of our project
- Looking at an architectural diagram of what we plan to build
- Showcase how to use [Lucid Charts](https://lucid.app/) to build architectures    
- Talk about [C4 Models](https://c4model.com/)
- Running through the cloud services we will utilize
- Testing that we can access our AWS accounts
- Settings up AWS free-tier and understand how to track spend in AWS
- eg . AWS Budgets, AWS Cost Explorer, Billing Alarms
- Understanding how to look at monthly billing reports
- Launching [AWS CloudShell](https://docs.aws.amazon.com/cloudshell/latest/userguide/working-with-cloudshell.html) and looking at AWS CLI
- Generating AWS credentials

### Business Scenario

Your company has asked to put together a technical presentation on the proposed architecture that will be implemented so it can be reviewed by the fractional CTO.

Your presentation must include a technical architectural diagram and breakdown of possible services used along with their justification.

The company also wants to generally know what spend we expect to encounter and how we will ensure we keep our spending low.

### Weekly Outcome
- Gain confidence when working meter-billing with a Cloud Service Provider (CSP)
- To understand how to build useful architecture diagrams
- To gain a general idea of the cost of common cloud services
- To ensure we have a working AWS account

### Possible Spend Considerations
- You need a credit card to activate your AWS Account
- If your AWS account is older than a year, you will not be eligible for some free-tier services.
### Homework Challenges
- [x] Destroy your root account credentials, Set MFA, IAM role    
- [ ] Use EventBridge to hookup Health Dashboard to SNS and send notification when there is a service health issue.
- [ ] Review all the questions of each pillars in the Well Architected Tool (No specialized lens)
- [ ] Create an architectural diagram (to the best of your ability) the CI/CD logical pipeline in Lucid Charts
	- **Resources**
		- [learn-cantrill-io-labs](https://github.com/acantril/learn-cantrill-io-labs)
		
- [ ] Research the technical and service limits of specific services and how they could impact the technical path for technical flexibility. 
- [ ] Open a support ticket and request a service limit

### Notes
#### Architecting your Cloud

##### What is Good Architecture?
- **Meet the requirements:**
	- Things that project MUST achieve at the end.
	- It  can be technical or business oriented, but it must be measurable. the requirements must be:
		- verifiable
		- monitorable
		- traceable
		- **feasible**
	- Examples
		- Meets ISO standards
		- 99.9% uptime
		- User can do a specific task

- **Addresses the Risks, Assumptions & Constraints**
	- **Risks** can prevent the project from being successful (must be mitigated)
		- SPoFs
		- User Commitment
		- Late Delivery
	- **Assumptions** are factor held as true for the planning & implementation phases
		- Sufficient network bandwidth
		- Stakeholders will be available to make decisions
		- Budget is approved 😊
	- **Constraints** are policy or technical limitations for the project, in our case
		- Time -  its going to take 14 weeks or more
		- Budget - its $0, since we are using free tier
		- Vendor Selection - AWS Cloud Service
		
- **From gathering the RRACs, you then create your design**
	- [[Conceptual Design]]
		![](<assets/Pasted image 20231128182122.png>)

	- [[Logical Design]]
	- [[Physical Design]]

- **It’s important to develop a common dictionary**
	- Ask “dumb questions”.
	- Play be-the-packet.
	- Document everything*
	- What is [[TOGAF]] OR [[C4 Models]]?*
		- Its not necessary to learn this but helps to  build more robust architecture.
		- You can use TOGAF or C4, there is no best architecture just stick to one.

- **AWS Well-Architected Tool**
	- Uses the AWS Well-Architected Framework to review your workloads against current AWS best practices.
		- Workload = collection of resources and code that make up a cloud application.
		- Asks the right questions (from a TOGAF perspective) to highlight blind spots
		- Naturally falls into the R/R/A/C buckets
		- Powerful tool in the architect’s toolbelt
		- “Everyone” contributes.
	- This helps to get conversational question points to ask for investor or stockholders based on the preceptive of the [[The 6 Pillars of the AWS Well-Architected Framework]], what are based on the business to transfer to your technical needs.

### Journal

###### Cruddar Diagrams
![[assets/Cruddar - Conceptual Diagram.png]]
![[assets/Cruddar - Logical Diagram.png]]
###### Setup Budgeting in AWS and create thresholds to alert the admin.

- Sign In as a Root User or a user which has privilege's to budgets
- Navigate to Billing and Cost Management
- Navigate to Budgets
- Create two types of budget
	- Credits (Like someone gifts you credit or free tier)
		- ![](<assets/Pasted image 20231129113110.png>)
	- BudgetSpend
		- ![](<assets/Pasted image 20231129113339.png>)


###### Setup up MFA for your accounts
- On top of the menu “Click on your profile name”
	- ![](<assets/Pasted image 20231129115359.png>)
- Navigate to MFA → Assign MFA Device

###### Setup a IAM User Account, and Destroy Root Account
- Navigate to IAM User
- Go to Access Management > Users > Add users
- Fill out all the details
	- User name: awsEnoch
	- Check “Provide user access to the AWS Management Console - _optional_”
	- Chick “I want to create a IAM user”
	- Type in your custom password
	- Uncheck “Users must create a new password”
	- Check “Add user to group”
	- Click on “Create group” 
		- User group name: Admin
		- Check “AdministratorAccess”
	- Check “Admin” in “User Group”
	- Create a User
- Navigate to IAM > Dashbaord
	- On the right side → you can edit your Account Alias (it should unique)
	- You can reterive your Sign-in URL and Account ID

###### Configure AWS CLI in VSCODE
- [AWS Command Line Interface Doc](https://aws.amazon.com/cli/)
- **Step 1:** Setup Access Keys
	- *Note: Max out your access keys, so no attacker can add access keys anymore (2 Access Keys is max currently)
	- Navigate to Security Credentials
		- ![](<assets/Pasted image 20231129124836.png>)
	- Go to Access Keys > Create access keys
		- Check Command Line Interface (CLI)
		- Type in a description (optional)
		- Create Access Keys
		- **Note down the Access key id and secret access key or download the csv file**

- **Step 2:** Install AWS CLI 
	- [Installation Doc](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
		```
		$ cd /workspace
		$ curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" "awscliv2.zip"
		$ unzip awscliv2.zip
		$ sudo ./aws/install
		$ aws --version
		$ aws --cli-auto-prompt #helps to auto complete your aws commands.
		```

- **Step 3:** Configure Access Keys with AWS CLI
	``` 
	#AWS_USER="awsEnoch" #no need to copy this
	#Copy rest of the stuffts after you filled in the access keys, you downloaded or noted down before
	export AWS_ACCESS_KEY_ID="*****************"
	export AWS_SECRET_ACCESS_KEY="***************"
	export AWS_DEFAULT_REGION="ca-central-1"
	```

	- Note down these env. variables a text editor, and type it in your cli one by one and to check if everything is exported correctly type: `env | grep AWS_`![](<assets/Pasted image 20231129133809.png>)
 
	
	- To check if everything went well type: `aws sts get-caller-identity`
	- ![](<assets/Pasted image 20231129125859.png>)
- **Done**

###### Configure Budget and Alert with AWS CLI
- [Config Budget Doc](https://docs.aws.amazon.com/cli/latest/reference/budgets/)
- **To Create a Budget JSON**. [DOC](https://docs.aws.amazon.com/cli/latest/reference/budgets/create-budget.html)
	- Create Two JSON files
		- budget.json
```
{
"BudgetLimit": {
	"Amount": "10",
	"Unit": "USD"
},
"BudgetName": "TrackBudgetSpend",
"BudgetType": "COST",
"CostFilters": {
	"TagKeyValue": [
		"user:Key$value1",
		"user:Key$value2"
	]
},
"CostTypes": {
	"IncludeCredit": false,
	"IncludeDiscount": false,
	"IncludeOtherSubscription": true,
	"IncludeRecurring": true,
	"IncludeRefund": true,
	"IncludeSubscription": true,
	"IncludeSupport": true,
	"IncludeTax": true,
	"IncludeUpfront": true,
	"UseBlended": false
},
"TimePeriod": {
	"Start": 1477958399,
	"End": 3706473600
},
"TimeUnit": "MONTHLY"
}
```
- Next file
	- budget-notification-with-subscribers.json
```
[
	{
		"Notification": {
			"ComparisonOperator": "GREATER_THAN",
			"NotificationType": "ACTUAL",
			"Threshold": 80,
			"ThresholdType": "PERCENTAGE"
		},
		"Subscribers": [
			{
				"Address": "enochgeorge1999@gmail.com",
				"SubscriptionType": "EMAIL"
			}
		]
	},
	{
		"Notification": {
			"ComparisonOperator": "GREATER_THAN",
			"NotificationType": "ACTUAL",
			"Threshold": 90,
			"ThresholdType": "PERCENTAGE"
		},
		"Subscribers": [
			{
				"Address": "enochgeorge1999@gmail.com",
				"SubscriptionType": "EMAIL"
			}
		]
	},
	{
		"Notification": {
			"ComparisonOperator": "EQUAL_TO",
			"NotificationType": "ACTUAL",
			"Threshold": 100,
			"ThresholdType": "PERCENTAGE"
		},
		"Subscribers": [
			{
				"Address": "enochgeorge1999@gmail.com",
				"SubscriptionType": "EMAIL"
			}
		]
	}
]
```

- Run the following script in the bash or save it in documents for future reference 
	- Run `export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)`  
```bash
aws budgets create-budget \
    --account-id $AWS_ACCOUNT_ID \
    --budget file://budget.json \
    --notifications-with-subscribers file://budget-notifications-with-subscribers.json
```

###### **Create an SNS Alert through CLI**
	- `$ aws sns create-topic --name billing-alarm 
```bash
aws sns subscribe \
    --topic-arn arn:aws:sns:ca-central-1:713079456378:billing-alarm \
    --protocol email \
    --notification-endpoint enochgeorge1999@gmail.com
 
```
- Output
	- ![](<assets/Pasted image 20231129144957.png>)
- Navigate to your AWS Console Management > search for Amazon SNS. 
- Then go to Subscriptions tabs and you will see a subscription.
- ![](<assets/Pasted image 20231129145333.png>)
	- You will have to confirm through email, to see the status as CONFIRMED.

###### **Create an Alert using CloudWatch CLI**
	- REF: [How can I moniter dialy EstimatedCharges and trigger a CloudWatch alarm based on my usage threshold](https://repost.aws/knowledge-center/cloudwatch-estimatedcharges-alarm)
	- create a alarm-config.json**
```json
{
    "AlarmName": "DailyEstimatedCharges",
    "AlarmDescription": "This alarm would be triggered if the daily estimated charges exceeds 50$",
    "ActionsEnabled": true,
    "AlarmActions": [
	    //$ aws sns create-topic --name billing-alarm    
        "arn:aws:sns:<REGION>:<ACCOUNT_ID>:<SNS_TOPIC_NAME>"
    ],
    "EvaluationPeriods": 1,
    "DatapointsToAlarm": 1,
    "Threshold": 50,
    "ComparisonOperator": "GreaterThanOrEqualToThreshold",
    "TreatMissingData": "breaching",
    "Metrics": [{
        "Id": "m1",
        "MetricStat": {
            "Metric": {
                "Namespace": "AWS/Billing",
                "MetricName": "EstimatedCharges",
                "Dimensions": [{
                    "Name": "Currency",
                    "Value": "USD"
                }]
            },
            "Period": 86400,
            "Stat": "Maximum"
        },
        "ReturnData": false
    },
    {
        "Id": "e1",
        "Expression": "IF(RATE(m1)>0,RATE(m1)*86400,0)",
        "Label": "DailyEstimatedCharges",
        "ReturnData": true
    }]
}
```
- Run the following code in bash
	- `$ aws cloudwatch put-metric-alarm --cli-input-json file://alarm-config.json`
- Go to your AWS Management System, and search CloudWatch and change the region based on your account
	- ![](<assets/Pasted image 20231129152643.png>)





