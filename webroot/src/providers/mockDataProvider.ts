import type { DataProvider } from "@refinedev/core";
import type { IArticle, ICategory } from "../interfaces";

// Mock articles data
const articles: IArticle[] = [
  {
    id: 1,
    title: "Understanding Autism Spectrum Disorder",
    content: "Autism Spectrum Disorder (ASD) is a developmental disability that affects communication, behavior, and social interaction. Early diagnosis and intervention can significantly improve outcomes for children with ASD.",
    status: "published",
    category: { id: 1 },
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: 2,
    title: "Early Intervention Strategies",
    content: "Early intervention can make a significant difference in the development of children with special needs. This article explores evidence-based strategies that parents and caregivers can implement.",
    status: "published",
    category: { id: 2 },
    createdAt: "2025-01-08T14:30:00Z",
  },
  {
    id: 3,
    title: "Choosing the Right Therapist",
    content: "Finding the right therapist for your child is crucial for their development and progress. Here's a comprehensive guide to help you make the best choice for your family.",
    status: "draft",
    category: { id: 1 },
    createdAt: "2025-01-14T09:15:00Z",
  },
];

const categories: ICategory[] = [
  { id: 1, title: "Education" },
  { id: 2, title: "Therapy" },
  { id: 3, title: "Resources" },
];

export const mockDataProvider = {
  getList: async ({ resource }) => {
    if (resource === "articles") {
      return {
        data: articles,
        total: articles.length,
      };
    }
    if (resource === "categories") {
      return {
        data: categories,
        total: categories.length,
      };
    }
    return { data: [], total: 0 };
  },

  getOne: async ({ resource, id }) => {
    if (resource === "articles") {
      const article = articles.find((item) => item.id === Number(id));
      if (!article) throw new Error("Article not found");
      return { data: article };
    }
    if (resource === "categories") {
      const category = categories.find((item) => item.id === Number(id));
      if (!category) throw new Error("Category not found");
      return { data: category };
    }
    throw new Error("Resource not found");
  },

  create: async ({ resource, variables }) => {
    if (resource === "articles") {
      const newArticle: IArticle = {
        id: articles.length + 1,
        title: (variables as IArticle).title || "",
        content: (variables as IArticle).content || "",
        status: (variables as IArticle).status || "draft",
        category: (variables as IArticle).category || { id: 1 },
        createdAt: new Date().toISOString(),
      };
      articles.push(newArticle);
      return { data: newArticle };
    }
    throw new Error("Resource not found");
  },

  update: async ({ resource, id, variables }) => {
    if (resource === "articles") {
      const index = articles.findIndex((item) => item.id === Number(id));
      if (index === -1) throw new Error("Article not found");
      articles[index] = {
        ...articles[index],
        ...(variables as Partial<IArticle>),
      };
      return { data: articles[index] };
    }
    throw new Error("Resource not found");
  },

  deleteOne: async ({ resource, id }) => {
    if (resource === "articles") {
      const index = articles.findIndex((item) => item.id === Number(id));
      if (index === -1) throw new Error("Article not found");
      const deleted = articles.splice(index, 1)[0];
      return { data: deleted };
    }
    throw new Error("Resource not found");
  },

  getMany: async ({ resource, ids }) => {
    if (resource === "categories") {
      const data = categories.filter((item) => ids.includes(item.id));
      return { data };
    }
    throw new Error("Resource not found");
  },

  getApiUrl: () => "http://localhost:3000",
} as DataProvider;
