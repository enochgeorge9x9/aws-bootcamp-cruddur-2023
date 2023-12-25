import './ConfirmationPage.css';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Logo from '../components/svg/logo.svg?react';

// [TODO] Authenication
// import Cookies from 'js-cookie';

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
	// const onsubmit = async (event) => {
	// 	event.preventDefault();
	// 	console.log('ConfirmationPage.onsubmit');
	// 	// [TODO] Authenication
	// 	if (Cookies.get('user.email') === undefined || Cookies.get('user.email') === '' || Cookies.get('user.email') === null) {
	// 		setErrors('You need to provide an email in order to send Resend Activiation Code');
	// 	} else {
	// 		if (Cookies.get('user.email') === email) {
	// 			if (Cookies.get('user.confirmation_code') === code) {
	// 				Cookies.set('user.logged_in', true);
	// 				window.location.href = '/';
	// 			} else {
	// 				setErrors('Code is not valid');
	// 			}
	// 		} else {
	// 			setErrors('Email is invalid or cannot be found.');
	// 		}
	// 	}
	// 	return false;
	// };

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
			<div className='recover-info'>
				<Logo className='logo' />
			</div>
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
