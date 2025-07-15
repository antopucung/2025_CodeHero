// Drop Zone for placing code blocks
const DropZone = React.forwardRef(({ index, children, isActive, highlightColor = "#4ecdc4" }, ref) => {
  return (
    <Box
      ref={ref}
      bg={isActive ? `${highlightColor}22` : "transparent"}
      border="1px dashed"
      borderColor={isActive ? highlightColor : "#333"}
      borderWidth={isActive ? "2px" : "1px"}
      borderRadius="md"
      minH="40px"
      p={2}
      mb={2}
      position="relative"
      transition="all 0.2s ease"
    >
      {children}
      {isActive && (
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          pointerEvents="none"
        />
      )}
    </Box>
  );
});

DropZone.displayName = 'DropZone';

export default DropZone;