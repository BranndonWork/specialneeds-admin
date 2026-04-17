import type { Column } from "@tanstack/react-table";

export interface ICategory {
  id: number | string;
  name: string;
  slug: string;
  parent?: { id?: number | string; name: string; slug?: string };
}

export interface IArticle {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  category: { id: number | string; name?: string; slug?: string; parent?: { name: string; slug?: string } };
  categories?: ICategory[];
  createdAt?: string;
  created_at?: string;
  published_at?: string;
}

export interface IListing {
  id: string;
  title: string;
  slug?: string;
  content?: string;
  status: "published" | "draft" | "rejected" | "deleted";
  category: { id: string; name?: string; slug?: string; parent?: { name: string } };
  category_data?: Record<string, any>;
  categories?: Array<{ id: string; name: string; slug: string; parent?: { name: string; slug: string } }>;
  form_fields?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  address?: Record<string, any>;
  lat_long?: [string, string];
  images?: Array<{ url: string; alt: string }>;
  created_by?: { id: string; displayname: string };
  claimed_by?: { id: string; displayname: string };
}

export interface ColumnButtonProps {
  column: Column<any, any>;
}

export interface FilterElementProps {
  value: any;
  onChange: (value: any) => void;
}
