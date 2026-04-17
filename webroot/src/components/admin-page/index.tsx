import React from "react";
import { Box, Flex, Heading, HStack } from "@chakra-ui/react";

interface AdminPageProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminPage: React.FC<AdminPageProps> = ({ title, actions, children }) => {
  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        bg="white"
        px="52px"
        pt={8}
        pb={8}
        mx={-8}
        mt={-8}
        borderBottom="1px solid #e8ecef"
      >
        <Heading fontSize="18px" fontWeight="700" color="#080707">
          {title}
        </Heading>
        {actions && <HStack spacing={2}>{actions}</HStack>}
      </Flex>
      {children}
    </Box>
  );
};
