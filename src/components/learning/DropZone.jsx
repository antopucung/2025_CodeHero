// Drop Zone for placing code blocks
const DropZone = React.forwardRef(({ index, children, isActive, highlightColor = "#4ecdc4" }, ref) => {
  return (
    <MotionBox
      ref={ref}
      animate={{
        backgroundColor: isActive ? `${highlightColor}22` : "transparent",
        borderColor: isActive ? highlightColor : "#333",
        borderWidth: isActive ? "2px" : "1px"
      }}
      border="1px dashed"
      borderColor="#333"
      borderRadius="md"
      minH="40px"
      p={2}
      mb={2}
      position="relative"
    >
      {children}
      {isActive && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          pointerEvents="none"
        />
      )}
    </MotionBox>
  );
});

DropZone.displayName = 'DropZone';