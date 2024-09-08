import './MessageFeed.css';
import MessageItem from './MessageItem';

export default function MessageFeed(props) {
	return (
		<div className='message_feed'>
			<div className='message_feed_heading'>
				<div className='title'>Messagesdfsdfsdfs</div>
			</div>
			<div className='message_feed_collection'>
				{props.messages.map((message) => {
					return <MessageItem key={message.uuid} message={message} />;
				})}
				<MessageItem
					message={{
						display_name: 'Enoch',
						handle: 'enochgeorge9x9',
						message: 'hello world',
						created_at: '11/10/2024',
					}}
				/>
				<h1>Hello world</h1>
			</div>
		</div>
	);
}
