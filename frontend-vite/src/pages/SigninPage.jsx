import './SigninPage.css';
import React from 'react';
import Logo from '../components/svg/logo.svg?react';
import { Link } from 'react-router-dom';

// [TODO] Authenication
// import Cookies from 'js-cookie';

// Amplify -----
import { signIn } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

// eslint-disable-next-line no-unused-vars
const andrewUser = {
	email: 'andrew@exampro.co',
	password: 'Andrew@12345',
};
// eslint-disable-next-line no-unused-vars
const enochUser = {
	email: 'codewithenoch@gmail.com',
	password: 'Codewithenoch@12345',
};
export default function SigninPage() {
	const [email, setEmail] = React.useState(enochUser.email);
	const [password, setPassword] = React.useState(enochUser.password);
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
	};

	// const onsubmit = async (event) => {
	// 	event.preventDefault();
	// 	setErrors('');
	// 	console.log('onsubmit');
	// 	if (Cookies.get('user.email') === email && Cookies.get('user.password') === password) {
	// 		Cookies.set('user.logged_in', true);
	// 		window.location.href = '/';
	// 	} else {
	// 		setErrors("Email and password is incorrect or account doesn't exist");
	// 	}
	// 	return false;
	// };

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
		<article className='signin-article'>
			<div className='signin-info'>
				<Logo className='logo' />
			</div>
			<div className='signin-wrapper'>
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
			</div>
		</article>
	);
}
