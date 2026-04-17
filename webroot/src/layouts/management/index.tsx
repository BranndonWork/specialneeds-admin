import React from "react";
import { useMenu, useGetIdentity, useLogout } from "@refinedev/core";
import { Link, Outlet, useLocation } from "react-router";
import { Box, Flex, Text, VStack, HStack, IconButton, Avatar } from "@chakra-ui/react";
import { IconLogout } from "@tabler/icons-react";

export const ManagementLayout: React.FC = () => {
  const { menuItems } = useMenu();
  const { data: user } = useGetIdentity<{ displayname?: string; email?: string }>();
  const { mutate: logout } = useLogout();
  const { pathname } = useLocation();

  return (
    <Flex minH="100vh" bg="#f4f6f9">
      {/* Sidebar */}
      <Box
        w="260px"
        style={{ background: "#0a2340" }}
        position="sticky"
        top={0}
        h="100vh"
        flexShrink={0}
        display="flex"
        flexDirection="column"
      >
        {/* Brand */}
        <Box px={6} py={6}>
          <Text
            fontSize="16px"
            fontWeight="700"
            style={{ color: "#ffffff" }}
            letterSpacing="-0.01em"
          >
            SpecialNeeds.com
          </Text>
          <Text fontSize="13px" style={{ color: "rgba(255,255,255,0.6)" }} mt="4px">
            Content Management
          </Text>
        </Box>

        {/* Nav */}
        <VStack align="stretch" spacing="6px" px={4} flex={1} pt={2}>
          {menuItems.map((item) => {
            const route = item.route ?? "#";
            const isActive = pathname.startsWith(route) && route !== "#";
            return (
              <Link key={item.key} to={route}>
                <Box
                  px={4}
                  py="10px"
                  borderRadius="6px"
                  fontSize="14px"
                  style={{
                    background: isActive ? "rgba(21,137,238,0.15)" : "transparent",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
                  }}
                  _hover={{
                    bg: isActive ? "rgba(21,137,238,0.15)" : "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                  }}
                  transition="all 0.15s"
                  fontWeight={isActive ? "600" : "500"}
                >
                  {item.label ?? item.name}
                </Box>
              </Link>
            );
          })}
        </VStack>

        {/* User */}
        <Box px={4} pb={5} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} pt={4}>
          <Flex align="center" justify="space-between">
            <HStack spacing={2}>
              <Avatar size="xs" name={user?.displayname ?? user?.email} bg="#1589ee" />
              <Text fontSize="13px" style={{ color: "rgba(255,255,255,0.8)" }} noOfLines={1}>
                {user?.displayname ?? user?.email}
              </Text>
            </HStack>
            <IconButton
              aria-label="Logout"
              icon={<IconLogout size={16} />}
              size="xs"
              variant="ghost"
              style={{ color: "rgba(255,255,255,0.6)" }}
              _hover={{ color: "#ffffff", bg: "rgba(255,255,255,0.08)" }}
              onClick={() => logout()}
            />
          </Flex>
        </Box>
      </Box>

      {/* Content */}
      <Box flex={1} p={8} bg="#f4f6f9" overflowY="auto">
        <Box maxW="1400px" mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};
