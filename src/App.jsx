import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();
  // format chat history for API request
  const generateBotResponse = async (history) => {
    history = history.map(({role, text}) => ({ role, parts:[{text}]}));

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type" : "application/json" },
      body: JSON.stringify({contents: history})
    };

    try {
      // Make the API call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something went wrong!" );

      // ดึง text จาก API response ของ Gemini
      const botMessage = data.candidates[0].content.parts[0].text;
      
      // อัปเดต chatHistory ด้วย bot's response จริง
      // แทนที่ "Thinking..." message ด้วยคำตอบจริง
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1] = {
          role: "model",
          text: botMessage
        };
        return updatedHistory;
      });

    } catch(error) {
      console.error("Error:", error);
      
      // แสดง error message ใน UI แทนที่ "Thinking..."
      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory];
        updatedHistory[updatedHistory.length - 1] = {
          role: "model",
          text: "Sorry, something went wrong. Please try again."
        };
        return updatedHistory;
      });
    }
  };

  useEffect(() => {
    // เลื่อน chat body ลงด้านล่างสุดเมื่อมีข้อความใหม่เข้ามา
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return <div className={`container ${showChatbot ? " show-chatbot" : ""}`}>
    <button onClick={() => setShowChatbot((prev) => !prev)} 
    id="chatbot-toggler">
      <span className="material-symbols-rounded">mode_comment</span>
      <span className="material-symbols-rounded">close</span>
    </button>

    <div className="chatbot-popup">
      {/* Chatbot Header */}
      <div className="chatbot-header">
        <div className="header-info">
          <ChatbotIcon />
          <h2 className="logo-text">Chatbot</h2>
        </div>
        <button onClick={() => setShowChatbot((prev) => !prev)}
        className="material-symbols-rounded">keyboard_arrow_down</button>

      </div>
    
      {/* Chatbot Body */}
      <div ref={chatBodyRef} className="chat-body">
        <div className="message bot-message">
          <ChatbotIcon />
        <p className="message-text">
          Hey there 👋 <br /> How can I help you today?
        </p>
        </div>

        {/* Render the chat history dynamically */}
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      {/* Chatbot Footer */}
      <div className="chat-footer">
        <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
      </div>
    </div>
  </div>;

};

export default App;