import './RecoverPage.css';
import React from 'react';
import Logo from '../components/svg/logo.svg?react';
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
			<div className='recover-info'>
				<Logo className='logo' />
			</div>
			<div className='recover-wrapper'>{form}</div>
		</article>
	);
}
