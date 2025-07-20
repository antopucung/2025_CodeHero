// Progression Dashboard Component
import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Grid, Progress, Badge, Tooltip, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgressionSystem } from '../../hooks/useProgressionSystem';
import { PublicProfileService } from '../../lib/progressionSystem';
import { Card } from '../../design/components/Card';
import { CustomText, Heading } from '../../design/components/Typography';
import { Button } from '../../design/components/Button';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion(Box);

// Individual components for the dashboard
const LevelProgressCard = ({ profile }) => {
  if (!profile) {
    return (
      <Card variant="elevated" p={designSystem.spacing[6]}>
        <VStack spacing={designSystem.spacing[4]} align="stretch">
          <CustomText color="muted" textAlign="center">
            Loading level progress...
          </CustomText>
        </VStack>
      </Card>
    );
  }
  
  const xpToNext = profile?.xp_to_next_level ?? 100;
  const currentXp = profile?.total_xp ?? 0;
  const levelProgress = xpToNext > 0 
    ? ((currentXp % (currentXp + xpToNext)) / (currentXp + xpToNext)) * 100
    : 100;
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <HStack justify="space-between">
          <Heading level={3} size="lg" color="brand">
            Level {profile?.overall_level ?? 1}
          </Heading>
          <Badge bg={designSystem.colors.brand.primary} color={designSystem.colors.text.inverse}>
            {(profile?.total_xp ?? 0).toLocaleString()} XP
          </Badge>
        </HStack>
        
        <VStack spacing={designSystem.spacing[2]} align="stretch">
          <HStack justify="space-between">
            <CustomText size="sm" color="muted">
              Progress to Level {(profile?.overall_level ?? 1) + 1}
            </CustomText>
            <CustomText size="sm" color="secondary">
              {profile?.xp_to_next_level ?? 100} XP remaining
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
              {profile?.total_challenges_completed ?? 0}
            </CustomText>
            <CustomText size="xs" color="muted">Challenges</CustomText>
          </VStack>
          <VStack spacing={0}>
            <CustomText size="xl" color="secondary" fontWeight={designSystem.typography.weights.bold}>
              {profile?.total_lessons_completed ?? 0}
            </CustomText>
            <CustomText size="xs" color="muted">Lessons</CustomText>
          </VStack>
        </Grid>
      </VStack>
    </Card>
  );
};

const StatsOverviewCard = ({ profile }) => {
  if (!profile) {
    return (
      <Card variant="elevated" p={designSystem.spacing[6]}>
        <VStack spacing={designSystem.spacing[4]} align="stretch">
          <CustomText color="muted" textAlign="center">
            Loading performance stats...
          </CustomText>
        </VStack>
      </Card>
    );
  }
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        <Heading level={3} size="lg" color="secondary">
          Performance Stats
        </Heading>
        
        <Grid templateColumns="repeat(2, 1fr)" gap={designSystem.spacing[4]}>
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="brand" fontWeight={designSystem.typography.weights.bold}>
              {profile?.best_wpm ?? 0}
            </CustomText>
            <CustomText size="sm" color="muted">Best WPM</CustomText>
          </VStack>
          
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="accent" fontWeight={designSystem.typography.weights.bold}>
              {profile?.best_accuracy ?? 0}%
            </CustomText>
            <CustomText size="sm" color="muted">Best Accuracy</CustomText>
          </VStack>
          
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="secondary" fontWeight={designSystem.typography.weights.bold}>
              {profile?.streak_days ?? 0}
            </CustomText>
            <CustomText size="sm" color="muted">Current Streak</CustomText>
          </VStack>
          
          <VStack spacing={designSystem.spacing[2]}>
            <CustomText size="2xl" color="error" fontWeight={designSystem.typography.weights.bold}>
              {profile?.longest_streak ?? 0}
            </CustomText>
            <CustomText size="sm" color="muted">Longest Streak</CustomText>
          </VStack>
        </Grid>
        
        {(profile?.community_contributions ?? 0) > 0 && (
          <Box mt={designSystem.spacing[4]} pt={designSystem.spacing[4]} borderTop={`1px solid ${designSystem.colors.borders.default}`}>
            <Grid templateColumns="repeat(3, 1fr)" gap={designSystem.spacing[3]}>
              <VStack spacing={0}>
                <CustomText size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
                  {profile?.community_contributions ?? 0}
                </CustomText>
                <CustomText size="xs" color="muted">Community</CustomText>
              </VStack>
              <VStack spacing={0}>
                <CustomText size="lg" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                  {profile?.mentorship_hours ?? 0}
                </CustomText>
                <CustomText size="xs" color="muted">Mentoring</CustomText>
              </VStack>
              <VStack spacing={0}>
                <CustomText size="lg" color="accent" fontWeight={designSystem.typography.weights.bold}>
                  {profile?.total_projects_created ?? 0}
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

// Real-time XP tracking component
const RealTimeXPTracker = ({ profile, isDemo }) => {
  const [xpAnimation, setXpAnimation] = useState({ show: false, amount: 0 });
  const [levelUpAnimation, setLevelUpAnimation] = useState({ show: false, newLevel: 0 });
  
  // Simulate real-time XP gains for demo
  useEffect(() => {
    if (isDemo) {
      const interval = setInterval(() => {
        const randomXP = Math.floor(Math.random() * 50) + 10;
        setXpAnimation({ show: true, amount: randomXP });
        
        setTimeout(() => setXpAnimation({ show: false, amount: 0 }), 2000);
        
        // Occasional level up for demo
        if (Math.random() < 0.1) {
          setLevelUpAnimation({ show: true, newLevel: (profile?.overall_level || 1) + 1 });
          setTimeout(() => setLevelUpAnimation({ show: false, newLevel: 0 }), 3000);
        }
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [isDemo, profile]);
  
  return (
    <>
      {/* Floating XP Gain Animation */}
      <AnimatePresence>
        {xpAnimation.show && (
          <MotionBox
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: [20, -30, -50, -80],
              scale: [0.8, 1.2, 1, 0.9]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            position="fixed"
            top="20%"
            right="10%"
            zIndex={1000}
            pointerEvents="none"
          >
            <Box
              bg="rgba(0, 255, 0, 0.9)"
              color="#000"
              px={4}
              py={2}
              borderRadius="full"
              fontWeight="bold"
              boxShadow="0 0 20px rgba(0, 255, 0, 0.6)"
            >
              +{xpAnimation.amount} XP
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* Level Up Animation */}
      <AnimatePresence>
        {levelUpAnimation.show && (
          <MotionBox
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.3, 1],
              rotate: [0, 360, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1, type: "spring" }}
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={1000}
            pointerEvents="none"
          >
            <Box
              bg="linear-gradient(45deg, #FFD700, #FFA500)"
              color="#000"
              p={6}
              borderRadius="lg"
              textAlign="center"
              boxShadow="0 0 40px rgba(255, 215, 0, 0.8)"
              border="3px solid #FFD700"
            >
              <CustomText size="2xl" fontWeight="bold" mb={2}>
                🎉 LEVEL UP! 🎉
              </CustomText>
              <CustomText size="xl">
                Level {levelUpAnimation.newLevel}
              </CustomText>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
};

// Achievement unlock animation component
const AchievementUnlockAnimation = ({ achievements, isDemo }) => {
  const [showUnlock, setShowUnlock] = useState({ show: false, achievement: null });
  
  useEffect(() => {
    if (isDemo && achievements.length > 0) {
      const interval = setInterval(() => {
        if (Math.random() < 0.15) {
          const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
          setShowUnlock({ show: true, achievement: randomAchievement });
          
          setTimeout(() => setShowUnlock({ show: false, achievement: null }), 4000);
        }
      }, 12000);
      
      return () => clearInterval(interval);
    }
  }, [isDemo, achievements]);
  
  return (
    <AnimatePresence>
      {showUnlock.show && showUnlock.achievement && (
        <MotionBox
          initial={{ scale: 0, y: 50 }}
          animate={{ 
            scale: [0, 1.2, 1],
            y: [50, -10, 0]
          }}
          exit={{ scale: 0, y: -50 }}
          transition={{ duration: 0.8, type: "spring" }}
          position="fixed"
          bottom="10%"
          right="5%"
          zIndex={1000}
          pointerEvents="none"
        >
          <Box
            bg={showUnlock.achievement.achievement_definitions?.color || "#FFD700"}
            color="#000"
            p={4}
            borderRadius="lg"
            textAlign="center"
            boxShadow={`0 0 30px ${showUnlock.achievement.achievement_definitions?.color || "#FFD700"}`}
            maxW="300px"
          >
            <Box fontSize="2xl" mb={2}>
              {showUnlock.achievement.achievement_definitions?.icon || "🏆"}
            </Box>
            <CustomText fontWeight="bold" mb={1}>
              Achievement Unlocked!
            </CustomText>
            <CustomText size="sm">
              {showUnlock.achievement.achievement_definitions?.title || "New Achievement"}
            </CustomText>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

// Professional certification checker
const CertificationChecker = ({ profile, onGenerateCertificate }) => {
  const [availableCerts, setAvailableCerts] = useState([]);
  const [checking, setChecking] = useState(false);
  
  const checkCertifications = async () => {
    setChecking(true);
    try {
      // Mock certification check for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCerts = [];
      if ((profile?.total_challenges_completed || 0) >= 10) {
        mockCerts.push({
          title: "Basic Programming Certification",
          description: "Demonstrates fundamental programming skills",
          requirements: "10+ challenges completed",
          eligible: true
        });
      }
      if ((profile?.best_wpm || 0) >= 50) {
        mockCerts.push({
          title: "Speed Typing Certification", 
          description: "Demonstrates advanced typing skills",
          requirements: "50+ WPM achieved",
          eligible: true
        });
      }
      if ((profile?.total_lessons_completed || 0) >= 15) {
        mockCerts.push({
          title: "Advanced Learning Certification",
          description: "Demonstrates commitment to continuous learning",
          requirements: "15+ lessons completed",
          eligible: true
        });
      }
      
      setAvailableCerts(mockCerts);
    } catch (error) {
      console.error('Error checking certifications:', error);
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <CustomText size="md" fontWeight="bold" color="secondary">
          📜 Available Certifications
        </CustomText>
        <Button
          size="sm"
          onClick={checkCertifications}
          isLoading={checking}
          loadingText="Checking..."
        >
          Check Eligibility
        </Button>
      </HStack>
      
      {availableCerts.length === 0 ? (
        <Box p={4} bg={designSystem.colors.backgrounds.surface} borderRadius="md" textAlign="center">
          <CustomText color="muted" size="sm">
            Complete more challenges to unlock certifications!
          </CustomText>
        </Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {availableCerts.map((cert, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                bg={designSystem.colors.backgrounds.secondary}
                border="1px solid #FFD700"
                borderRadius="md"
                p={4}
              >
                <HStack justify="space-between" mb={2}>
                  <CustomText fontWeight="bold" color="accent">
                    {cert.title}
                  </CustomText>
                  <Badge bg="#FFD700" color="#000">
                    ELIGIBLE
                  </Badge>
                </HStack>
                <CustomText size="sm" color="secondary" mb={2}>
                  {cert.description}
                </CustomText>
                <CustomText size="xs" color="muted">
                  Requirements: {cert.requirements}
                </CustomText>
                <Button
                  size="sm"
                  bg="#FFD700"
                  color="#000"
                  mt={2}
                  onClick={() => onGenerateCertificate?.()}
                >
                  Generate Certificate
                </Button>
              </Box>
            </MotionBox>
          ))}
        </VStack>
      )}
    </Box>
  );
};

// Detailed analytics component
const DetailedAnalytics = ({ profile, xpHistory }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  const periods = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
    { key: 'all', label: 'All Time' }
  ];
  
  // Mock analytics data
  const analytics = {
    dailyXP: Array.from({ length: 7 }, (_, i) => ({
      day: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en', { weekday: 'short' }),
      xp: Math.floor(Math.random() * 200) + 50
    })).reverse(),
    
    activityTypes: [
      { type: 'Typing Challenges', count: profile?.total_challenges_completed || 0, color: '#4ecdc4' },
      { type: 'Lessons Completed', count: profile?.total_lessons_completed || 0, color: '#ffd93d' },
      { type: 'Code Execution', count: Math.floor((profile?.total_challenges_completed || 0) * 0.8), color: '#ff6b6b' },
      { type: 'Community Activity', count: profile?.community_contributions || 0, color: '#a374db' }
    ],
    
    streakData: {
      current: profile?.streak_days || 0,
      longest: profile?.longest_streak || 0,
      average: Math.floor((profile?.longest_streak || 0) * 0.6)
    }
  };
  
  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <CustomText size="lg" fontWeight="bold" color="brand">
          📈 Learning Analytics
        </CustomText>
        <HStack>
          {periods.map(period => (
            <Button
              key={period.key}
              size="sm"
              variant={selectedPeriod === period.key ? "solid" : "outline"}
              onClick={() => setSelectedPeriod(period.key)}
            >
              {period.label}
            </Button>
          ))}
        </HStack>
      </HStack>
      
      {/* XP Trend Chart */}
      <Card variant="elevated" p={4}>
        <CustomText fontWeight="bold" mb={3}>Daily XP Trend</CustomText>
        <HStack spacing={2} justify="space-between" align="end" h="100px">
          {analytics.dailyXP.map((data, index) => (
            <VStack key={index} spacing={1}>
              <MotionBox
                initial={{ height: 0 }}
                animate={{ height: `${(data.xp / 250) * 80}px` }}
                transition={{ delay: index * 0.1 }}
                bg="#4ecdc4"
                w="30px"
                borderRadius="2px"
                position="relative"
              >
                <Tooltip label={`${data.xp} XP`}>
                  <Box position="absolute" top="-20px" left="50%" transform="translateX(-50%)">
                    <CustomText size="xs" color="muted">{data.xp}</CustomText>
                  </Box>
                </Tooltip>
              </MotionBox>
              <CustomText size="xs" color="muted">{data.day}</CustomText>
            </VStack>
          ))}
        </HStack>
      </Card>
      
      {/* Activity Breakdown */}
      <Card variant="elevated" p={4}>
        <CustomText fontWeight="bold" mb={3}>Activity Breakdown</CustomText>
        <VStack spacing={3} align="stretch">
          {analytics.activityTypes.map((activity, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <HStack justify="space-between">
                <HStack>
                  <Box w="12px" h="12px" bg={activity.color} borderRadius="2px" />
                  <CustomText size="sm">{activity.type}</CustomText>
                </HStack>
                <CustomText fontWeight="bold" color="accent">
                  {activity.count}
                </CustomText>
              </HStack>
              <Progress
                value={(activity.count / Math.max(...analytics.activityTypes.map(a => a.count), 1)) * 100}
                size="sm"
                colorScheme="green"
                bg={designSystem.colors.backgrounds.surface}
                borderRadius="full"
              />
            </MotionBox>
          ))}
        </VStack>
      </Card>
      
      {/* Streak Analytics */}
      <Card variant="elevated" p={4}>
        <CustomText fontWeight="bold" mb={3}>Streak Performance</CustomText>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <VStack>
            <CustomText size="2xl" color="brand" fontWeight="bold">
              {analytics.streakData.current}
            </CustomText>
            <CustomText size="sm" color="muted">Current Streak</CustomText>
          </VStack>
          <VStack>
            <CustomText size="2xl" color="accent" fontWeight="bold">
              {analytics.streakData.longest}
            </CustomText>
            <CustomText size="sm" color="muted">Longest Streak</CustomText>
          </VStack>
          <VStack>
            <CustomText size="2xl" color="secondary" fontWeight="bold">
              {analytics.streakData.average}
            </CustomText>
            <CustomText size="sm" color="muted">Average Streak</CustomText>
          </VStack>
        </Grid>
      </Card>
    </VStack>
  );
};

// Main Dashboard Component
export const ProgressionDashboard = ({ 
  profile: propProfile, 
  achievements: propAchievements, 
  certifications: propCertifications,
  xpHistory: propXpHistory,
  isDemo = false 
}) => {
  const {
    profile: hookProfile,
    achievements: hookAchievements,
    certifications: hookCertifications,
    xpHistory: hookXpHistory,
    loading: hookLoading,
    error: hookError,
    checkAvailableCertifications,
    generateCertificate
  } = useProgressionSystem();
  
  // Use props if provided (for demo mode), otherwise use hook data
  const profile = propProfile || hookProfile;
  const achievements = propAchievements || hookAchievements;
  const certifications = propCertifications || hookCertifications;
  const xpHistory = propXpHistory || hookXpHistory;
  const loading = isDemo ? false : hookLoading;
  const error = isDemo ? null : hookError;
  
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
      {/* Real-time XP Tracker */}
      <RealTimeXPTracker profile={profile} isDemo={isDemo} />
      
      {/* Achievement Unlock Animations */}
      <AchievementUnlockAnimation achievements={achievements} isDemo={isDemo} />
      
      {/* Demo Mode Indicator */}
      {isDemo && (
        <Box 
          bg="rgba(255, 217, 61, 0.1)" 
          border="1px solid #ffd93d" 
          borderRadius="md" 
          p={4}
          textAlign="center"
        >
          <CustomText color="#ffd93d" fontWeight="bold">
            🎮 Demo Mode - Real-time features active! Log in to save your actual progress.
          </CustomText>
        </Box>
      )}
      
      <Heading level={1} size="2xl" color="brand">
        🚀 {isDemo ? 'Demo Learning Journey' : 'Your Learning Journey'}
      </Heading>
      
      <Tabs index={activeTab} onChange={setActiveTab} variant="soft-rounded" colorScheme="green">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Achievements</Tab>
          <Tab>Certifications</Tab>
          <Tab>Analytics</Tab>
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
            <Box mt={6}>
              <CertificationChecker 
                profile={profile}
                onGenerateCertificate={handleGenerateCertificate}
              />
            </Box>
          </TabPanel>
          
          <TabPanel p={0} pt={designSystem.spacing[6]}>
            <DetailedAnalytics profile={profile} xpHistory={xpHistory} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

// Global XP notification system
if (typeof window !== 'undefined') {
  window.showXPGain = (amount) => {
    const event = new CustomEvent('xpGained', { detail: { amount } });
    window.dispatchEvent(event);
  };
}

export default ProgressionDashboard;