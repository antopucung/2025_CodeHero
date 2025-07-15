@@ .. @@
 // Drop Zone for placing code blocks
-const DropZone = ({ index, onDrop, children, isActive, highlightColor = "#4ecdc4" }) => {
+const DropZone = React.forwardRef(({ index, children, isActive, highlightColor = "#4ecdc4" }, ref) => {
   return (
     <MotionBox
+      ref={ref}
       animate={{
         backgroundColor: isActive ? `${highlightColor}22` : "transparent",
         borderColor: isActive ? highlightColor : "#333",
@@ .. @@
       minH="40px"
       p={2}
       mb={2}
-      onMouseUp={() => onDrop(index)}
       position="relative"
     >
       {children}
@@ .. @@
       )}
     </MotionBox>
   );
-};
+});
+
+DropZone.displayName = 'DropZone';