import { extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

export const managementTheme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
  fonts: {
    heading: "system-ui, sans-serif",
    body: "system-ui, sans-serif",
  },
  styles: {
    global: { body: { bg: "#f4f6f9", color: "#080707" } },
  },
  components: {
    Table: {
      variants: {
        simple: {
          th: { color: "#3e3e3c", borderColor: "#e8ecef", fontSize: "11px", fontWeight: "700", px: 4, py: 3, bg: "#f4f6f9", textTransform: "uppercase", letterSpacing: "0.05em" },
          td: { borderColor: "#e8ecef", color: "#080707", px: 4, py: 2, fontSize: "16px", fontWeight: "500" },
          tr: { _hover: { bg: "#eef2f7" } },
        },
      },
    },
    Button: {
      baseStyle: { borderRadius: "4px" },
      defaultProps: { colorScheme: "blue" },
    },
  },
}, withProse());
