import { Refine, Authenticated } from "@refinedev/core";
import {
  ErrorComponent,
  useNotificationProvider,
  AuthPage,
} from "@refinedev/chakra-ui";
import { ChakraProvider, localStorageManager } from "@chakra-ui/react";
import routerProvider, {
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
  CatchAllNavigate,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";

import {
  ArticleList,
  ArticleCreate,
  ArticleEdit,
  ArticleShow,
  DirectoryList,
  DirectoryCreate,
  DirectoryEdit,
  DirectoryShow,
} from "./pages";
import { djangoDataProvider } from "./providers/djangoDataProvider";
import { authProvider } from "./providers/authProvider";

import { ManagementLayout } from "./layouts/management";
import { managementTheme } from "./themes";
import { ThemeContext } from "./contexts/ThemeContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ChakraProvider theme={managementTheme} colorModeManager={{ ...localStorageManager, get: () => "light" }}>
        <ThemeContext.Provider value={{ themeName: "management" }}>
          <Refine
            notificationProvider={useNotificationProvider()}
            routerProvider={routerProvider}
            authProvider={authProvider}
            dataProvider={djangoDataProvider}
            resources={[
              {
                name: "articles",
                list: "/articles",
                show: "/articles/show/:id",
                create: "/articles/create",
                edit: "/articles/edit/:id",
                meta: { canDelete: true },
              },
              {
                name: "listings",
                list: "/directory",
                show: "/directory/show/:id",
                create: "/directory/create",
                edit: "/directory/edit/:id",
                meta: {
                  canDelete: true,
                  label: "Directory Listing",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              reactQuery: {
                clientConfig: {
                  defaultOptions: {
                    queries: { staleTime: 5 * 1000 },
                  },
                },
              },
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-layout"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ManagementLayout />
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="articles" />}
                />

                <Route path="/articles">
                  <Route index element={<ArticleList />} />
                  <Route path="create" element={<ArticleCreate />} />
                  <Route path="edit/:id" element={<ArticleEdit />} />
                  <Route path="show/:id" element={<ArticleShow />} />
                </Route>

                <Route path="/directory">
                  <Route index element={<DirectoryList />} />
                  <Route path="create" element={<DirectoryCreate />} />
                  <Route path="edit/:id" element={<DirectoryEdit />} />
                  <Route path="show/:id" element={<DirectoryShow />} />
                </Route>

                <Route path="*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <Authenticated key="authenticated-auth" fallback={<Outlet />}>
                    <NavigateToResource resource="articles" />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      formProps={{
                        defaultValues: { email: "", password: "" },
                      }}
                    />
                  }
                />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler
              handler={({ resource, action }) => {
                const base = "SpecialNeeds.com Management";
                if (!resource) return base;
                const resourceLabel =
                  resource.meta?.label ?? resource.name ?? "";
                const actionLabel = action
                  ? ` | ${action.charAt(0).toUpperCase() + action.slice(1)}`
                  : "";
                return `${resourceLabel}${actionLabel} | ${base}`;
              }}
            />
          </Refine>
        </ThemeContext.Provider>
      </ChakraProvider>
    </BrowserRouter>
  );
};

export default App;
