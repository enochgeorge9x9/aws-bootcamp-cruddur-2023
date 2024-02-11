import './HomeFeedPage.css';
import React from 'react';

import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

// [TODO] Authentication
// eslint-disable-next-line no-unused-vars
import Cookies from 'js-cookie';

// Amplify -----
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export default function HomeFeedPage() {
	const [activities, setActivities] = React.useState([]);
	const [popped, setPopped] = React.useState(false);
	const [poppedReply, setPoppedReply] = React.useState(false);
	const [replyActivity, setReplyActivity] = React.useState({});
	//set state for user
	const [user, setUser] = React.useState(null);
	const dataFetchedRef = React.useRef(false);

	const loadData = async () => {
		try {
			// eslint-disable-next-line no-undef
			const backend_url = `${import.meta.env.VITE_APP_BACKEND_URL}/api/activities/home`;
			const res = await fetch(backend_url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
				},
				method: 'GET',
			});
			let resJson = await res.json();
			if (res.status === 200) {
				setActivities(resJson);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// Temporary fix for authentication using Cookies
	// const checkAuth = async () => {
	// 	console.log('🚀 ~ file: HomeFeedPage.jsx:40 ~ checkAuth ~ checkAuth:', 'checkAuth');
	// 	// [TODO] Authentication
	// 	if (Cookies.get('user.logged_in')) {
	// 		setUser({
	// 			display_name: Cookies.get('user.name'),
	// 			handle: Cookies.get('user.username'),
	// 		});
	// 	}
	// };

	// Amplify -----
	//check if we are authenticated using cognito
	const checkAuth = async () => {
		getCurrentUser()
			.then(async (cognito_user) => {
				if (cognito_user) {
					const userAttributes = await fetchUserAttributes();
					console.log('🚀 ~ file: HomeFeedPage.jsx:62 ~ checkAuth ~ userAttributes:', userAttributes);
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
			<div className='content'>
				<ActivityForm user={user} popped={popped} setPopped={setPopped} setActivities={setActivities} />
				<ReplyForm activity={replyActivity} popped={poppedReply} setPopped={setPoppedReply} setActivities={setActivities} activities={activities} />
				<ActivityFeed title='Home' setReplyActivity={setReplyActivity} setPopped={setPoppedReply} activities={activities} />
			</div>
			<DesktopSidebar user={user} />
		</article>
	);
}
