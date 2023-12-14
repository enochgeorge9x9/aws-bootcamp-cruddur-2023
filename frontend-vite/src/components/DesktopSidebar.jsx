import './DesktopSidebar.css';
import Search from '../components/Search';
import TrendingSection from '../components/TrendingsSection';
import SuggestedUsersSection from '../components/SuggestedUsersSection';
import JoinSection from '../components/JoinSection';
import { useEffect, useState } from 'react';

const trendings = [
	{ hashtag: '100DaysOfCloud', count: 2053 },
	{ hashtag: 'CloudProject', count: 8253 },
	{ hashtag: 'AWS', count: 9053 },
	{ hashtag: 'FreeWillyReboot', count: 7753 },
];
const users = [{ display_name: 'Andrew Brown', handle: 'andrewbrown' }];

export default function DesktopSidebar({ user }) {
	const [isUser, setIsUser] = useState(false);

	useEffect(() => {
		if (user) {
			setIsUser(true);
		} else {
			setIsUser(false);
		}
	}, [user]);

	return (
		<section>
			<Search />
			{isUser ? (
				<>
					<TrendingSection trendings={trendings} />
					<SuggestedUsersSection users={users} />
				</>
			) : (
				<JoinSection />
			)}

			<footer>
				<a href='#'>About</a>
				<a href='#'>Terms of Service</a>
				<a href='#'>Privacy Policy</a>
			</footer>
		</section>
	);
}
