import { useShow, useDelete, useNavigation } from "@refinedev/core";
import { useBackNavigation } from "../../utils/useBackNavigation";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { Text, Box, VStack, Badge, Button, Spinner, Center } from "@chakra-ui/react";
import { IconEdit, IconTrash, IconList } from "@tabler/icons-react";
import { AdminPage } from "../../components/admin-page";

import type { IArticle } from "../../interfaces";

export const ArticleShow: React.FC = () => {
  const { query: queryResult } = useShow<IArticle>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { mutate: deleteOne } = useDelete();
  const { edit } = useNavigation();
  const back = useBackNavigation("/articles", "Articles");

  const handleDelete = () => {
    if (!record?.id) return;
    if (confirm("Are you sure you want to delete this article?")) {
      deleteOne({ resource: "articles", id: record.id }, { onSuccess: () => back.onClick() });
    }
  };

  return (
    <AdminPage
      title={isLoading ? "Articles" : (record?.title ?? "Article")}
      actions={
        <>
          <Button size="sm" variant="outline" leftIcon={back.hasHistory ? undefined : <IconList size={14} />} onClick={back.onClick}>
            {back.label}
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<IconEdit size={14} />}
            onClick={() => record?.id && edit("articles", record.id)}
            isDisabled={isLoading}
          >
            Edit
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            leftIcon={<IconTrash size={14} />}
            onClick={handleDelete}
            isDisabled={isLoading}
          >
            Delete
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Center py={16}>
          <Spinner size="lg" color="#1589ee" />
        </Center>
      ) : (
        <VStack align="stretch" spacing={5} maxW="900px">
          <Box>
            <Text fontSize="11px" fontWeight="700" color="#3e3e3c" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
              Status
            </Text>
            <Badge colorScheme={
              record?.status === "published" ? "green" :
              record?.status === "draft" ? "gray" :
              "red"
            }>
              {record?.status}
            </Badge>
          </Box>

          <Box>
            <Text fontSize="11px" fontWeight="700" color="#3e3e3c" textTransform="uppercase" letterSpacing="0.05em" mb={1}>
              Category
            </Text>
            <Text fontSize="15px" color="#080707">
              {record?.category?.parent?.name && `${record.category.parent.name} > `}
              {record?.category?.name}
            </Text>
          </Box>

          <Box>
            <Text fontSize="11px" fontWeight="700" color="#3e3e3c" textTransform="uppercase" letterSpacing="0.05em" mb={2}>
              Content
            </Text>
            <Prose mt={2} dangerouslySetInnerHTML={{ __html: record?.content || "" }} />
          </Box>
        </VStack>
      )}
    </AdminPage>
  );
};
