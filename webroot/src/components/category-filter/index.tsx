import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  Flex,
} from "@chakra-ui/react";
import { IconX, IconSearch } from "@tabler/icons-react";
import axios from "axios";
import { axiosInstance } from "../../providers/djangoDataProvider";

const MEILI_HOST = "https://search.specialneeds.com";

function slugToLabel(slug: string): string {
  const parts = slug.split("/");
  return parts
    .map((p) => p.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "))
    .join(" > ");
}

interface CategoryOption {
  label: string;
  slug: string;
}

interface CategoryFilterProps {
  onFilter: (slug: string | undefined) => void;
  resource: "articles" | "listings";
  activeSlug?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilter, resource, activeSlug }) => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CategoryOption | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resource === "listings") {
      // Use Meilisearch facets so the list only shows categories that have indexed listings
      axios.post(`${MEILI_HOST}/indexes/listings/search`, {
        q: "",
        limit: 0,
        facets: ["category_slug"],
      }).then((res) => {
        const slugCounts: Record<string, number> = res.data?.facetDistribution?.category_slug || {};
        const options: CategoryOption[] = Object.keys(slugCounts)
          .sort()
          .map((slug) => ({ label: slugToLabel(slug), slug }));
        setCategories(options);
        if (activeSlug && !selected) {
          const match = options.find((o) => o.slug === activeSlug);
          if (match) setSelected(match);
        }
      }).catch(() => {});
    } else {
      axiosInstance.get(`/${resource}/categories/`).then((res) => {
        const rawCategories: any[] = res.data?.response || res.data || [];
        const options: CategoryOption[] = rawCategories.flatMap((cat: any) => {
          if (cat.parent) {
            return [{ label: `${cat.parent.name} > ${cat.name}`, slug: cat.slug }];
          }
          return [{ label: cat.name, slug: cat.slug }];
        });
        setCategories(options);
        if (activeSlug && !selected) {
          const match = options.find((o) => o.slug === activeSlug);
          if (match) setSelected(match);
        }
      }).catch(() => {});
    }
  }, [resource]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query
    ? categories.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : categories;

  const handleSelect = (option: CategoryOption) => {
    setSelected(option);
    setQuery("");
    setOpen(false);
    onFilter(option.slug);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    onFilter(undefined);
  };

  if (selected) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px", background: "#eef2f7", borderRadius: "4px", border: "1px solid #c8d6e0", width: "280px" }}>
        <span style={{ fontSize: "12px", color: "#1589ee", fontWeight: 500, flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {selected.label}
        </span>
        <button
          type="button"
          onClick={handleClear}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", padding: 0, cursor: "pointer", color: "#999", flexShrink: 0, lineHeight: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#333")}
          onMouseLeave={e => (e.currentTarget.style.color = "#999")}
        >
          <IconX size={12} />
        </button>
      </div>
    );
  }

  return (
    <Box ref={containerRef} position="relative" w="280px">
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none" h="30px">
          <IconSearch size={13} color="#9ca3af" />
        </InputLeftElement>
        <Input
          h="30px"
          pl="30px"
          placeholder="Filter by category..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          fontSize="12px"
          borderRadius="4px"
          borderColor="#d0d7de"
          bg="white"
          _focus={{ borderColor: "#1589ee", boxShadow: "0 0 0 1px #1589ee" }}
          _placeholder={{ color: "#b0b8c1" }}
        />
        {query && (
          <InputRightElement h="30px" cursor="pointer" onClick={() => { setQuery(""); setOpen(false); }}>
            <IconX size={11} color="#9ca3af" />
          </InputRightElement>
        )}
      </InputGroup>

      {open && filtered.length > 0 && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          right={0}
          bg="white"
          border="1px solid #e8ecef"
          borderRadius="4px"
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          zIndex={9999}
          maxH="240px"
          overflowY="auto"
        >
          {filtered.map((option) => (
            <Box
              key={option.slug}
              px={3}
              py="7px"
              fontSize="12px"
              color="#080707"
              cursor="pointer"
              _hover={{ bg: "#eef2f7", color: "#1589ee" }}
              onMouseDown={() => handleSelect(option)}
            >
              {option.label}
            </Box>
          ))}
        </Box>
      )}

      {open && query && filtered.length === 0 && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          right={0}
          bg="white"
          border="1px solid #e8ecef"
          borderRadius="4px"
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          zIndex={9999}
          px={3}
          py={2}
        >
          <Text fontSize="12px" color="#9ca3af">No categories match "{query}"</Text>
        </Box>
      )}
    </Box>
  );
};
