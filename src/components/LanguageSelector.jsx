import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text as ChakraText,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "#00ff00";

const LanguageSelector = ({ language, onSelect }) => {
  return (
    <Box mb={4}>
      <ChakraText mb={2} fontSize="xs" color="#666" fontFamily="'Courier New', monospace">
        ├─ COMPILER/INTERPRETER:
      </ChakraText>
      <Menu isLazy>
        <MenuButton 
          as={Button}
          bg="#000"
          color="#00ff00"
          border="1px solid #333"
          borderRadius="0"
          fontFamily="'Courier New', monospace"
          fontSize="sm"
          _hover={{ bg: "#111", borderColor: "#00ff00" }}
          _active={{ bg: "#222" }}
        >
          {language.toUpperCase()}
        </MenuButton>
        <MenuList bg="#000" border="1px solid #333" borderRadius="0">
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : ""}
              bg={lang === language ? "#111" : "transparent"}
              fontFamily="'Courier New', monospace"
              fontSize="sm"
              _hover={{
                color: ACTIVE_COLOR,
                bg: "#111",
              }}
              onClick={() => onSelect(lang)}
            >
              {lang.toUpperCase()}
              &nbsp;
              <ChakraText as="span" color="#666" fontSize="xs">
                ({version})
              </ChakraText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
export default LanguageSelector;
