import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, VStack, HStack, Button, Badge, Image, Textarea, Input, Select } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCommissionSystem } from '../hooks/useCommissionSystem';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { Card } from '../design/components/Card';
import { Text, Heading } from '../design/components/Typography';
import { Button as CustomButton } from '../design/components/Button';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const CommissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { commissions, applyToCommission, getApplicationsByCommission } = useCommissionSystem();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    proposal: '',
    estimatedBudget: '',
    timeline: '',
    experience: ''
  });

  // Find the commission
  const commission = commissions.find(c => c.id === id);
  const applications = getApplicationsByCommission(id);

  if (!commission) {
    return (
      <PageLayout>
        <VStack spacing={4}>
          <Text color="error">Commission not found</Text>
          <CustomButton onClick={() => navigate('/community')}>
            ← Back to Community
          </CustomButton>
        </VStack>
      </PageLayout>
    );
  }

  const handleSubmitApplication = async () => {
    if (!applicationData.proposal.trim()) return;
    
    await applyToCommission(id, applicationData);
    setShowApplicationForm(false);
    setApplicationData({
      proposal: '',
      estimatedBudget: '',
      timeline: '',
      experience: ''
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: designSystem.colors.status.success,
      intermediate: designSystem.colors.status.warning,
      advanced: designSystem.colors.status.error
    };
    return colors[difficulty] || designSystem.colors.status.info;
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      csharp: '🔵',
      php: '🐘'
    };
    return icons[language] || '💻';
  };

  return (
    <PageLayout>
      <SectionLayout spacing="default">
        <HStack spacing={2} mb={4}>
          <CustomButton 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/community')}
          >
            ← Back to Community
          </CustomButton>
          <Badge bg={commission.status === 'open' ? designSystem.colors.status.success : designSystem.colors.status.warning} color="white">
            {commission.status.toUpperCase()}
          </Badge>
        </HStack>

        <VStack spacing={6} align="stretch">
          {/* Commission Header */}
          <Card variant="elevated" p={6}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={2} flex={1}>
                  <Heading level={1} size="2xl" color="secondary">
                    {commission.title}
                  </Heading>
                  <HStack spacing={3}>
                    <Text color="muted">by {commission.client}</Text>
                    <Text color="muted">•</Text>
                    <Text color="muted">{commission.posted}</Text>
                  </HStack>
                </VStack>
                <VStack align="end" spacing={2}>
                  <Badge bg={getDifficultyColor(commission.difficulty)} color="white">
                    {commission.difficulty.toUpperCase()}
                  </Badge>
                  <Badge bg={designSystem.colors.backgrounds.surface} color="white">
                    {getLanguageIcon(commission.language)} {commission.language.toUpperCase()}
                  </Badge>
                </VStack>
              </HStack>

              <HStack spacing={6}>
                <VStack align="start" spacing={0}>
                  <Text color="muted">Budget Range</Text>
                  <Text size="xl" color="accent" fontWeight="bold">
                    ${commission.budget?.min?.toLocaleString()} - ${commission.budget?.max?.toLocaleString()}
                  </Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Text color="muted">Timeline</Text>
                  <Text size="lg" color="secondary" fontWeight="bold">
                    {commission.timeline}
                  </Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Text color="muted">Applications</Text>
                  <Text size="lg" color="brand" fontWeight="bold">
                    {commission.applications}
                  </Text>
                </VStack>
              </HStack>

              <HStack spacing={1} flexWrap="wrap">
                {commission.tags?.map((tag, i) => (
                  <Badge key={i} bg={designSystem.colors.brand.secondary} color="white">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            </VStack>
          </Card>

          {/* Commission Description */}
          <Card variant="default" p={6}>
            <VStack spacing={4} align="stretch">
              <Heading level={2} size="lg" color="brand">
                📋 Project Description
              </Heading>
              <Text color="secondary" lineHeight="1.6">
                {commission.description}
              </Text>
            </VStack>
          </Card>

          {/* Application Section */}
          <Card variant="elevated" p={6}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading level={2} size="lg" color="secondary">
                  🚀 Apply for This Project
                </Heading>
                {!showApplicationForm && (
                  <CustomButton
                    bg={designSystem.colors.brand.secondary}
                    color={designSystem.colors.text.inverse}
                    onClick={() => setShowApplicationForm(true)}
                    disabled={commission.status !== 'open'}
                  >
                    Submit Application
                  </CustomButton>
                )}
              </HStack>

              {showApplicationForm && (
                <MotionBox
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <VStack spacing={4} align="stretch">
                    <VStack align="start" spacing={2}>
                      <Text color="secondary" fontWeight="bold">Project Proposal *</Text>
                      <Textarea
                        placeholder="Describe your approach to this project, your relevant experience, and why you're the right fit..."
                        value={applicationData.proposal}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, proposal: e.target.value }))}
                        bg={designSystem.colors.backgrounds.surface}
                        border={`1px solid ${designSystem.colors.borders.default}`}
                        color={designSystem.colors.text.primary}
                        fontFamily={designSystem.typography.fonts.mono}
                        rows={6}
                        _focus={{
                          borderColor: designSystem.colors.brand.primary,
                          boxShadow: 'none'
                        }}
                      />
                    </VStack>

                    <HStack spacing={4}>
                      <VStack align="start" spacing={2} flex={1}>
                        <Text color="secondary" fontWeight="bold">Your Budget Estimate</Text>
                        <Input
                          placeholder="$2,500"
                          value={applicationData.estimatedBudget}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                          bg={designSystem.colors.backgrounds.surface}
                          border={`1px solid ${designSystem.colors.borders.default}`}
                          color={designSystem.colors.text.primary}
                          fontFamily={designSystem.typography.fonts.mono}
                        />
                      </VStack>
                      <VStack align="start" spacing={2} flex={1}>
                        <Text color="secondary" fontWeight="bold">Estimated Timeline</Text>
                        <Select
                          value={applicationData.timeline}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, timeline: e.target.value }))}
                          bg={designSystem.colors.backgrounds.surface}
                          border={`1px solid ${designSystem.colors.borders.default}`}
                          color={designSystem.colors.text.primary}
                          fontFamily={designSystem.typography.fonts.mono}
                        >
                          <option value="">Select timeline</option>
                          <option value="1 week">1 week</option>
                          <option value="2 weeks">2 weeks</option>
                          <option value="3-4 weeks">3-4 weeks</option>
                          <option value="1-2 months">1-2 months</option>
                          <option value="2+ months">2+ months</option>
                        </Select>
                      </VStack>
                    </HStack>

                    <VStack align="start" spacing={2}>
                      <Text color="secondary" fontWeight="bold">Relevant Experience</Text>
                      <Textarea
                        placeholder="Describe your relevant experience with similar projects, technologies used, etc."
                        value={applicationData.experience}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                        bg={designSystem.colors.backgrounds.surface}
                        border={`1px solid ${designSystem.colors.borders.default}`}
                        color={designSystem.colors.text.primary}
                        fontFamily={designSystem.typography.fonts.mono}
                        rows={3}
                      />
                    </VStack>

                    <HStack spacing={3}>
                      <CustomButton
                        variant="secondary"
                        onClick={() => setShowApplicationForm(false)}
                      >
                        Cancel
                      </CustomButton>
                      <CustomButton
                        bg={designSystem.colors.brand.secondary}
                        color={designSystem.colors.text.inverse}
                        onClick={handleSubmitApplication}
                        disabled={!applicationData.proposal.trim()}
                      >
                        Submit Application
                      </CustomButton>
                    </HStack>
                  </VStack>
                </MotionBox>
              )}

              {!showApplicationForm && applications.length > 0 && (
                <VStack spacing={3} align="stretch">
                  <Text color="muted">
                    {applications.length} application{applications.length !== 1 ? 's' : ''} received
                  </Text>
                  <Text size="sm" color="muted">
                    💡 Tip: Submit a detailed proposal with relevant examples to stand out
                  </Text>
                </VStack>
              )}
            </VStack>
          </Card>

          {/* Similar Projects */}
          <Card variant="default" p={6}>
            <VStack spacing={4} align="stretch">
              <Heading level={2} size="lg" color="brand">
                💡 Tips for a Strong Application
              </Heading>
              <VStack spacing={2} align="start" fontSize="sm" color={designSystem.colors.text.secondary}>
                <Text>✓ Be specific about your approach and methodology</Text>
                <Text>✓ Include links to relevant portfolio projects</Text>
                <Text>✓ Provide realistic timeline and budget estimates</Text>
                <Text>✓ Explain your communication and project management style</Text>
                <Text>✓ Ask clarifying questions about requirements</Text>
              </VStack>
            </VStack>
          </Card>
        </VStack>
      </SectionLayout>
    </PageLayout>
  );
};

export default CommissionDetailPage;