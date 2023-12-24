import { Link } from 'react-router-dom';
import HomeIcon from './svg/home.svg?react';
import NotificationsIcon from './svg/notifications.svg?react';
import ProfileIcon from './svg/profile.svg?react';
import MoreIcon from './svg/more.svg?react';
import MessagesIcon from './svg/messages.svg?react';

export default function DesktopNavigationLink(props) {
	const classes = () => {
		const classes = ['primary'];
		if (props.handle === props.active) {
			classes.push('active');
		}
		return classes.join(' ');
	};

	const icon = () => {
		switch (props.handle) {
			case 'home':
				return <HomeIcon className='icon' />;
				// eslint-disable-next-line no-unreachable
				break;
			case 'notifications':
				return <NotificationsIcon className='icon' />;
				break;
			case 'profile':
				return <ProfileIcon className='icon' />;
				break;
			case 'more':
				return <MoreIcon className='icon' />;
				break;
			case 'messages':
				return <MessagesIcon className='icon' />;
				break;
		}
	};

	return (
		<Link to={props.url} className={classes()} href='#'>
			{icon()}
			<span>{props.name}</span>
		</Link>
	);
}
