// Drop Zone for placing code blocks
const DropZone = React.forwardRef((props, ref) => {
  const { index, children, isActive, highlightColor = "#4ecdc4" } = props;
  
  return (
    <Box
      ref={ref}
      bg={isActive ? `${highlightColor}22` : "transparent"}
      border="1px dashed"
      borderColor={isActive ? highlightColor : "#333"}
      borderWidth="2px"
      borderRadius="md"
      minH="50px"
      p={2}
      mb={2}
      position="relative"
      transition="all 0.2s ease"
      _hover={{
        borderColor: isActive ? highlightColor : "#666"
      }}
    >
      {children}
      {isActive && !children && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
           bg={`${highlightColor}11`}
           borderRadius="md"
           border={`1px dashed ${highlightColor}`}
           display="flex"
           alignItems="center"
           justifyContent="center"
          pointerEvents="none"
        >
          <Text fontSize="xs" color={highlightColor} fontWeight="bold">
            DROP HERE
          </Text>
        </Box>
      )}
    </Box>
  );
});

DropZone.displayName = 'DropZone';

export default DropZone;