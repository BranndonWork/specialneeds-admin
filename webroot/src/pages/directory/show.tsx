import { useShow, useDelete, useNavigation } from "@refinedev/core";
import { useBackNavigation } from "../../utils/useBackNavigation";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import {
  Heading,
  Text,
  Box,
  VStack,
  Divider,
  Badge,
  SimpleGrid,
  Button,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { IconEdit, IconTrash, IconList } from "@tabler/icons-react";
import { AdminPage } from "../../components/admin-page";

import type { IListing } from "../../interfaces";

export const DirectoryShow: React.FC = () => {
  const { query: queryResult } = useShow<IListing>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { mutate: deleteOne } = useDelete();
  const { edit } = useNavigation();
  const back = useBackNavigation("/directory", "Directory Listings");

  const handleDelete = () => {
    if (!record?.id) return;
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteOne({ resource: "listings", id: record.id }, { onSuccess: () => back.onClick() });
    }
  };

  return (
    <AdminPage
      title={isLoading ? "Directory Listing" : (record?.title ?? "Directory Listing")}
      actions={
        <>
          <Button size="sm" variant="outline" leftIcon={back.hasHistory ? undefined : <IconList size={14} />} onClick={back.onClick}>
            {back.label}
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<IconEdit size={14} />}
            onClick={() => record?.id && edit("listings", record.id)}
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

          {record?.content && (
            <Box>
              <Text fontSize="11px" fontWeight="700" color="#3e3e3c" textTransform="uppercase" letterSpacing="0.05em" mb={2}>
                Content
              </Text>
              <Prose dangerouslySetInnerHTML={{ __html: record.content }} />
            </Box>
          )}

          {record?.category_data && Object.keys(record.category_data).length > 0 && (
            <>
              <Divider borderColor="#e8ecef" />
              <Box>
                <Text fontSize="11px" fontWeight="700" color="#3e3e3c" textTransform="uppercase" letterSpacing="0.05em" mb={4}>
                  Specifics
                </Text>
                <SimpleGrid columns={2} spacing={4}>
                  {Object.entries(record.category_data).map(([sectionKey, sectionValue]: [string, any]) => {
                    if (!sectionValue || !sectionValue.fields) return null;

                    return Object.entries(sectionValue.fields).map(([fieldKey, fieldValue]: [string, any]) => {
                      const value = fieldValue?.attributes?.value;
                      if (!value) return null;

                      return (
                        <Box key={`${sectionKey}-${fieldKey}`}>
                          <Text fontSize="12px" fontWeight="700" color="#3e3e3c" mb={1}>
                            {fieldValue.label}
                          </Text>
                          <Text fontSize="14px" color="#080707">
                            {Array.isArray(value) ? value.join(", ") : value}
                          </Text>
                        </Box>
                      );
                    });
                  })}
                </SimpleGrid>
              </Box>
            </>
          )}
        </VStack>
      )}
    </AdminPage>
  );
};
