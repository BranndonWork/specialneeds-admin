import React from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import { CategoryFilter } from "../category-filter";

interface AdminListProps {
  children: React.ReactNode;
  canCreate?: boolean;
  onCategoryFilter?: (slug: string | undefined) => void;
  activeCategorySlug?: string;
}

export const AdminList: React.FC<AdminListProps> = ({ children, canCreate = true, onCategoryFilter, activeCategorySlug }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const isArticles = pathname.startsWith("/articles");

  const label = isArticles ? "Articles" : "Directory Listing";
  const buttonLabel = isArticles ? "New Article" : "New Listing";

  const handleCreate = () => {
    navigate(`${pathname}/create`);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} bg="white" px="52px" pt={8} pb={8} mx={-8} mt={-8} borderBottom="1px solid #e8ecef">
        <Box style={{ marginTop: "4px", marginBottom: "-4px" }}>
          <Heading fontSize="18px" fontWeight="700" color="#080707" mb="10px">{label}</Heading>
          {onCategoryFilter && (
            <CategoryFilter
              onFilter={onCategoryFilter}
              resource={isArticles ? "articles" : "listings"}
              activeSlug={activeCategorySlug}
            />
          )}
        </Box>
        {canCreate && (
          <Button size="sm" borderRadius="4px" bg="#1589ee" color="white" fontSize="13px" fontWeight="500" _hover={{ bg: "#1172c9" }} leftIcon={<IconPlus size={14} />} onClick={handleCreate}>
            {buttonLabel}
          </Button>
        )}
      </Flex>
      {children}
    </Box>
  );
};
