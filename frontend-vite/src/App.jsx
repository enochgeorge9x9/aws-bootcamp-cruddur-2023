/* eslint-disable no-undef */
import './App.css';
import HomeFeedPage from './pages/HomeFeedPage';
import NotficationFeedPage from './pages/NotificationFeedPage';
import UserFeedPage from './pages/UserFeedPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import RecoverPage from './pages/RecoverPage';
import MessageGroupsPage from './pages/MessageGroupsPage';
import MessageGroupPage from './pages/MessageGroupPage';
import ConfirmationPage from './pages/ConfirmationPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Amplify -----
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

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeFeedPage />,
	},
	{
		path: '/notifications',
		element: <NotficationFeedPage />,
	},
	{
		path: '/@:handle',
		element: <UserFeedPage />,
	},
	{
		path: '/messages',
		element: <MessageGroupsPage />,
	},
	{
		path: '/messages/@:handle',
		element: <MessageGroupPage />,
	},
	{
		path: '/signup',
		element: <SignupPage />,
	},
	{
		path: '/signin',
		element: <SigninPage />,
	},
	{
		path: '/confirm',
		element: <ConfirmationPage />,
	},
	{
		path: '/forgot',
		element: <RecoverPage />,
	},
]);

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
