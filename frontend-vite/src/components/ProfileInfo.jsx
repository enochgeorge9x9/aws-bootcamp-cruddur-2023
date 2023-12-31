import './ProfileInfo.css';
import ElipsesIcon from './svg/elipses.svg?react';
import React from 'react';

// [TODO] Authenication
// Amplify ----
import { signOut } from 'aws-amplify/auth';

export default function ProfileInfo(props) {
	const [popped, setPopped] = React.useState(false);

	// eslint-disable-next-line no-unused-vars
	const click_pop = (event) => {
		setPopped(!popped);
	};

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

	const classes = () => {
		let classes = ['profile-info-wrapper'];
		if (popped == true) {
			classes.push('popped');
		}
		return classes.join(' ');
	};

	return (
		<div className={classes()}>
			<div className='profile-dialog'>
				<button onClick={handleSignOut}>Sign Out</button>
			</div>
			<div className='profile-info' onClick={click_pop}>
				<div className='profile-avatar'></div>
				<div className='profile-desc'>
					<div className='profile-display-name'>{props.user.display_name || 'My Name'}</div>
					<div className='profile-username'>@{props.user.handle || 'handle'}</div>
				</div>
				<ElipsesIcon className='icon' />
			</div>
		</div>
	);
}
