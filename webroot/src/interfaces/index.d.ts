import type { Column } from "@tanstack/react-table";

export interface ICategory {
  id: number;
  title: string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  category: { id: number };
  createdAt: string;
}

export interface IArticle {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  category: { id: number };
  createdAt: string;
}

export interface ColumnButtonProps {
  column: Column<any, any>;
}

export interface FilterElementProps {
  value: any;
  onChange: (value: any) => void;
}
