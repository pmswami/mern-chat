import React from "react";
import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";

function ChatContainer() {
  return (
    <div className="flex fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex-col md:static md:flex-1">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
}

export default ChatContainer;
