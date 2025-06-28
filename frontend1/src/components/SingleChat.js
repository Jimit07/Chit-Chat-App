import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFullInfo } from "../config/ChatLogics";
import ProfileModal from "../Miscellinious/ProfileModal";
import UpdateGroupChatModel from "../Miscellinious/UpdateGroupChatModel";
import io from "socket.io-client";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { useRef } from "react";
import Lottie from "lottie-react";
import animationData from "../Animation/typing.json";


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [connectedSocket, setConnectedSocket] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

 

  const toast = useToast();

  const ENDPOINT = "http://localhost:5000";

  // var socket, selectedChatCompare; before
  const socket = useRef();
  const selectedChatCompare = useRef();

  const { user, selectedChat, setSelectedChat , notification , setNotification } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 sec pause

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.tokens}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}?page=${page}`, // your backend needs to support pagination
        config
      );

      // infinite scroll
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setMessage(() => [...data, ...message]);
        setPage(page + 1);
      }

  
      setMessage(data);
      setLoading(false);

      // socket.emit("join chat", selectedChat._id);
      if (socket.current) {
        socket.current.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the Messages",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "bottom",
      });
    }
  };

  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   socket.emit("setup", user);
  //   socket.on("connection", () => setConnectedSocket(true));
  // }, []);

  useEffect(() => {
    socket.current = io(ENDPOINT); // Establish connection
    socket.current.emit("setup", user); // Send user info to server
    socket.current.on("connected", () => {
      setConnectedSocket(true);
    }); // listen for connection confirmation
    socket.current.on("typing", () => {
      setIsTyping(true);
    });
    socket.current.on("stop typing", () => {
      setIsTyping(false);
    });

    return () => socket.current.disconnect(); // Clean up on unmount
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare.current = selectedChat; // store current chat for comparison
  }, [selectedChat]);
  

 
  useEffect(() => {
    if (!socket.current) return; // check before, done by me

    socket.current.on("message received", (newMessagereceived) => {
      if (
        !selectedChatCompare.current ||
        selectedChatCompare.current._id !== newMessagereceived.chat._id
      ) {
        //give notification
        if(!notification.includes(newMessagereceived)){
          setNotification([newMessagereceived, ...notification]);
          setFetchAgain(!fetchAgain) ; //triggers fetch again to update chat list
        }
      } else {
        setMessage([...message, newMessagereceived]);
      }
    });
    return () => {
      socket.current.off("message received"); // cleanup to avoid double listeners
    };
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.current.emit("stop typing", selectedChat._id); //stop typing indicator
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.tokens}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

      

        socket.current.emit("new message", data); //emit new message to server

        setMessage([...message, data]);
      } catch (error) {
        toast({
          title: "Error occured",
          description: "Falied to send the message",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic
    if (!connectedSocket) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000; // 3 second

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.current.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFullInfo(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}

                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div class="messages">
                <ScrollableChat
                  message={message}
                  fetchMessages={fetchMessages}
                  hasMore={hasMore}
                />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? 
              <div>
                <Lottie 
                animationData={animationData}
                loop={true}
                width={70}
                style={{ height: 70, marginBottom: 1, marginLeft: 0 , marginRight:550}}
                />
              </div> : <></>}
              <Input
                varient="filled"
                bg="E0E0E0"
                placeholder="Type a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on the user to Start a chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
