import {
  FormControl,
  Text,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Spinner,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";



const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.tokens}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async() => {
    if(!groupChatName || !selectedUser){
      toast({
        title:"Please fill all the fields",
        status:"warning",
        isClosable:"true",
        duration:"5000",
        position:"top",
      })
      return;
    }


    try{
      const config={
        header:{
          Authorization:`Bearer ${user.tokens}`
        }
      }

      const {data}= await axios.post("/api/chat/group",{
        name:groupChatName,
        user:JSON.stringify(selectedUser.map((u)=>u._id)),
      } ,
       config
      );

      setChats([data,...chats])
      onClose();
       toast({
        title:"New Group Chat Succedssfully Created",
        status:"success",
        isClosable:"true",
        duration:"5000",
        position:"bottom",
      });

    }catch(error){
      toast({
        title:"Failed to create the chat",
        status:"error",
        isClosable:"true",
        duration:"5000",
        position:"bottom",
      });

    }
  }
  
  

  const handleDelete = (delUser) => {
    setSelectedUser(selectedUser.filter((select)=>select._id !== delUser._id))
  };
  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="work-sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add users eg: Jaydeep , Jiya ,Aadi"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* selected user */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUser.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* render searched user */}

            {loading ? (
              <div>
                <Spinner />
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export default GroupChatModel;
