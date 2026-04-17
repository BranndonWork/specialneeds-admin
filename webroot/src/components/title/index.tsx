import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router";

interface TitleProps {
  collapsed: boolean;
}

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  return (
    <Link to="/">
      <Box px="4" py="4">
        {collapsed ? null : (
          <Text fontSize="sm" fontWeight="bold" lineHeight="1.3">
            SpecialNeeds.com<br />Management
          </Text>
        )}
      </Box>
    </Link>
  );
};
