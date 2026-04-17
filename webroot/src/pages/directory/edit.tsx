import { useEffect, useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Box,
  Heading,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";
import { useApiUrl } from "@refinedev/core";
import { Controller } from "react-hook-form";
import axios from "axios";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { AdminPage } from "../../components/admin-page";
import { useBackNavigation } from "../../utils/useBackNavigation";

import type { IListing } from "../../interfaces";
import { CategoryDataForm } from "../../components/category-data";
import QuillEditor from "../../components/quill-editor";

export const DirectoryEdit = () => {
  const {
    refineCore: { formLoading, query: queryResult, onFinish },
    saveButtonProps,
    register,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    getValues,
    control,
  } = useForm<IListing>({
    refineCoreProps: {
      autoSave: {
        enabled: false,
      },
      redirect: false,
      mutationMode: "optimistic",
    },
  });

  // Override save button to merge with original data
  const customSaveButtonProps = {
    ...saveButtonProps,
    onClick: async () => {
      const formData = getValues();
      const originalData = queryResult?.data?.data || {};

      // Exclude top-level metadata fields (categories, form_fields) - only merge actual listing fields
      const { categories: _cats, form_fields: _fields, ...originalListingFields } = originalData as Partial<IListing>;

      // Merge form data with original listing data
      const mergedData = {
        ...originalListingFields,
        // Overwrite with form changes
        title: formData.title,
        status: formData.status,
        content: formData.content,
        category: formData.category,
        category_data: formData.category_data,
      };

      // Call the original onFinish with merged data
      await handleSubmit((data) => {
        onFinish(mergedData);
      })();
    },
  };

  const categoryData = watch("category_data");
  const categorySlug = watch("category.slug");
  const listingData = queryResult?.data?.data;
  const apiUrl = useApiUrl();
  const back = useBackNavigation("/directory", "Directory Listings");

  const [pendingCategorySlug, setPendingCategorySlug] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useState<any>(null);

  // Categories are included in the listing response when level=editor
  const categories = (listingData as any)?.categories || [];
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.slug,
    label: cat.parent?.name ? `${cat.parent.name} > ${cat.name}` : cat.name,
  }));

  // Set initial category when listing data loads
  useEffect(() => {
    if (listingData?.category?.slug && !categorySlug) {
      setValue("category.slug", listingData.category.slug);
    }
  }, [listingData?.category?.slug, categorySlug, setValue]);

  // Set category_data when listing data loads
  useEffect(() => {
    if (listingData?.category_data && !categoryData) {
      setValue("category_data", listingData.category_data);
    }
  }, [listingData?.category_data, categoryData, setValue]);

  // Fetch category form fields from API
  const getCategoryFormFields = async (slug: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${apiUrl}/listings/categories/form-fields/${slug}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data?.data?.response || response.data?.response || {};
    } catch (error) {
      console.error("Error fetching category form fields:", error);
      return {};
    }
  };

  // Handle category change with confirmation
  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlug = e.target.value;

    // If no current category data, just update without confirmation
    if (!categoryData || Object.keys(categoryData).length === 0) {
      const formFields = await getCategoryFormFields(newSlug);
      setValue("category.slug", newSlug);
      setValue("category_data", formFields);
      return;
    }

    // If changing to a different category, show confirmation
    if (newSlug !== categorySlug) {
      setPendingCategorySlug(newSlug);
      onOpen();
    }
  };

  // Confirm category change and fetch new fields
  const confirmCategoryChange = async () => {
    if (pendingCategorySlug) {
      const formFields = await getCategoryFormFields(pendingCategorySlug);
      setValue("category.slug", pendingCategorySlug);
      setValue("category_data", formFields);
      setPendingCategorySlug(null);
    }
    onClose();
  };

  // Cancel category change
  const cancelCategoryChange = () => {
    setPendingCategorySlug(null);
    onClose();
  };

  return (
    <AdminPage
      title="Edit Directory Listing"
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
            onClick={customSaveButtonProps.onClick}
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
          placeholder="Select Status"
          {...register("status", {
            required: "Status is required",
          })}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="rejected">Rejected</option>
        </Select>
        <FormErrorMessage>{`${errors.status?.message}`}</FormErrorMessage>
      </FormControl>
      <Controller
        name="content"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <QuillEditor
            label="Content"
            value={field.value || ""}
            onChange={field.onChange}
            error={errors.content?.message as string}
            placeholder="Write your listing content here..."
            height="400px"
          />
        )}
      />
      <FormControl mb="3" isInvalid={!!errors?.category}>
        <FormLabel>Category</FormLabel>
        <Select
          id="category"
          placeholder="Select Category"
          value={categorySlug || ""}
          onChange={handleCategoryChange}
        >
          {categoryOptions?.map((option: { value: string; label: string }) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{`${errors.category?.message}`}</FormErrorMessage>
      </FormControl>

      {categoryData && Object.keys(categoryData).length > 0 && (
        <Box mt={6}>
          <Heading size="md" mb={4}>
            Specifics
          </Heading>
          <CategoryDataForm
            categoryData={categoryData}
            onChange={(categoryKey, fieldKey, value, subField, idx) => {
              const updatedCategoryData = JSON.parse(JSON.stringify(categoryData));
              if (subField && idx != null) {
                updatedCategoryData[categoryKey].fields[fieldKey].attributes.value[idx][subField] = value;
              } else {
                updatedCategoryData[categoryKey].fields[fieldKey].attributes.value = value;
              }
              setValue("category_data", updatedCategoryData);
            }}
          />
        </Box>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef[0]}
        onClose={cancelCategoryChange}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Category Change
            </AlertDialogHeader>

            <AlertDialogBody>
              Changing the category will reset all category-specific fields in the "Specifics" section.
              Are you sure you want to continue?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef[0]} onClick={cancelCategoryChange}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmCategoryChange} ml={3}>
                Change Category
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminPage>
  );
};
