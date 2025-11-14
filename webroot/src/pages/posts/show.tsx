import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/chakra-ui";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

import { Heading, Text, Spacer } from "@chakra-ui/react";

import type { IPost } from "../../interfaces";

export const PostShow: React.FC = () => {
  const { query: queryResult } = useShow<IPost>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Heading as="h5" size="sm">
        Id
      </Heading>
      <Text mt={2}>{record?.id}</Text>
      <Heading as="h5" size="sm" mt={4}>
        Title
      </Heading>
      <Text mt={2}>{record?.title}</Text>
      <Heading as="h5" size="sm" mt={4}>
        Status
      </Heading>
      <Text mt={2}>{record?.status}</Text>
      <Heading as="h5" size="sm" mt={4}>
        Category
      </Heading>
      <Text mt={2}>
        {record?.category?.parent?.name && `${record.category.parent.name} > `}
        {record?.category?.name}
      </Text>
      <Heading as="h5" size="sm" mt={4}>
        Content
      </Heading>
      <Spacer mt={2} />
      <Prose
        mt={2}
        dangerouslySetInnerHTML={{ __html: record?.content || "" }}
      />
    </Show>
  );
};
