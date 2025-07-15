@@ .. @@
 export const TipsCard = ({ title, tips, icon }) => {
   return (
-    <Card 
-      variant="default"
-      bg={designSystem.colors.backgrounds.elevated}
-      borderColor={designSystem.colors.borders.default}
-      p={designSystem.spacing[6]}
-    >
-      <Text size="md" color="accent" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[3]}>
+    <Card variant="default"
+          bg={designSystem.colors.backgrounds.elevated}
+          borderColor={designSystem.colors.borders.default}
+          p={designSystem.spacing[6]}>
+      <Text size="md" color="accent" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[4]}>
         {icon} {title}
       </Text>
-      <VStack spacing={designSystem.spacing[3]} align="start">
+      <VStack spacing={designSystem.spacing[3]} align="start" px={designSystem.spacing[2]}>
         {tips.map((tip, index) => (
-          <Box key={index} px={designSystem.spacing[2]}>
-            <Text size="xs" color="secondary">
+          <Box key={index} pl={designSystem.spacing[2]} pb={designSystem.spacing[1]}>
+            <Text size="sm" color="secondary">
               {tip}
             </Text>
           </Box>
         ))}
       </VStack>
     </Card>
   );
 };