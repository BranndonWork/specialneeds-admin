import { Box, IconButton, HStack, Button, Image, useColorMode } from "@chakra-ui/react";
import { IconSun, IconMoonStars, IconLogout } from "@tabler/icons-react";
import { useLogout, useGetIdentity } from "@refinedev/core";

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity();

  return (
    <Box
      py="2"
      px="4"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      w="full"
      bg="chakra-body-bg"
    >
      <Box bg="white" borderRadius="md" px="3" py="1">
        <Image src="/logo-full.png" alt="SpecialNeeds.com Management" h="32px" w="auto" />
      </Box>
      <HStack spacing={2}>
        <Box fontSize="sm" fontWeight="medium" mr="2">
          {user?.displayname || user?.email}
        </Box>
        <IconButton
          variant="ghost"
          aria-label="Toggle theme"
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <IconMoonStars size={18} /> : <IconSun size={18} />}
        />
        <Button
          variant="ghost"
          leftIcon={<IconLogout size={18} />}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </HStack>
    </Box>
  );
};
