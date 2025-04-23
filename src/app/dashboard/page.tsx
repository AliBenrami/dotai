"use client";
import { useEffect, useState, useRef } from "react";
import { ai } from "../components/gemini";
import { supabase } from "../components/supabaseClient";
import ReactMarkdown from "react-markdown";
import { Chat } from "@google/genai";
import { UUIDTypes, v4 as uuidv4 } from "uuid";

interface part {
  text: string;
}
interface Messages {
  role: "user" | "model";
  parts: part[];
}

export default function Chatbot() {
  const [contents, setContents] = useState<Messages[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [chat, setChat] = useState<Chat | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<UUIDTypes | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (chat === undefined) {
      setChat(
        ai.chats.create({
          model: "gemini-2.0-flash",
          history: contents,
        })
      );
    }
  }, [chat, contents]);

  const sendMessageToDB = async (currentMessage: Messages) => {
    await supabase
      .from("messageTable")
      .insert([
        {
          itter: uuidv4(),
          chat_id: chatId,
          text: currentMessage.parts[0].text,
          sender: currentMessage.role,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
  };

  const getChat = async () => {
    const { data: chatTable } = await supabase
      .from("chatTable")
      .select("*")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);
    return chatTable;
  };

  const createChatContext = async () => {
    const genChatid = uuidv4();
    setChatId(genChatid);
    await supabase
      .from("chatTable")
      .insert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          chat_id: genChatid,
          title: "title 1",
          created_at: new Date().toISOString(),
        },
      ])
      .select();
  };

  const getMessageContext = async () => {
    const chatids = await getChat();
    let currentChatId = chatId;

    if (chatids?.length) {
      currentChatId = chatids[0].chat_id;
      setChatId(currentChatId);
    } else {
      await createChatContext();
      currentChatId = chatId;
    }

    const { data: messageTable } = await supabase
      .from("messageTable")
      .select("*")
      .eq("chat_id", currentChatId)
      .order("created_at", { ascending: true });

    setContents(
      messageTable
        ? messageTable.map((tableEle) => ({
            role: tableEle.sender as "user" | "model",
            parts: [{ text: tableEle.text }],
          }))
        : []
    );
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      console.log(data);
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setIsAuthenticated(true);
      }
    };

    if (!hasRun.current) {
      getMessageContext();
      hasRun.current = true;
      checkAuth();
    }
  }, []);

  // Auto scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [contents, isLoading]);

  const sendMessage = async () => {
    const user: Messages = {
      role: "user",
      parts: [
        {
          text: userMessage,
        },
      ],
    };

    sendMessageToDB(user);
    setUserMessage("");
    setContents((prev) => [...prev, user]);
    setIsLoading(true);

    if (chat) {
      try {
        const result = await chat.sendMessage({ message: userMessage });
        const responseText = result.text ?? "";

        const model: Messages = {
          role: "model",
          parts: [
            {
              text: responseText,
            },
          ],
        };
        sendMessageToDB(model);
        setContents((prev) => [...prev, model]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const MessageUI = (message: Messages, index: number) => {
    return (
      <div
        key={`${index}:${message.role}`}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        } mb-4`}
      >
        {message.role === "model" && (
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
        )}
        <div
          className={`max-w-[70%] rounded-2xl p-4 shadow-md ${
            message.role === "user"
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
          }`}
        >
          <ReactMarkdown>
            {message.parts.map((x) => x.text).join("")}
          </ReactMarkdown>
        </div>
        {message.role === "user" && (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2">
            <span className="text-xs font-bold text-white">You</span>
          </div>
        )}
      </div>
    );
  };

  // Don't render chat interface until authentication is confirmed
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
        <p className="text-white mt-4">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-900 w-screen h-screen overflow-hidden">
      <div className="bg-gray-800 p-3 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white text-center">Dot.AI</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
        {contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mb-4 text-blue-500"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="text-lg">Start a conversation with Gemini AI</p>
            <p className="text-sm mt-2">Type a message below to begin</p>
          </div>
        ) : (
          <>
            {contents.map(MessageUI)}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
                <div className="max-w-[70%] rounded-2xl p-4 shadow-md bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              userMessage.trim() &&
              sendMessage()
            }
            placeholder="Type your message here..."
            className="flex-1 bg-gray-700 text-white rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!userMessage.trim() || isLoading}
            className="bg-blue-600 rounded-full p-3 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors focus:ring-2 focus:ring-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13"></path>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
