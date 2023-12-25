import './SignupPage.css';
import React from 'react';
import Logo from '../components/svg/logo.svg?react';
import { Link } from 'react-router-dom';

// [TODO] Authenication
// import Cookies from 'js-cookie'
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

	//   const onsubmit = async (event) => {
	//     event.preventDefault();
	//     console.log('SignupPage.onsubmit')
	//     // [TODO] Authenication
	//     Cookies.set('user.name', name)
	//     Cookies.set('user.username', username)
	//     Cookies.set('user.email', email)
	//     Cookies.set('user.password', password)
	//     Cookies.set('user.confirmation_code',1234)
	//     window.location.href = `/confirm?email=${email}`
	//     return false
	//   }

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
		<article className='signup-article'>
			<div className='signup-info'>
				<Logo className='logo' />
			</div>
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
				<div className='already-have-an-account'>
					<span>Already have an account?</span>
					<Link to='/signin'>Sign in!</Link>
				</div>
			</div>
		</article>
	);
}
