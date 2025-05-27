import { Stack , Skeleton } from "@chakra-ui/react";

import React from "react";

const ChatLoading = () => {
  return (
    <>
      <Stack>
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
        <Skeleton h="20" />
      </Stack>
    </>
  );
};

export default ChatLoading;
