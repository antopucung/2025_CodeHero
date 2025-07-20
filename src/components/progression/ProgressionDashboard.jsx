// Progression Dashboard Component
import React, { useState } from 'react';
import { Box, VStack, HStack, Grid, Progress, Badge, Tooltip, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useProgressionSystem } from '../../hooks/useProgressionSystem';
import { PublicProfileService } from '../../lib/progressionSystem';
import { Card } from '../../design/components/Card';
import { CustomText, Heading } from '../../design/components/Typography';
import { Button } from '../../design/components/Button';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion(Box);

// Individual components for the dashboard
const LevelProgressCard = ({ profile }) => {
  if (!profile) return null;
  
  const xpToNext = profile.xp_to_next_level || 100;
  const currentXp = profile.total_xp || 0;
  const levelProgress = xpToNext > 0 
    ? ((currentXp % (currentXp + xpToNext)) / (currentXp + xpToNext)) * 100
    : 100;
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <HStack justify="space-between">
          <Heading level={3} size="lg" color="brand">
            Level {profile.overall_level || 1}
          </Heading>
          <Badge bg={designSystem.colors.brand.primary} color={designSystem.colors.text.inverse}>
            {(profile.total_xp || 0).toLocaleString()} XP
          </Badge>
        </HStack>
        
        <VStack spacing={designSystem.spacing[2]} align="stretch">
          <HStack justify="space-between">
            <CustomText size="sm" color="muted">
              Progress to Level {(profile.overall_level || 1) + 1}
            </CustomText>
            <CustomText size="sm" color="secondary">
              {profile.xp_to_next_level || 100} XP remaining
            </CustomText>
          </HStack>
          
          <Progress
            value={levelProgress}
            colorScheme="green"
            size="md"
            bg={designSystem.colors.backgrounds.surface}
            borderRadius={designSystem.radii.base}
          />
        </VStack>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={designSystem.spacing[4]}>
          <VStack spacing={0}>
            <CustomText size="xl" color="accent" fontWeight={designSystem.typography.weights.bold}>
              {profile.total_challenges_completed || 0}
            </CustomText>
            <CustomText size="xs" color="muted">Challenges</CustomText>
          </VStack>
          <VStack spacing={0}>
            <CustomText size="xl" color="secondary" fontWeight={designSystem.typography.weights.bold}>
              {profile.total_lessons_completed || 0}
            </CustomText>
            <CustomText size="xs" color="muted">Lessons</CustomText>
          </VStack>
        </Grid>
      </VStack>
    </Card>
  );
};

const StatsOverviewCard = ({ profile }) => {
  if (!profile) return null;
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <Heading level={3} size="lg" color="secondary">
          Performance Stats
        </Heading>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={designSystem.spacing[4]}>
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="brand" fontWeight={designSystem.typography.weights.bold}>
              {profile.best_wpm || 0}
            </CustomText>
            <CustomText size="sm" color="muted">Best WPM</CustomText>
          </VStack>
          
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="accent" fontWeight={designSystem.typography.weights.bold}>
              {profile.best_accuracy || 0}%
            </CustomText>
            <CustomText size="sm" color="muted">Best Accuracy</CustomText>
          </VStack>
          
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="secondary" fontWeight={designSystem.typography.weights.bold}>
              {profile.streak_days || 0}
            </CustomText>
            <CustomText size="sm" color="muted">Current Streak</CustomText>
          </VStack>
          
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="error" fontWeight={designSystem.typography.weights.bold}>
              {profile.longest_streak || 0}
            </CustomText>
            <CustomText size="sm" color="muted">Longest Streak</CustomText>
          </VStack>
        </Grid>
        
        {(profile.community_contributions || 0) > 0 && (
          <Box mt={designSystem.spacing[4]} pt={designSystem.spacing[4]} borderTop={`1px solid ${designSystem.colors.borders.default}`}>
            <Grid templateColumns="repeat(3, 1fr)" gap={designSystem.spacing[3]}>
              <VStack spacing={0}>
                <CustomText size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
                  {profile.community_contributions || 0}
                </CustomText>
                <CustomText size="xs" color="muted">Community</CustomText>
              </VStack>
              <VStack spacing={0}>
                <CustomText size="lg" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                  {profile.mentorship_hours || 0}
                </CustomText>
                <CustomText size="xs" color="muted">Mentoring</CustomText>
              </VStack>
              <VStack spacing={0}>
                <CustomText size="lg" color="accent" fontWeight={designSystem.typography.weights.bold}>
                  {profile.total_projects_created || 0}
                </CustomText>
                <CustomText size="xs" color="muted">Projects</CustomText>
              </VStack>
            </Grid>
          </Box>
        )}
      </VStack>
    </Card>
  );
};

const AchievementsCard = ({ achievements }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleAchievements = showAll ? achievements : achievements.slice(0, 6);
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <HStack justify="space-between">
          <Heading level={3} size="lg" color="accent">
            Achievements
          </Heading>
          {achievements.length > 6 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All (${achievements.length})`}
            </Button>
          )}
        </HStack>
        
        {achievements.length === 0 ? (
          <Box p={designSystem.spacing[8]} textAlign="center">
            <CustomText color="muted">
              🏆 Start learning to unlock achievements!
            </CustomText>
          </Box>
        ) : (
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={designSystem.spacing[3]}>
            {visibleAchievements.map((achievement, index) => (
              <MotionBox
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Tooltip
                  label={achievement.achievement_definitions.description}
                  bg={designSystem.colors.backgrounds.surface}
                  color={designSystem.colors.text.primary}
                  borderRadius={designSystem.radii.md}
                >
                  <Box
                    bg={designSystem.colors.backgrounds.secondary}
                    border={`1px solid ${achievement.achievement_definitions.color}`}
                    borderRadius={designSystem.radii.md}
                    p={designSystem.spacing[3]}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${achievement.achievement_definitions.color}33`
                    }}
                    transition="all 0.2s ease"
                  >
                    <Box fontSize="2xl" mb={designSystem.spacing[1]}>
                      {achievement.achievement_definitions.icon}
                    </Box>
                    <CustomText
                      size="sm"
                      color={achievement.achievement_definitions.color}
                      fontWeight={designSystem.typography.weights.bold}
                      noOfLines={2}
                    >
                      {achievement.achievement_definitions.title}
                    </CustomText>
                    <Badge
                      bg={achievement.achievement_definitions.color}
                      color={designSystem.colors.text.inverse}
                      mt={designSystem.spacing[1]}
                    >
                      {achievement.achievement_definitions.rarity.toUpperCase()}
                    </Badge>
                  </Box>
                </Tooltip>
              </MotionBox>
            ))}
          </Grid>
        )}
      </VStack>
    </Card>
  );
};

const CertificationsCard = ({ certifications, onGenerateCertificate }) => {
  const activeCertifications = certifications.filter(cert => cert.status === 'active');
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <HStack justify="space-between">
          <Heading level={3} size="lg" color="error">
            Certifications
          </Heading>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onGenerateCertificate?.()}
          >
            Check Eligibility
          </Button>
        </HStack>
        
        {activeCertifications.length === 0 ? (
          <Box p={designSystem.spacing[8]} textAlign="center">
            <CustomText color="muted">
              📜 Complete challenges to earn certifications!
            </CustomText>
          </Box>
        ) : (
          <VStack spacing={designSystem.spacing[3]} align="stretch">
            {activeCertifications.map((certification) => (
              <Box
                key={certification.id}
                bg={designSystem.colors.backgrounds.secondary}
                border={`1px solid ${designSystem.colors.brand.primary}`}
                borderRadius={designSystem.radii.md}
                p={designSystem.spacing[4]}
              >
                <HStack justify="space-between" mb={designSystem.spacing[2]}>
                  <VStack align="start" spacing={0}>
                    <CustomText
                      size="md"
                      color="brand"
                      fontWeight={designSystem.typography.weights.bold}
                    >
                      {certification.certification_types.title}
                    </CustomText>
                    <CustomText size="sm" color="muted">
                      {certification.certificate_number}
                    </CustomText>
                  </VStack>
                  <Badge bg={designSystem.colors.status.success} color={designSystem.colors.text.inverse}>
                    ACTIVE
                  </Badge>
                </HStack>
                
                <CustomText size="sm" color="secondary" mb={designSystem.spacing[2]}>
                  {certification.certification_types.description}
                </CustomText>
                
                <HStack justify="space-between" fontSize="xs" color={designSystem.colors.text.muted}>
                  <CustomText>
                    Issued: {new Date(certification.issued_at).toLocaleDateString()}
                  </CustomText>
                  {certification.expires_at && (
                    <CustomText>
                      Expires: {new Date(certification.expires_at).toLocaleDateString()}
                    </CustomText>
                  )}
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

const XPHistoryCard = ({ xpHistory }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleHistory = showAll ? xpHistory : xpHistory.slice(0, 10);
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <HStack justify="space-between">
          <Heading level={3} size="lg" color="secondary">
            Recent XP Activity
          </Heading>
          {xpHistory.length > 10 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </HStack>
        
        {xpHistory.length === 0 ? (
          <Box p={designSystem.spacing[8]} textAlign="center">
            <CustomText color="muted">
              No XP activity yet. Start learning to see your progress!
            </CustomText>
          </Box>
        ) : (
          <VStack spacing={designSystem.spacing[2]} align="stretch">
            {visibleHistory.map((transaction, index) => (
              <MotionBox
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <HStack
                  bg={designSystem.colors.backgrounds.surface}
                  p={designSystem.spacing[3]}
                  borderRadius={designSystem.radii.md}
                  justify="space-between"
                >
                  <VStack align="start" spacing={0}>
                    <CustomText size="sm" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                      {transaction.xp_categories?.category_name.replace('_', ' ').toUpperCase()}
                    </CustomText>
                    <CustomText size="xs" color="muted">
                      {transaction.description || transaction.source_activity}
                    </CustomText>
                    <CustomText size="xs" color="muted">
                      {new Date(transaction.created_at).toLocaleString()}
                    </CustomText>
                  </VStack>
                  
                  <VStack align="end" spacing={0}>
                    <CustomText
                      size="md"
                      color={transaction.xp_amount > 0 ? "accent" : "error"}
                      fontWeight={designSystem.typography.weights.bold}
                    >
                      {transaction.xp_amount > 0 ? '+' : ''}{transaction.xp_amount} XP
                    </CustomText>
                    <Badge
                      bg={transaction.transaction_type === 'earned' ? designSystem.colors.status.success : designSystem.colors.status.info}
                      color={designSystem.colors.text.inverse}
                    >
                      {transaction.transaction_type.toUpperCase()}
                    </Badge>
                  </VStack>
                </HStack>
              </MotionBox>
            ))}
          </VStack>
        )}
      </VStack>
    </Card>
  );
};

const LanguageProgressCard = ({ profile }) => {
  if (!profile?.language_progress || Object.keys(profile.language_progress).length === 0) return null;
  
  const languages = Object.entries(profile.language_progress);
  
  if (languages.length === 0) return null;
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <Heading level={3} size="lg" color="brand">
          Language Progress
        </Heading>
        
        <VStack spacing={designSystem.spacing[3]} align="stretch">
          {languages.map(([language, progress]) => (
            <Box key={language}>
              <HStack justify="space-between" mb={designSystem.spacing[1]}>
                <CustomText
                  size="sm"
                  color="secondary"
                  fontWeight={designSystem.typography.weights.bold}
                >
                  {language.toUpperCase()}
                </CustomText>
                <Badge bg={designSystem.colors.brand.primary} color={designSystem.colors.text.inverse}>
                  Level {progress?.level || 1}
                </Badge>
              </HStack>
              
              <HStack justify="space-between" mb={designSystem.spacing[1]}>
                <CustomText size="xs" color="muted">
                  {progress?.xp || 0} XP
                </CustomText>
                <CustomText size="xs" color="muted">
                  Next: {((progress?.level || 1) * 50) - (progress?.xp || 0)} XP
                </CustomText>
              </HStack>
              
              <Progress
                value={((progress?.xp || 0) / ((progress?.level || 1) * 50)) * 100}
                size="sm"
                colorScheme="blue"
                bg={designSystem.colors.backgrounds.surface}
                borderRadius={designSystem.radii.base}
              />
            </Box>
          ))}
        </VStack>
      </VStack>
    </Card>
  );
};

// Main Dashboard Component
export const ProgressionDashboard = () => {
  const {
    profile,
    achievements,
    certifications,
    xpHistory,
    loading,
    error,
    checkAvailableCertifications,
    generateCertificate
  } = useProgressionSystem();
  
  const [activeTab, setActiveTab] = useState(0);

  const handleGenerateCertificate = async () => {
    try {
      const available = await checkAvailableCertifications();
      if (available.length > 0) {
        // For now, generate the first available certification
        // In a real implementation, you'd show a modal to choose
        const result = await generateCertificate(available[0].certType.cert_type_key);
        if (result.success) {
          alert(`Certificate generated! Number: ${result.certificateNumber}`);
        } else {
          alert(`Failed to generate certificate: ${result.error}`);
        }
      } else {
        alert('No certifications available at this time. Keep learning!');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Box p={designSystem.spacing[8]} textAlign="center">
        <CustomText color="muted">Loading progression data...</CustomText>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={designSystem.spacing[8]} textAlign="center">
        <CustomText color="error">Error loading progression: {error}</CustomText>
      </Box>
    );
  }

  return (
    <VStack spacing={designSystem.spacing[6]} align="stretch">
      <Heading level={1} size="2xl" color="brand">
        🚀 Your Learning Journey
      </Heading>
      
      <Tabs index={activeTab} onChange={setActiveTab} variant="soft-rounded" colorScheme="green">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Achievements</Tab>
          <Tab>Certifications</Tab>
          <Tab>XP History</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0} pt={designSystem.spacing[6]}>
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={designSystem.spacing[6]}
            >
              <VStack spacing={designSystem.spacing[6]}>
                <LevelProgressCard profile={profile} />
                <StatsOverviewCard profile={profile} />
              </VStack>
              <VStack spacing={designSystem.spacing[6]}>
                <LanguageProgressCard profile={profile} />
                <CertificationsCard 
                  certifications={certifications} 
                  onGenerateCertificate={handleGenerateCertificate}
                />
              </VStack>
            </Grid>
          </TabPanel>
          
          <TabPanel p={0} pt={designSystem.spacing[6]}>
            <AchievementsCard achievements={achievements} />
          </TabPanel>
          
          <TabPanel p={0} pt={designSystem.spacing[6]}>
            <CertificationsCard 
              certifications={certifications} 
              onGenerateCertificate={handleGenerateCertificate}
            />
          </TabPanel>
          
          <TabPanel p={0} pt={designSystem.spacing[6]}>
            <XPHistoryCard xpHistory={xpHistory} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default ProgressionDashboard;