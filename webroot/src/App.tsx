import { Refine, Authenticated } from "@refinedev/core";
import {
  ErrorComponent,
  ThemedLayout,
  RefineThemes,
  useNotificationProvider,
  AuthPage,
} from "@refinedev/chakra-ui";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import routerProvider, {
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
  CatchAllNavigate,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";

import { PostList, PostCreate, PostEdit, PostShow } from "./pages";
import { djangoDataProvider } from "./providers/djangoDataProvider";
import { authProvider } from "./providers/authProvider";
import { Header } from "./components/header";

const App: React.FC = () => {
  const customTheme = extendTheme({
    ...RefineThemes.Blue,
    config: {
      initialColorMode: "light",
      useSystemColorMode: false,
    },
  });

  return (
    <BrowserRouter>
      <ChakraProvider theme={customTheme}>
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
              meta: {
                canDelete: true,
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route
              element={
                <Authenticated
                  key="authenticated-layout"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <ThemedLayout Header={Header}>
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              <Route index element={<NavigateToResource resource="articles" />} />

              <Route path="/articles">
                <Route index element={<PostList />} />
                <Route path="create" element={<PostCreate />} />
                <Route path="edit/:id" element={<PostEdit />} />
                <Route path="show/:id" element={<PostShow />} />
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
                      defaultValues: {
                        email: "",
                        password: "",
                      },
                    }}
                  />
                }
              />
            </Route>
          </Routes>
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </ChakraProvider>
    </BrowserRouter>
  );
};

export default App;
