# Week 3 — Decentralized Authentication

### Technical Tasks
- Provision via ClickOps a Amazon Cognito User Pool
- Install and configure Amplify client-side library for Amazon Congito
- Implement API calls to Amazon Coginto for custom login, signup, recovery and forgot password page
- Show conditional elements and data based on logged in or logged out
- Verify JWT Token server side to serve authenticated API endpoints in Flask Application

### Business Scenario
- The fractional CTO has suggested that authentication be solved before implementing any other business logic in the application and to ensure that we use a decentralized authentication service and specifically Amazon Cognito. 

### Weekly Outcome
- Practical knowledge of implementing a decentralized authentication service into a web-application with custom login and signup pages in a react application.

### Possible Spend Considerations
…

### Alternatives and Considerations
- We could have used Auth0 which is a popular decentralized authentication service which has a free-tier. Since we are building a social media website we have to consider the cost of Monthly Active Users (MAUs)
	- In practice a social media platform would likely roll its own decentralized authentication service
- AuthN would have put on a good technical path to roll own decentralized authentication service however it requires Postgres and Redis so it would be too many extra moving parts and costs considerations for the scope of this bootcamp.
- Azure AD B2C is another possible solution. Its low cost has support for many Identity Providers (IdPs)

### Security Considerations

#### Amazon Cognito - Security Best Practices - AWS
- AWS Services - API Gateway, AWS resources shared with app client (Backend or Bank channel)
- AWS WAF with web ACLs for Rate limiting, Allow/ Deny List, Deny access from region and many more WAF management rules similar to OWASP (marketplace)
- Amazon Cognito Compliance standard is what your business requires
- Amazon Cognito should only be in the AWS region that you are legally allowed to be holding user data in. 
- Amazon organizations SCP - to manage user pool deletion, creation, region lock etc
- AWS CloudTrail is enabled and monitored to trigger alerts on malicious Cognito behaviour by an identity in AWS. 

#### Amazon Cognito - Security Best Practices - Application
- Application should use an industry standard for Authentication & Authorization (SAML, OpenID Connect, OAuth2.0 etc)
- App user lifecycle management - Create, Modify, Delete Users
- AWS user access lifecycle management - Change of roles / revoke roles etc
- Role based access to manage how much access to AWS resources for application being built
- Token Lifecycle Management - Issue new tokens, revoke compromised tokens, where to store (client/server) etc.
- Security tests of the application through penetration testing
- Access token scope - should be limited
- JWT token best practice - no sensitive info
- Encryption in transit for API calls. 

### Homework Challenges 
- [ ] \[Medium\] Decouple the JWT verify from the application code by writing a  Flask Middleware
- [ ] \[Hard\] Decouple the JWT verify by implementing a Container Sidecar pattern using AWS’s official Aws-jwt-verify.js library
- [ ] \[Hard\] Decouple the JWT verify process by using Envoy as a sidecar https://www.envoyproxy.io/
- [ ] \[Hard\]  Implement a IdP login eg. Login with Amazon or Facebook or Apple.
- [ ] \[Easy\] Implement MFA that send an SMS (text message), warning this has spend, investigate spend before considering, text messages are not eligible for AWS Credits

### Journal

#### What is Decentralized Authentication?

Decentralized authentication is a system where users control their own identity and access rights without relying on a single central authority.

Imagine you have a clubhouse with your friends. Normally, one person holds the "master key" to let everyone in. This is like traditional authentication, where one company (like Google or Facebook) controls your login and decides who can access what.

Decentralized authentication is like having a **shared clubhouse lockbox**. Each member has their own key, and anyone with a key can open the lockbox and enter the clubhouse. No single person controls the lockbox, and everyone is responsible for their own key.

This means:
- No master key: Users have digital keys (like passwords or cryptographic credentials) that grant them access to various online services.
- Shared verification: Instead of one company verifying your identity, a distributed network of independent nodes ensures the validity of your credentials.
- User-controlled data: You own your identity data and decide who can access it, providing greater privacy and control.
- Open ecosystem: You're not tied to any specific platform or service, empowering you to choose and move freely.

Decentralized authentication is still developing, but it offers promising alternatives for a more secure, private, and user-centric internet experience.
![[assets/Pasted image 20231218220512.png]]

**Tools using Decentralized Auth.**
- OAuth

#### What is Amazon Cognito? [VidLink](https://youtu.be/zA8guDqfv40?t=67254)
##### Why use Cognito?
- User Directory for Customers
- Ability to access AWS Resources for the application being built
- Identity Broker for AWS resources with temporary credentials
- Can extend users to AWS resources easily

##### Types of Cognito Pools
Cognito has two pools:
	- **Cognito User pool**
		- Managed user directory: secure database where you store your users credentials (username, password, etc). We can manage the user accounts, define attributes, and setup password policies.
		- Local authentication: Users can sign in directly to your app using their credentials stored in the user pool
		- Limited flexibility: you can customize some aspects, user pool authentication is primarily controlled by Amazon Cognito
	- **Federated Identity providers (IdPs)**
		- External Identify sources: Third party services like Google, Facebook or even your corporate directory that manage your users identities independently
		- Federated authentication: users sign in to your app using their existing accounts with the IdP. Your app only receives tokens confirming their identity from the IdP
		- More flexibility: we can integrate with various IdPs and leverage their built-in features like social logins or SSO (single sign-on)
	- **Key Differences:**
		- Ownership: You own and manage the data in your user pool, while IdPs manage their own user data.
		- Control: You have more control over the authentication process with user pools, while with IdPs, you depend on their APIs and policies.
		- User experience: User pools offer a dedicated sign-in experience, while IdPs provide a familiar experience for users already familiar with the provider.
	- **Choosing the right option:**
		- Use a user pool if you need complete control over user data and prefer a custom login experience.
		- Use a federated IdP if you want simpler integration, leverage existing user accounts, or offer social logins.


#### Setup Amazon Cognito

- Navigate to` Amazon Cognito > User Pools > Create user pool`
- Select `Provider types  > Cognito User Pool`
- Check `Cognito user pool sign-in options > Email`
- Password Policy: `Cognito defaults`
- Multifactor authentication: `No MFA`
	- MFA might incur additional costs through SMS
- User Account Recovery: 
	- Enable Self service account recovery
	- Delivery method for user account recovery message: Email only
- Configure Sign-up experience
	- check `enable self-registration`
- Attribute verification and user account confirmation
	- Check `allow cognito to automatically send messages to verfiy and confirm`
	- Attributes to verify → check → `send email messages, verify email address`
	-  Verify attribute changes → check `keep orignical attribute value active when an update is pending`
	- Active attribute values when an update is pending → check `email address`
	- Required attributes
		- name
		- email
		- preferred_username
- Configure message delivery
	- Email → check `send email with Cognito`
- Integrate your app
	- User pool name → `cruddur-user-pool`
	- Hosted authentication pages → uncheck `use the cognito hosted ui`
	- Initial app client → app type → check `public client`
	- app client name → `cruddur`
	- client secret → check `don't generate a client secret`
- **Review and create** → Create user pool
![[assets/Pasted image 20231225131259.png]]
#### Install AWS Amplify
[Docs](https://docs.amplify.aws/)
- Navigate to your frontend app
```sh
npm i aws-amplify --save
```

##### Configure Amplify in your frontend
___

**Create a User manually in AWS Cognito for testiing**
___
Navigate to `Amazon Cognito > User Pools > cruddur-user-pool > Users > Create user` for testing the sign in feature.  

![[assets/Pasted image 20231220195618.png]]

If the confirmation status is showing `Force change password` we will have to use AWS CLI to configure this issue. 
This is because we are manually creating the user from the AWS portal, rather then from the Sign Up page. 
![[assets/Pasted image 20231220195720.png]]

Run the following command in your terminal to change your confirmation status to `confirmed`
```sh
aws --cli-auto-prompt
#Syntax
aws cognito-idp admin-set-user-password \
  --user-pool-id <your-user-pool-id> \
  --username <username> \
  --password <password> \
  --permanent

aws cognito-idp admin-set-user-password --user-pool-id <USER_POOL_ID> --username andrewbrown --password Andrew@12345 --permanent
```

Now check your users, the confirmation status should say `Confirmed`
![[assets/Pasted image 20231220200816.png]]
___

Setup the environment variables to config the AWS amplify in your front end
```dotenv TI:".env"
# Amplify Credentials
REACT_APP_AWS_PROJECT_REGION="ca-central-1"
REACT_APP_AWS_COGNITO_REGION="ca-central-1"
REACT_APP_AWS_USER_POOLS_ID="ca-central-1_18UsNEFrE"
# Amazon Cognito > User Pools > <name_of_the_user_pool> > App Integration > App Client List > Client ID
REACT_APP_CLIENT_ID="5ss3tmdj1q1cld0aaipj0b7n5c"
```

We need to config our Cognito pool to our code in `App.jsx`
```jsx TI:"app.jsx"
// Amplify ----- OLD CONFIG --- Look below for new config
import { Amplify } from 'aws-amplify';
const config = {
	Auth: {
		Cognito: {
			//  Amazon Cognito User Pool ID
			userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
			// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
			userPoolClientId: process.env.REACT_APP_CLIENT_ID,
			loginWith: {
				// Optional
				oauth: {},
				username: 'true',
				email: 'true', // Optional
			},
		},
	},
};

Amplify.configure(config);
```

- Configuration file can be found in [Authentication > Set up Amplify Auth > Set up your Auth backend resources > Existing resources](https://docs.amplify.aws/react/build-a-backend/auth/set-up-auth/)
```jsx TI:"src/App.jsx"
// Amplify -----
import { Amplify } from 'aws-amplify';

const config = {
	Auth: {
		Cognito: {
			//  Amazon Cognito User Pool ID
			userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,
			// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
			userPoolClientId: process.env.REACT_APP_CLIENT_ID,
		},
	},
};
Amplify.configure(config);
```
##### Conditionally show components based on logged in or logged out
___
Inside our `HomeFeedPage.jsx`
```jsx TI:"src\pages\HomeFeedPage.jsx"import './HomeFeedPage.css';

// Amplify -----
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export default function HomeFeedPage() {
	// Amplify -----
	//set state for user
	const [user, setUser] = React.useState(null);
	const dataFetchedRef = React.useRef(false);
    
  	// Amplify -----
	//check if we are authenticated using cognito
const checkAuth = async () => {
		getCurrentUser()
			.then(async (cognito_user) => {
				if (cognito_user) {
					const userAttributes = await fetchUserAttributes();
					setUser({
						display_name: userAttributes.name,
						handle: userAttributes.preferred_username,
					});
				}
			})
			.catch((error) => console.log('User not authenticated: ', error.message));
	};

	React.useEffect(() => {
		//prevents double call
		if (dataFetchedRef.current) return;
		dataFetchedRef.current = true;
        
        // Amplify -----
        checkAuth();
		loadData();
	}, []);

	return (
		<article>
			<DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
			<DesktopSidebar user={user} />
		</article>
	);
}


```

Notice we are passing user to `DesktopSidebar` components

We’ll have to update `ProfileInfo.jsx` to sign out the user properly from amplify
```jsx TI:"frontend-vite\src\components\ProfileInfo.jsx"
// Amplify ----
import { signOut } from 'aws-amplify/auth';

export default function ProfileInfo(props) {

   	// Amplify ----
	const handleSignOut = async () => {
		try {
			await signOut({ global: true });
			localStorage.setItem('access_token', '');
			window.location.href = '/';
		} catch (error) {
			console.log('error signing out: ', error);
		}
	};


	return (
		<div className={classes()}>
			<div className='profile-dialog'>
				<button onClick={handleSignOut}>Sign Out</button>
			</div>
		</div>
	);
}

```

Configure the `SignInPage.jsx` for AWS amplify
```jsx TI:"frontend-vite\src\components\SignInPage.jsx"

import React from 'react';
// Amplify -----
import { signIn } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function SigninPage() {
	const [email, setEmail] = React.useState('codewithenoch@gmail.com');
	const [password, setPassword] = React.useState('Codewithenoch@12345');
	// Amplify -----
	const [errors, setErrors] = React.useState('');

		// Amplify -----
	const onsubmit = async (event) => {
		setErrors('');
		event.preventDefault();

		const userInput = {
			username: email,
			password: password,
		};

		signIn(userInput)
			.then(({ isSignedIn }) => {
				console.log('🚀 ~ file: SigninPage.jsx:39 ~ .then ~ isSignedIn:', isSignedIn);
				if (isSignedIn) {
					fetchAuthSession().then(({ accessToken }) => {
						localStorage.setItem('access_token', accessToken);
						window.location.href = '/';
					});
				}
			})
			.catch((error) => {
				if (error.code == ' UserNotConfirmedException') {
					window.location.href = '/confirm';
				}
				setErrors(error.message);
			});
	};


	const email_onchange = (event) => {
		setEmail(event.target.value);
	};
	const password_onchange = (event) => {
		setPassword(event.target.value);
	};

	let el_errors;
	if (errors) {
		el_errors = <div className='errors'>{errors}</div>;
	}

	return (
	<>
		<form className='signin_form' onSubmit={onsubmit}>
			<h2>Sign into your Cruddur account</h2>
			<div className='fields'>
				<div className='field text_field username'>
					<label>Email</label>
					<input type='text' value={email} onChange={email_onchange} />
				</div>
				<div className='field text_field password'>
					<label>Password</label>
					<input type='password' value={password} onChange={password_onchange} />
				</div>
			</div>
			{el_errors}
			<div className='submit'>
				<Link to='/forgot' className='forgot-link'>
					Forgot Password?
				</Link>
				<button type='submit'>Sign In</button>
			</div>
		</form>
		<div className='dont-have-an-account'>
			<span>Don&apos;t have an account?</span>
			<Link to='/signup'>Sign up!</Link>
		</div>
	</>
	);
}
```

Configure the `SignUpPage.jsx` for AWS amplify
```jsx TI:"frontend-vite\src\components\SignUpPage.jsx"

import React from 'react';
// Amplify --------
import { signUp } from 'aws-amplify/auth';



export default function SignupPage() {
	// Username is Eamil
	const [name, setName] = React.useState('Enoch George');
	const [email, setEmail] = React.useState('codewithenoch@gmail.com');
	const [username, setUsername] = React.useState('codewithenoch');
	const [password, setPassword] = React.useState('Codewithenoch@12345');
	// eslint-disable-next-line no-unused-vars
	const [errors, setErrors] = React.useState('');

	// Amplify --------
	const onsubmit = async (event) => {
		event.preventDefault();
		try {
			const { isSignUpComplete, userId, nextStep } = await signUp({
				username: email,
				password: password,
				options: {
					userAttributes: {
						email: email,
						preferred_username: username,
						name: name, // E.164 number convention
					},
					// optional
					autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
				},
			});
			console.log({ isSignUpComplete, userId, nextStep });
			window.location.href = `/confirm?email=${email}`;
		} catch (error) {
			console.log('error signing up:', error);
			setErrors(error.message);
		}
	};

	const name_onchange = (event) => {
		setName(event.target.value);
	};
	const email_onchange = (event) => {
		setEmail(event.target.value);
	};
	const username_onchange = (event) => {
		setUsername(event.target.value);
	};
	const password_onchange = (event) => {
		setPassword(event.target.value);
	};

	let el_errors;
	if (errors) {
		el_errors = <div className='errors'>{errors}</div>;
	}

	return (
	
	<div className='signup-wrapper'>
		<form className='signup_form' onSubmit={onsubmit}>
			<h2>Sign up to create a Cruddur account</h2>
			<div className='fields'>
				<div className='field text_field name'>
					<label>Name</label>
					<input type='text' value={name} onChange={name_onchange} />
				</div>

				<div className='field text_field email'>
					<label>Email</label>
					<input type='text' value={email} onChange={email_onchange} />
				</div>

				<div className='field text_field username'>
					<label>Username</label>
					<input type='text' value={username} onChange={username_onchange} />
				</div>

				<div className='field text_field password'>
					<label>Password</label>
					<input type='password' value={password} onChange={password_onchange} />
				</div>
			</div>
			{el_errors}
			<div className='submit'>
				<button type='submit'>Sign Up</button>
			</div>
		</form>
	</div>
	);
}
```


Configure the `ConfrimationPage.jsx` for AWS amplify
```jsx TI:"frontend-vite\src\components\ConfrimationPage.jsx"
import React from 'react';
import { useSearchParams } from 'react-router-dom';
// Amplify ------
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';


export default function ConfirmationPage() {
	const [queryParameters] = useSearchParams();
	const [email, setEmail] = React.useState('');
	const [code, setCode] = React.useState('');
	const [errors, setErrors] = React.useState('');
	const [codeSent, setCodeSent] = React.useState(false);

	const code_onchange = (event) => {
		setCode(event.target.value);
	};
	const email_onchange = (event) => {
		setEmail(event.target.value);
	};

	// Amplify -----
	const resend_code = async (event) => {
		event.preventDefault();
		console.log('resend_code');
		setCodeSent(false);
		setErrors('');
		try {
			resendSignUpCode({ username: email });
			setCodeSent(true);
		} catch (errors) {
			console.log('🚀 ~ file: ConfirmationPage.jsx:36 ~ resend_code:', errors);
			setErrors(errors.message);
		}
	};

	// Amplify -----
	const onsubmit = async (event) => {
		event.preventDefault();
		console.log('ConfirmationPage.onsubmit');
		try {
			await confirmSignUp({ username: email, confirmationCode: code });
			window.location.href = '/';
		} catch (error) {
			console.log('🚀 ~ file: ConfirmationPage.jsx:48 ~ onsubmit ~ error:', error);
			setErrors(error.message);
		}
		return false;
	};


	let el_errors;
	if (errors) {
		el_errors = <div className='errors'>{errors}</div>;
	}

	let code_button;
	if (codeSent) {
		code_button = <div className='sent-message'>A new activation code has been sent to your email</div>;
	} else {
		code_button = (
			<button className='resend' onClick={resend_code}>
				Resend Activation Code
			</button>
		);
	}

	React.useEffect(() => {
		if (queryParameters.get('email')) {
			setEmail(queryParameters.get('email'));
		}
	}, [queryParameters]);

	return (
		<article className='confirm-article'>
		
			<div className='recover-wrapper'>
				<form className='confirm_form' onSubmit={onsubmit}>
					<h2>Confirm your Email</h2>
					<div className='fields'>
						<div className='field text_field email'>
							<label>Email</label>
							<input type='text' value={email} onChange={email_onchange} />
						</div>
						<div className='field text_field code'>
							<label>Confirmation Code</label>
							<input type='text' value={code} onChange={code_onchange} />
						</div>
					</div>
					{el_errors}
					<div className='submit'>
						<button type='submit'>Confirm Email</button>
					</div>
				</form>
			</div>
			{code_button}
		</article>
	);
}
```


Configure the `RecoverPage.jsx` for AWS amplify
```jsx TI:"frontend-vite\src\components\RecoverPage.jsx"
import React from 'react';
import { Link } from 'react-router-dom';

// Amplify ------
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

export default function RecoverPage() {
	// Username is Eamil
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [passwordAgain, setPasswordAgain] = React.useState('');
	const [code, setCode] = React.useState('');
	const [errors, setErrors] = React.useState('');
	const [formState, setFormState] = React.useState('send_code');

	// Amplify -----
	const onsubmit_send_code = async (event) => {
		event.preventDefault();
		console.log('onsubmit_send_code');
		setErrors('');
		resetPassword({ username: email })
			.then(() => {
				setFormState('confirm_code');
			})
			.catch((error) => setErrors(error.message));
		return false;
	};

	// Amplify ----
	const onsubmit_confirm_code = async (event) => {
		event.preventDefault();
		setErrors('');
		console.log('onsubmit_confirm_code');
		confirmResetPassword({ username: email, confirmationCode: code, newPassword: passwordAgain })
			.then(() => setFormState('success'))
			.catch((error) => setErrors(error.message));
		return false;
	};

	const email_onchange = (event) => {
		setEmail(event.target.value);
	};
	const password_onchange = (event) => {
		setPassword(event.target.value);
	};
	const password_again_onchange = (event) => {
		setPasswordAgain(event.target.value);
	};
	const code_onchange = (event) => {
		setCode(event.target.value);
	};

	let el_errors;
	if (errors) {
		el_errors = <div className='errors'>{errors}</div>;
	}

	const send_code = () => {
		return (
			<form className='recover_form' onSubmit={onsubmit_send_code}>
				<h2>Recover your Password</h2>
				<div className='fields'>
					<div className='field text_field username'>
						<label>Email</label>
						<input type='text' value={email} onChange={email_onchange} />
					</div>
				</div>
				{el_errors}
				<div className='submit'>
					<button type='submit'>Send Recovery Code</button>
				</div>
			</form>
		);
	};

	const confirm_code = () => {
		return (
			<form className='recover_form' onSubmit={onsubmit_confirm_code}>
				<h2>Recover your Password</h2>
				<div className='fields'>
					<div className='field text_field code'>
						<label>Reset Password Code</label>
						<input type='text' value={code} onChange={code_onchange} />
					</div>
					<div className='field text_field password'>
						<label>New Password</label>
						<input type='password' value={password} onChange={password_onchange} />
					</div>
					<div className='field text_field password_again'>
						<label>New Password Again</label>
						<input type='password' value={passwordAgain} onChange={password_again_onchange} />
					</div>
				</div>
				{errors}
				<div className='submit'>
					<button type='submit'>Reset Password</button>
				</div>
			</form>
		);
	};

	const success = () => {
		return (
			<form className='success'>
				<p>Your password has been successfully reset!</p>
				<Link to='/signin' className='proceed'>
					Proceed to Signin
				</Link>
			</form>
		);
	};

	let form;
	if (formState == 'send_code') {
		form = send_code();
	} else if (formState == 'confirm_code') {
		form = confirm_code();
	} else if (formState == 'success') {
		form = success();
	}

	return (
		<article className='recover-article'>
			<div className='recover-wrapper'>{form}</div>
		</article>
	);
}


```

#### Authenticating Server Side
___
This is in order to avoid unauthenticated users from accessing protected content. 

##### Sending Access Token  to backend
___
Setting the access_token to local storage `SigninPage.jsx`
```jsx TI:"frontend-vite\src\pages\SigninPage.jsx"
signIn(userInput)
			.then(({ isSignedIn }) => {
				console.log('🚀 ~ file: SigninPage.jsx:39 ~ .then ~ isSignedIn:', isSignedIn);
				if (isSignedIn) {
					fetchAuthSession().then(({ tokens }) => {
						localStorage.setItem('access_token', tokens.accessToken.toString());
						window.location.href = '/';
					});
				}
			})
			.catch((error) => {
				if (error.code == ' UserNotConfirmedException') {
					window.location.href = '/confirm';
				}
				setErrors(error.message);
			});
```

__Passing the `access_token` from frontend to backend__
Add in the `HomeFeedPage.js` a header to pass along the access token
```jsx TI:"frontend-vite\src\pages\HomeFeedPage.jsx"
const res = await fetch(backend_url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`,
			},
		});
```

##### Getting Access Token from frontend
___
Navigate to your backend router and update the following code in `app.py` where all the routers are set

Configuring logger to log outputs in the terminal 
```python TI:"app.py"
import logging

app = Flask(__name__)
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
## Make sure the debugger is on when running the application
if __name__ == "__main__":
  app.run(debug=True)
```

Set up the CORS to accept incoming headers from frontend
```python TI:"backend-flask\app.py"
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
```

Update the `/api/activities/home` route to log out the Authorization data:
```python TI:"app.py"
@app.route("/api/activities/home", methods=['GET'])
def data_home():
  app.logger.debug('AUTH HEADER -----')
  app.logger.debug(request.headers.get('Authorization'))
  data = HomeActivities.run()
  return data, 200
```

##### Decoding the Access Token in backend
___
We will be implementing our own Class to decode the JWT access token using this reference as a guide: [Doc](https://github.com/cgauge/Flask-AWSCognito/tree/master/flask_awscognito)

Add the following library to your `requirements.txt`
```txt TI:"requirements.txt"
python-jose
```

Install the package in the shell: `pip3 install -r requirements.txt`

Create a folder `lib` and create a python file `cognito_jwt_token.py` 
```python TI:"backend-flask\lib\cognito_jwt_token.py"
import time
import requests
from jose import jwk, jwt
from jose.exceptions import JOSEError
from jose.utils import base64url_decode

class FlaskAWSCognitoError(Exception):
    pass

class TokenVerifyError(Exception):
    pass


class CognitoJwtToken:
    def __init__(self, user_pool_id, user_pool_client_id, region, request_client=None):
        self.region = region
        if not self.region:
            raise FlaskAWSCognitoError("No AWS region provided")
        self.user_pool_id = user_pool_id
        self.user_pool_client_id = user_pool_client_id
        self.claims = None
        if not request_client:
            self.request_client = requests.get
        else:
            self.request_client = request_client
        self._load_jwk_keys()

    def _load_jwk_keys(self):
        keys_url = f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}/.well-known/jwks.json"
        try:
            response = self.request_client(keys_url)
            self.jwk_keys = response.json()["keys"]
        except requests.exceptions.RequestException as e:
            raise FlaskAWSCognitoError(str(e)) from e
        
    def extract_access_token(request_headers, HTTP_HEADER):
        access_token = None
        auth_header = request_headers.get(HTTP_HEADER)
        if auth_header and " " in auth_header:
            _, access_token = auth_header.split()
        return access_token

    @staticmethod
    def _extract_headers(token):
        try:
            headers = jwt.get_unverified_headers(token)
            return headers
        except JOSEError as e:
            raise TokenVerifyError(str(e)) from e

    def _find_pkey(self, headers):
        kid = headers["kid"]
        # search for the kid in the downloaded public keys
        key_index = -1
        for i in range(len(self.jwk_keys)):
            if kid == self.jwk_keys[i]["kid"]:
                key_index = i
                break
        if key_index == -1:
            raise TokenVerifyError("Public key not found in jwks.json")
        return self.jwk_keys[key_index]

    @staticmethod
    def _verify_signature(token, pkey_data):
        try:
            # construct the public key
            public_key = jwk.construct(pkey_data)
        except JOSEError as e:
            raise TokenVerifyError(str(e)) from e
        # get the last two sections of the token,
        # message and signature (encoded in base64)
        message, encoded_signature = str(token).rsplit(".", 1)
        # decode the signature
        decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))
        # verify the signature
        if not public_key.verify(message.encode("utf8"), decoded_signature):
            raise TokenVerifyError("Signature verification failed")

    @staticmethod
    def _extract_claims(token):
        try:
            claims = jwt.get_unverified_claims(token)
            return claims
        except JOSEError as e:
            raise TokenVerifyError(str(e)) from e

    @staticmethod
    def _check_expiration(claims, current_time):
        if not current_time:
            current_time = time.time()
        if current_time > claims["exp"]:
            raise TokenVerifyError("Token is expired")  # probably another exception

    def _check_audience(self, claims):
        # and the Audience  (use claims['client_id'] if verifying an access token)
        audience = claims["aud"] if "aud" in claims else claims["client_id"]
        if audience != self.user_pool_client_id:
            raise TokenVerifyError("Token was not issued for this audience")

    def verify(self, token, current_time=None):
        """ https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.py """
        if not token:
            raise TokenVerifyError("No token provided")

        headers = self._extract_headers(token)
        pkey_data = self._find_pkey(headers)
        self._verify_signature(token, pkey_data)

        claims = self._extract_claims(token)
        self._check_expiration(claims, current_time)
        self._check_audience(claims)

        self.claims = claims
        return claims
```

Make changes in `app.py` to decode the access token
```python TI:"app.py"
# Cognito JWT Token -----
from lib.cognito_jwt_token import CognitoJwtToken,TokenVerifyError

# Cognito JWT Token -----
cognito_jwt_token = CognitoJwtToken(
  user_pool_id=os.getenv('AWS_COGNITO_USER_POOLS_ID'),
  user_pool_client_id=os.getenv('AWS_COGNITO_CLIENT_ID'),
  region=os.getenv('AWS_COGNITO_REGION')
)

@app.route("/api/activities/home", methods=['GET'])
def data_home():
  access_token = CognitoJwtToken.extract_access_token(request.headers, 'Authorization')
  try:
    claims = cognito_jwt_token.verify(access_token)
    app.logger.debug('Authenticated Cognito User -----')
    app.logger.debug(claims)
  except TokenVerifyError as e:
    app.logger.error('Unauthenticated User')

  data = HomeActivities.run()
  return data, 200


```

##### Authenticating the `home` route
___
Access the received data, and return the authenticated post if the user exists or return `unauthicated`
```python TI:"app.py"
@app.route("/api/activities/home", methods=['GET'])
def data_home():
  access_token = CognitoJwtToken.extract_access_token(request.headers, 'Authorization')
  try:
    claims = cognito_jwt_token.verify(access_token)
    app.logger.debug('Authenticated Cognito User -----')
    cognito_user_id = claims['sub']
    app.logger.debug(cognito_user_id)
    data = HomeActivities.run(cognito_user_id=cognito_user_id) #return user authenticated post
    return data,200
  except TokenVerifyError as e:
    app.logger.error('Unauthenticated User')
    data = HomeActivities.run() #return all posts which are not authenticated
    return data,200

```

Add the data to results only if user exists else return all the unauthenticated posts. 
```python TI:"home_activities.py"
from datetime import datetime, timedelta, timezone
class HomeActivities:
  def run(cognito_user_id=None):
    # logger.info('hello_from_api_end_point: /api/activities/home')
    now = datetime.now(timezone.utc).astimezone()
    results = [
    {
      'uuid': '66e12864-8c26-4c3a-9658-95a10f8fea67',
      'handle':  'Worf',
      'message': 'I am out of prune juice',
      'created_at': (now - timedelta(days=7)).isoformat(),
      'expires_at': (now + timedelta(days=9)).isoformat(),
      'likes': 0,
      'replies': []
    },
    {
      'uuid': '248959df-3079-4947-b847-9e0892d1bab4',
      'handle':  'Garek',
      'message': 'My dear doctor, I am just simple tailor',
      'created_at': (now - timedelta(hours=1)).isoformat(),
      'expires_at': (now + timedelta(hours=12)).isoformat(),
      'likes': 0,
      'replies': []
    }
    ]
    # If user exists add this authenticated data to the reuslt
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
    return results
```

