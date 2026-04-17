import React from "react";
import { useTable } from "@refinedev/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import {
  ShowButton,
  EditButton,
  DeleteButton,
  DateField,
} from "@refinedev/chakra-ui";
import { AdminList } from "../../components/admin-list";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Text,
  Box,
  Spinner,
  Center,
} from "@chakra-ui/react";

import { ColumnFilter, ColumnSorter } from "../../components/table";
import { Pagination } from "../../components/pagination";
import type { IArticle } from "../../interfaces";

const PREVIEW_STATUSES = ["published", "draft", "rejected", "scheduled"];

const statusColor: Record<string, string> = {
  published: "#22c55e",
  draft: "#94a3b8",
  rejected: "#ef4444",
  scheduled: "#f59e0b",
};

export const ArticleList: React.FC = () => {
  const columns = React.useMemo<ColumnDef<IArticle>[]>(
    () => [
      {
        id: "title",
        header: "Title",
        accessorKey: "title",
        meta: {
          filterOperator: "contains",
        },
        cell: function render({ getValue, row }) {
          const status = PREVIEW_STATUSES[row.index % PREVIEW_STATUSES.length];
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                title={status.charAt(0).toUpperCase() + status.slice(1)}
                aria-label={status.charAt(0).toUpperCase() + status.slice(1)}
                style={{
                  flexShrink: 0,
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  background: statusColor[status],
                  cursor: "default",
                }}
              />
              <span>{getValue() as string}</span>
            </div>
          );
        },
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        meta: { hideFilterIcon: true },
        cell: function render({ getValue }) {
          const category = getValue() as any;
          if (!category) return "—";
          if (category.parent?.name) {
            return `${category.parent.name} > ${category.name}`;
          }
          return category.name || "—";
        },
      },
      {
        id: "published_at",
        header: "Published",
        accessorKey: "published_at",
        cell: function render({ getValue }) {
          return (
            <Text whiteSpace="nowrap">
              <DateField value={getValue() as string} format="MMM D, YYYY" />
            </Text>
          );
        },
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: function render({ getValue }) {
          return (
            <HStack>
              <ShowButton
                hideText
                size="sm"
                recordItemId={getValue() as string}
              />
              <EditButton
                hideText
                size="sm"
                recordItemId={getValue() as string}
              />
              <DeleteButton
                hideText
                size="sm"
                recordItemId={getValue() as string}
              />
            </HStack>
          );
        },
      },
    ],
    [],
  );

  const {
    reactTable: { getHeaderGroups, getRowModel, setColumnFilters },

    refineCore: {
      setCurrentPage: setCurrent,
      pageCount,
      currentPage: current,
      filters: currentFilters,
      tableQuery: { isLoading },
    },
  } = useTable({
    columns,

    refineCoreProps: {
      sorters: {
        initial: [
          {
            field: "published_at",
            order: "desc",
          },
        ],
      },
    },
  });

  const activeCategorySlug = (currentFilters as any[]).find((f: any) => f.field === "category_slug")?.value as string | undefined;

  const handleCategoryFilter = (slug: string | undefined) => {
    setColumnFilters((prev) => {
      const without = prev.filter((f) => f.id !== "category_slug");
      return slug ? [...without, { id: "category_slug", value: slug }] : without;
    });
  };

  const columnMinWidths: Record<string, string> = {
    category: "260px",
    published_at: "130px",
    actions: "110px",
  };

  return (
    <AdminList onCategoryFilter={handleCategoryFilter} activeCategorySlug={activeCategorySlug}>
      <TableContainer whiteSpace="pre-line">
        <Table variant="simple">
          <Thead>
            {getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    minW={columnMinWidths[header.id]}
                  >
                    {!header.isPlaceholder && (
                      <HStack spacing="2">
                        <Text>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </Text>
                        <HStack spacing="2">
                          <ColumnSorter column={header.column} />
                          <ColumnFilter column={header.column} />
                        </HStack>
                      </HStack>
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Center py={8}>
                    <Spinner size="lg" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} style={{ verticalAlign: "middle" }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        current={current}
        pageCount={pageCount}
        setCurrent={setCurrent}
      />
    </AdminList>
  );
};
