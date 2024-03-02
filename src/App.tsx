import {
  PlaygroundPage,
  playgroundAction,
  playgroundLoader,
} from "./screens/Playground";
import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/:imageId",
    element: <PlaygroundPage />,
    action: playgroundAction,
    loader: playgroundLoader,
  },
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
