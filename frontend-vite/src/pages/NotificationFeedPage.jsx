import './NotificationFeedPage.css';
import React from 'react';

import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';

// [TODO] Authenication
import Cookies from 'js-cookie';

export default function NotificationFeedPage() {
	const [activities, setActivities] = React.useState([]);
	const [popped, setPopped] = React.useState(false);
	const [poppedReply, setPoppedReply] = React.useState(false);
	const [replyActivity, setReplyActivity] = React.useState({});
	const [user, setUser] = React.useState(null);
	const dataFetchedRef = React.useRef(false);

	const loadData = async () => {
		try {
			// eslint-disable-next-line no-undef
			const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/notifications`;
			const res = await fetch(backend_url, {
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

	const checkAuth = async () => {
		console.log('🚀 ~ file: HomeFeedPage.jsx:40 ~ checkAuth ~ checkAuth:', 'checkAuth');
		// [TODO] Authentication
		if (Cookies.get('user.logged_in')) {
			setUser({
				display_name: Cookies.get('user.name'),
				handle: Cookies.get('user.username'),
			});
		}
	};

	React.useEffect(() => {
		//prevents double call
		if (dataFetchedRef.current) return;
		dataFetchedRef.current = true;

		checkAuth();
		loadData();
	}, []);

	return (
		<article>
			<DesktopNavigation user={user} active={'notifications'} setPopped={setPopped} />
			<div className='content'>
				<ActivityForm popped={popped} setPopped={setPopped} setActivities={setActivities} />
				<ReplyForm activity={replyActivity} popped={poppedReply} setPopped={setPoppedReply} setActivities={setActivities} activities={activities} />
				<ActivityFeed title='Notifications' setReplyActivity={setReplyActivity} setPopped={setPoppedReply} activities={activities} />
			</div>
			<DesktopSidebar user={user} />
		</article>
	);
}
