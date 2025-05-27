// import { Box, Text, Avatar } from "@chakra-ui/react";
// import React from "react";

// const UserListAvatar = ({ user, handleFunction }) => {
//   console.log("Rendering UserListAvatar for:", user.name); // DEBUG

//   return (
//     <Box
//       onClick={handleFunction}
//       bg="tomato" // MAKE IT OBVIOUSLY VISIBLE
//       color="white"
//       px={3}
//       py={2}
//       my={2}
//     >
//       <Text>{user.name}</Text>
//     </Box>
//   );

//   return (
//     <Box
//       onClick={handleFunction}
//       cursor="pointer"
//       bg="#E8E8E8"
//       _hover={{
//         background: "#38B2AC",
//         color: "white",
//       }}
//       width="100%"
//       display="flex"
//       alignItems="center"
//       color="black"
//       px={3}
//       py={2}
//       mb={2}
//       borderRadius="lg"
//     >
//       {console.log("User received by UserListAvatar:", user)}
//       <Avatar
//         mr={2}
//         cursor="pointer"
//         size="sm"
//         name={user.name}
//         src={user.pic}
//       />
//       <Box>
//         <Text>{user.name}</Text>
//         <Text fontSize="xs">
//           <b>Email :</b>
//           {user.email}
//         </Text>
//       </Box>
//     </Box>
//   );
// };

// export default UserListAvatar;

import { Box, Text, Avatar } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  console.log("User received by UserListAvatar:", user);

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        cursor="pointer"
        size="sm"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email :</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem ;
