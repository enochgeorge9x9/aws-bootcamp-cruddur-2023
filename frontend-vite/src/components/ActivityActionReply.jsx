import  ReplyIcon from './svg/reply.svg?react';

export default function ActivityActionReply(props) { 
  const onclick = (event) => {
    props.setReplyActivity(props.activity)
    props.setPopped(true)
  }

  let counter;
  if (props.count > 0) {
    counter = <div className="counter">{props.count}</div>;
  }

  return (
    <div onClick={onclick} className="action activity_action_reply">
      <ReplyIcon className='icon' />
      {counter}
    </div>
  )
}