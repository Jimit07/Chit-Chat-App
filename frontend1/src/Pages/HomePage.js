import React, { useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import Signup from "../components/Authentication/Signup";
import Login from "../components/Authentication/Login";
import { useNavigate } from "react-router-dom";

console.log("Signup:", Signup); // Should log a function or class
console.log("Login:", Login); // Should log a function or class

const HomePage = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("userInfo"));
  
    if(user){
      navigate('/chats')
    }
  });
  return (
    <Container maxW="xl" centerContent>
      <Box
        bg="white"
        d="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text textAlign="center" fontSize="4xl" fontFamily="Work sans">
          Communicator
        </Text>
      </Box>
      <Box bg="white" p={4} w="100%" borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>

              <Login />

            </TabPanel>
            <TabPanel>

              <Signup />
              
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;