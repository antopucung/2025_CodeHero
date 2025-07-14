import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Courier New', monospace",
    body: "'Courier New', monospace",
  },
  styles: {
    global: {
      body: {
        bg: "#000000",
        color: "#00ff00",
        fontFamily: "'Courier New', monospace",
      },
    },
  },
});
export default theme;
