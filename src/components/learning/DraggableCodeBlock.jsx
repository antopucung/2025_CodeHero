@@ .. @@
   return (
     <MotionBox
       drag={!isPlaced}
       dragSnapToOrigin
       onDragStart={() => onDragStart(block)}
   )
   )
-      onDragEnd={() => onDragEnd(block)}
+      onDragEnd={(event, info) => onDragEnd(block, info)}
       whileHover={{ scale: isPlaced ? 1 : 1.02 }}
       whileDrag={{ scale: 1.05, zIndex: 10 }}
       animate={{
       }
       }