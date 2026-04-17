import { useEffect, useMemo } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { AdminPage } from "../../components/admin-page";
import { useBackNavigation } from "../../utils/useBackNavigation";

import type { IArticle } from "../../interfaces";
import QuillEditor from "../../components/quill-editor";

export const ArticleEdit = () => {
  const {
    refineCore: { formLoading, query: queryResult },
    saveButtonProps,
    register,
    formState: { errors },
    setValue,
    control,
  } = useForm<IArticle>({
    refineCoreProps: {
      autoSave: {
        enabled: false,
      },
    },
  });

  const back = useBackNavigation("/articles", "Articles");

  const categories = queryResult?.data?.data?.categories || [];

  const categoryOptions = useMemo(() => {
    return categories.map((cat: any) => ({
      value: cat.slug,
      label: cat.name,
    }));
  }, [categories]);

  useEffect(() => {
    const currentCategory = queryResult?.data?.data?.category;
    if (currentCategory) {
      setValue("category.id", currentCategory.slug || currentCategory.id);
    }
  }, [queryResult?.data?.data, setValue]);

  return (
    <AdminPage
      title="Edit Article"
      actions={
        <>
          <Button size="sm" variant="outline" onClick={back.onClick}>
            {back.label}
          </Button>
          <Button
            size="sm"
            bg="#1589ee"
            color="white"
            _hover={{ bg: "#1172c9" }}
            leftIcon={<IconDeviceFloppy size={14} />}
            isLoading={formLoading}
            {...saveButtonProps}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <FormControl mb="3" isInvalid={!!errors?.title}>
        <FormLabel>Title</FormLabel>
        <Input
          id="title"
          type="text"
          {...register("title", { required: "Title is required" })}
        />
        <FormErrorMessage>{`${errors.title?.message}`}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={!!errors?.status}>
        <FormLabel>Status</FormLabel>
        <Select
          id="status"
          placeholder="Select Post Status"
          {...register("status", {
            required: "Status is required",
          })}
        >
          <option>published</option>
          <option>draft</option>
          <option>rejected</option>
        </Select>
        <FormErrorMessage>{`${errors.status?.message}`}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={!!errors?.categoryId}>
        <FormLabel>Category</FormLabel>
        <Select
          id="categoryId"
          placeholder="Select Category"
          {...register("category.id", {
            required: "Category is required",
          })}
        >
          {categoryOptions?.map((option: { value: string; label: string }) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{`${errors.categoryId?.message}`}</FormErrorMessage>
      </FormControl>

      <Controller
        name="content"
        control={control}
        defaultValue=""
        rules={{ required: "Content is required" }}
        render={({ field }) => (
          <QuillEditor
            label="Content"
            value={field.value || ""}
            onChange={field.onChange}
            error={errors.content?.message as string}
            isRequired
            placeholder="Write your post content here..."
            height="400px"
          />
        )}
      />
    </AdminPage>
  );
};
