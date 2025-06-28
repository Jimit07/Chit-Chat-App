import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ message, fetchMessages, hasMore }) => {
  const { user } = ChatState();

  return (
    <div
      id="scrollableDiv"
      style={{
        height: "400px",
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse", // important for chat style
      }}
    >
      <InfiniteScroll
        dataLength={message.length}
        next={fetchMessages}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        inverse={true}
        scrollableTarget="scrollableDiv"
      >
        {message &&
          message.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(message, m, i, user._id) ||
                isLastMessage(message, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor:
                    m.sender._id === user._id ? "#BEE3F8" : "#89F5D0",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(message, m, i, user._id),
                  marginTop: isSameUser(message, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default ScrollableChat;
