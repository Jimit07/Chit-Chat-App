import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Miscellinious/SideDrawer";
import MyChat from "../Miscellinious/MyChat";
import ChatBox from "../Miscellinious/ChatBox";


// fetching data from backend and displaying on frontend

const ChatsPage = () => {
  const user = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        p="10px"
      >
        {user && <MyChat />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatsPage;
