import React from 'react';
import { Box, VStack, HStack, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Card } from '../../design/components/Card';
import { CustomText as Text, Heading } from '../../design/components/Typography';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion.div;

export const LanguageProgress = ({ languageProgress }) => {
  function getLanguageColor(language) {
    const colors = {
      javascript: '#F7DF1E',
      typescript: '#3178C6',
      python: '#3776AB',
      java: '#ED8B00',
      csharp: '#239120',
      php: '#777BB4'
    };
    return colors[language] || designSystem.colors.brand.primary;
  }

  const progressData = Object.entries(languageProgress || {}).map(([lang, data]) => ({
    language: lang,
    level: data.level,
    xp: data.xp,
    color: getLanguageColor(lang)
  }));

  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <Heading level={3} size="lg" color="brand" mb={designSystem.spacing[4]}>
        📊 Language Progress
      </Heading>
      <VStack spacing={designSystem.spacing[5]} align="stretch">
        {progressData.map((lang, index) => (
          <MotionBox
            key={lang.language}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box px={designSystem.spacing[2]}>
            <HStack justify="space-between" mb={designSystem.spacing[3]}>
              <HStack spacing={designSystem.spacing[2]}>
                <Text fontWeight={designSystem.typography.weights.bold} color="secondary">
                  {lang.language.toUpperCase()}
                </Text>
                <Badge bg={lang.color} color={designSystem.colors.text.inverse}>
                  Level {lang.level}
                </Badge>
              </HStack>
              <Text size="sm" color="muted">
                {lang.xp} XP
              </Text>
            </HStack>
            <Box
              bg={designSystem.colors.backgrounds.secondary}
              h="8px"
              borderRadius={designSystem.radii.base}
              overflow="hidden"
              mx={designSystem.spacing[1]}
            >
              <Box
                bg={lang.color}
                h="100%"
                w={`${Math.min((lang.xp / (lang.level * 50)) * 100, 100)}%`}
                transition="width 0.3s"
              />
            </Box>
            </Box>
          </MotionBox>
        ))}
      </VStack>
    </Card>
  );
};