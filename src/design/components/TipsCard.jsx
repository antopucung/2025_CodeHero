import { Card } from './Card';
import { CustomText, Heading } from './Typography';
import { designSystem } from '../system/DesignSystem';

export const TipsCard = ({ title, tips, onTipClick }) => {
  return (
    <Card variant="default"
          bg={designSystem.colors.backgrounds.elevated}
          borderColor={designSystem.colors.borders.default}
          p={designSystem.spacing[6]}>
      <CustomText as Text size="md" color="accent" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[4]}>
        {icon} {title}
      </CustomText>
      <VStack spacing={designSystem.spacing[3]} align="start" px={designSystem.spacing[2]}>
        {tips.map((tip, index) => (
          <Box key={index} pl={designSystem.spacing[2]} pb={designSystem.spacing[1]}
            onClick={() => onTipClick?.(tip)}
            _hover={{ bg: designSystem.colors.backgrounds.elevated }}
          >
            <CustomText size="sm" color="secondary">
              {tip}
            </CustomText>
          </Box>
        ))}
      </VStack>
    </Card>
  );
};