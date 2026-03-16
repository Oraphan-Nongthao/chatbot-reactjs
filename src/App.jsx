import ChatbotIcon from "./components/ChatbotIcon";

const App = () => {
  return <div className="container">
    <div className="chatbot-popup">
      {/* Chatbot Header */}
      <div className="chatbot-header">
        <div className="head-info">
          <ChatbotIcon/>
          <h2 className="logo-text">Chatbot</h2>
        </div>
        <button className="material-symbols-rounded">keyboard_arrow_down</button>

      </div>
    
      {/* Chatbot Body */}
      <div className="chat-body">
        <div className="message bot-meessage">
        <ChatbotIcon/>
        <p className="message-text">
          Hey there 👋 <br /> How can I help you today?
        </p>
        </div>
        <div className="message user-meessage">
        <p className="message-text">lorem ipsum dolor, sit amet consecteetur adipisicing.</p>
        </div>
      </div>
      <div className="chat-footer">
         
      </div>
    </div>
  </div>;

};

export default App;