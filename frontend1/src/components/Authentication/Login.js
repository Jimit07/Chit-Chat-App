import React, { useState } from "react";
import {
  VStack,
  FormLabel,
  FormControl,
  Input,
  InputRightElement,
  Button,
  InputGroup,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();
  const toast = useToast();
  const navigate = useNavigate();

  const changeButtonShow = () => {
    setShow(!show);
  };
    
    const submitHandler = async (e) => {
      e.preventDefault();
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
         

        setLoading(false);

        // history.push("/chats"); old way removed from react router dom new way below it 
        navigate("/chats");
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };
   

  

  return (
    <form>
      <VStack spacing="5px" color="black">
        <FormControl id="Email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            autoCapitalize="email"
            value={email}
          />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder={"Password"}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={changeButtonShow}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          width="100%"
          colorScheme="blue"
          style={{ marginTop: "15px" }}
          onClick={ submitHandler}
          isLoading={loading}
        >
          Login
        </Button>

        <Button
          width="100%"
          colorScheme="red"
          variant="solid"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("guest123");
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
