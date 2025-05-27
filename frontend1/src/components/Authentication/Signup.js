import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pics, setPics] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toast = useToast();

  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);

  
  const postDetail = (pics) => {
    console.log("postDetail function triggered"); // ✅ Step 1: Check if function runs

    setLoading(true);

    if (pics === undefined) {
      console.log("No image selected!"); // ✅ Step 2: Confirm if this condition is met

      toast({
        title: "Please Select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      return;
    }

    console.log("Image received:", pics); // ✅ Step 3: Confirm image is received

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", "chat-APP11");

      fetch("https://api.cloudinary.com/v1_1/chat-APP11/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.url.toString()) {
            setPics(data.url.toString());
            toast({
              title: "Image uploaded successfully.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } else {
            console.error("Invalid response from Cloudinary:", data);
            toast({
              title: "Failed to upload image.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
          toast({
            title: "Failed to upload image.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select a valid image (JPEG/PNG).",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: "Password do not match",
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
          "Content-type":"application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pics },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    

      setLoading(false);

      // history.push("/chats");
      
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
        <FormControl id="first-name" isRequired>
          <FormLabel>First name</FormLabel>
          <Input
            placeholder="First name"
            id="firstName"
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormControl>

        <FormControl id="password1" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Password"
              id="signup-password"
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              autoComplete="new-password"
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirmPassword1" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Confirm Password"
              id="confirm-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={show1 ? "text" : "password"}
              autoComplete="new-password"
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick1}>
                {show1 ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Profile Picture</FormLabel>
          <Input
            id="profilePicture"
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetail(e.target.files[0])}
          />
        </FormControl>

        <Button
          width="100%"
          colorScheme="blue"
          style={{ marginTop: "15px" }}
          type="submit"
          onClick={submitHandler}
          isLoading={loading}
        >
          Signup
        </Button>
      </VStack>
    </form>
  );
};

export default Signup;
