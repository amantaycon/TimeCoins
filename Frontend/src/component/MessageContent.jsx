const MessageContent = ({ msg }) => {
  if (msg.type === "Text") {
    return <div className="message-content">{msg.content}</div>;
  }

  if (msg.type === "Money") {
    const [status, amount] = msg.content.split("---").map(s => s.trim());
    const isSuccess = status.toLowerCase().includes("success");

    return (
      <div className={`money-bubble ${isSuccess ? "success" : "failed"}`}>
        {/* Amount big */}
        <div className="money-amount">{amount} TC</div>

        {/* Status small below */}
        <div className="money-status">
          {isSuccess ? "✅ Transfer Successful" : `❌ ${status.trim()}`}
        </div>
      </div>
    );
  }

  return <div className="message-content">Unsupported message type</div>;
};


export default MessageContent;
