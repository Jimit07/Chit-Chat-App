import React, { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../components/ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();
  if (!user) return null; // ✅ ADD THIS LINE
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter name or email to search ",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      if (!user || !user.tokens) {
        throw new Error("User not authenticated");
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user.tokens}`, // assuming token is stored in user.tokens
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
      console.log("Search result:", data);

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        position: "bottom-left",
        isClosable: "true",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.tokens}`, //used tokens above if any error change to token or ulta
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoadingChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Backend error:", error.response?.data); // This is critical

      toast({
        title: "Error Fetching Chats",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        position: "bottom-left",
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        p="5px 10px 5px 10px"
        bg="white"
        borderWidth="5px"
      >
        {/* when we hover on button it will show its use  */}
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost">
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text
              display={{ base: "none", md: "flex" }}
              px={4}
              onClick={onOpen}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work-sans">
          Chit-Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p="1px" position="relative">
              <BellIcon fontSize="2xl" m={1} />
              {notification.length > 0 && (
                <Badge
                  position="absolute"
                  top="0"
                  right="0"
                  colorScheme="red"
                  borderRadius="full"
                  px={2}
                  fontSize="0.8em"
                >
                  {notification.length}
                </Badge>
              )}
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem onClick={onOpen}>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer onClose={onClose} isOpen={isOpen} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb="2">
              <Input
                type="text"
                id="search-input"
                placeholder="Search by Name or Email"
                mr="2px"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>

              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
