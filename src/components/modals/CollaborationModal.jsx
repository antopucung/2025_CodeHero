import React, { useState, useEffect } from 'react';
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader, 
   ModalBody, 
   ModalFooter, 
   ModalCloseButton, 
   VStack, 
   HStack, 
   Button,
   Input,
   Textarea,
   Text,
   Box,
   Select,
   Grid,
   Badge
} from '@chakra-ui/react';
import { designSystem } from '../../design/system/DesignSystem';
import { motion } from 'framer-motion';

import { useCollaborationSystem } from '../../hooks/useCollaborationSystem';
import { CollaborationProfileForm } from '../../design/components/collaboration/CollaborationProfileForm';

const MotionBox = motion(Box);

export const CollaborationModal = ({ 
  isOpen, 
  onClose, 
  project,
  onCollaborationComplete
}) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [proposal, setProposal] = useState('');
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState('');

  const [step, setStep] = useState('application'); // 'profile', 'application', 'success'
  const [processing, setProcessing] = useState(false);
  
  const { 
    hasCollaborationProfile, 
    createCollaborationProfile,
    createCollaborationRequest 
  } = useCollaborationSystem();
  
  useEffect(() => {
    // Reset step when modal opens
    if (isOpen) {
      const hasProfile = hasCollaborationProfile();
      setStep(hasProfile ? 'application' : 'profile');
    }
  }, [isOpen]);

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const availabilityOptions = ['Part-time (5-10 hrs/week)', 'Part-time (10-20 hrs/week)', 'Full-time availability', 'Flexible schedule'];

  const allSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET',
    'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift',
    'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap', 'Material-UI',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST APIs',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'Git', 'Testing', 'Agile', 'Scrum', 'UI/UX', 'Figma',
    'Photoshop', 'Illustrator', 'Mobile Development', 'Game Development'
  ];

  const handleProfileSubmit = async (profileData) => {
    try {
      setProcessing(true);
      await createCollaborationProfile(profileData);
      setStep('application');
    } catch (error) {
      console.error('Error creating collaboration profile:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleApply = async () => {
    try {
      setProcessing(true);
      
      // Submit collaboration request
      const result = await createCollaborationRequest({
        projectId: project.id,
        role: selectedRole,
        message: proposal,
        skills: skills
      });
      
      if (result.success) {
        setStep('success');
        
        // Notify parent component
        if (onCollaborationComplete) {
          onCollaborationComplete(result.request);
        }
        
        // Reset form
        setSelectedRole('');
        setExperience('');
        setAvailability('');
        setPortfolio('');
        setProposal('');
        setSkills([]);
        setContact('');
        
        // Close modal after a delay on success
        setTimeout(() => {
          onClose();
          setStep('application'); // Reset for next time
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting collaboration request:', error);
    } finally {
      setProcessing(false);
    }
  };

  const toggleSkill = (skill) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="rgba(0,0,0,0.8)" />
      <ModalContent 
        bg={designSystem.colors.backgrounds.secondary} 
        color={designSystem.colors.text.primary}
        border={`1px solid ${designSystem.colors.borders.default}`}
        maxH="90vh"
        overflowY="auto"
      >
        {/* Header changes based on current step */}
        <ModalHeader borderBottom={`1px solid ${designSystem.colors.borders.default}`}>
          {step === 'profile' && (
            <VStack align="start" spacing={2}>
              <Text size="lg" color="brand">👤 Create Collaboration Profile</Text>
              <Text size="sm" color="muted">Tell us about your skills and availability</Text>
            </VStack>
          )}
          
          {step === 'application' && (
            <VStack align="start" spacing={2}>
              <Text size="lg" color="brand">🤝 Apply to Collaborate: {project?.title || 'Project'}</Text>
              <Text size="sm" color="muted">Join the team and help build something amazing</Text>
            </VStack>
          )}
          
          {step === 'success' && (
            <VStack align="start" spacing={2}>
              <Text size="lg" color="success">✅ Application Submitted</Text>
              <Text size="sm" color="muted">Your collaboration request has been sent</Text>
            </VStack>
          )}
        </ModalHeader>
        <ModalCloseButton color={designSystem.colors.text.muted} disabled={processing} />
        
        
        <ModalBody p={6}>
          {/* Profile Creation Form */}
          {step === 'profile' && (
            <CollaborationProfileForm
              onSubmit={handleProfileSubmit}
              onCancel={onClose}
            />
          )}
          
          {/* Collaboration Application Form */}
          {step === 'application' && (
            <VStack spacing={6} align="stretch">
              {!project && (
                <Box p={4} bg="red.100" borderRadius="md" color="red.800">
                  <Text>No project selected. Please close this modal and try again.</Text>
                </Box>
              )}
              
              {project && (
              <>
              {/* Role Selection */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="bold" color="secondary">Available Positions</Text>
                <VStack spacing={2} align="stretch">
                  {project.openRoles?.map((role) => (
                    <Button
                      key={role.role}
                      variant={selectedRole === role.role ? 'solid' : 'outline'}
                      bg={selectedRole === role.role ? '#4ECDC4' : 'transparent'}
                      color={selectedRole === role.role ? '#000' : designSystem.colors.text.primary}
                      borderColor={selectedRole === role.role ? '#4ECDC4' : designSystem.colors.borders.default}
                      onClick={() => setSelectedRole(role.role)}
                      textAlign="left"
                      h="auto"
                      p={4}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{role.role}</Text>
                        <Text size="sm" opacity={0.8}>{role.timeCommitment}</Text>
                        <HStack spacing={1} flexWrap="wrap">
                          {role.skills.map((skill, i) => (
                            <Badge key={i} size="sm" bg="rgba(255,255,255,0.2)">
                              {skill}
                            </Badge>
                          ))}
                        </HStack>
                      </VStack>
                    </Button>
                  ))}
                </VStack>
              </VStack>

              {/* Experience Level */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="bold" color="secondary">Experience Level</Text>
                <Select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  bg={designSystem.colors.backgrounds.surface}
                  borderColor={designSystem.colors.borders.default}
                  placeholder="Select your experience level"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </Select>
              </VStack>

              {/* Availability */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="bold" color="secondary">Availability</Text>
                <Select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  bg={designSystem.colors.backgrounds.surface}
                  borderColor={designSystem.colors.borders.default}
                  placeholder="How much time can you commit?"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </VStack>

              {/* Skills */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="bold" color="secondary">Relevant Skills</Text>
                <Box>
                  <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={2}>
                    {allSkills.map((skill) => (
                      <Button
                        key={skill}
                        size="sm"
                        variant={skills.includes(skill) ? 'solid' : 'outline'}
                        bg={skills.includes(skill) ? '#4ECDC4' : 'transparent'}
                        color={skills.includes(skill) ? '#000' : designSystem.colors.text.primary}
                        borderColor={skills.includes(skill) ? '#4ECDC4' : designSystem.colors.borders.default}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </Grid>
                </Box>
              </VStack>

              {/* Portfolio */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="bold" color="secondary">Portfolio/GitHub</Text>
                <Input
                  placeholder="Link to your portfolio, GitHub, or relevant work"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  bg={designSystem.colors.backgrounds.surface}
                  borderColor={designSystem.colors.borders.default}
                />
              </VStack>

              {/* Contact */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="bold" color="secondary">Contact Information</Text>
                <Input
                  placeholder="Email or Discord for project communication"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  bg={designSystem.colors.backgrounds.surface}
                  borderColor={designSystem.colors.borders.default}
                />
              </VStack>

              {/* Proposal */}
              <VStack spacing={3} align="stretch">
                <Text fontWeight="bold" color="secondary">Why do you want to collaborate?</Text>
                <Textarea
                  placeholder="Tell us why you're interested in this project and what you can bring to the team..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  bg={designSystem.colors.backgrounds.surface}
                  borderColor={designSystem.colors.borders.default}
                  rows={4}
                />
              </VStack>

              {/* Collaboration Benefits */}
              <Box p={4} bg={designSystem.colors.backgrounds.surface} borderRadius="md">
                <Text fontWeight="bold" color="brand" mb={2}>Collaboration Benefits:</Text>
                <VStack spacing={1} align="start" fontSize="sm" color={designSystem.colors.text.secondary}>
                  <Text>✓ Gain real-world project experience</Text>
                  <Text>✓ Build your professional portfolio</Text>
                  <Text>✓ Network with verified creators</Text>
                  <Text>✓ Receive project completion certificate</Text>
                  <Text>✓ Potential for future paid opportunities</Text>
                </VStack>
              </Box>
              </>
              )}
            </VStack>
          )}
          
          {/* Success Message */}
          {step === 'success' && (
            <VStack spacing={6} py={8} px={4} align="center">
              <MotionBox
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                mb={4}
              >
                <Box
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg="#38A169"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="40px"
                >
                  ✓
                </Box>
              </MotionBox>
              
              <Text size="xl" color="success" fontWeight="bold">
                Application Submitted!
              </Text>
              
              <Text size="md" color="secondary" textAlign="center" maxW="500px">
                Thank you for applying to collaborate on this project. The project creator will review your application and contact you if they're interested in working together.
              </Text>
              
              <Text size="sm" color="muted" mt={4}>
                You can view the status of your application in your profile.
              </Text>
            </VStack>
          )}
        </ModalBody>

        {step === 'application' && (
          <ModalFooter borderTop={`1px solid ${designSystem.colors.borders.default}`}>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onClose} disabled={processing}>
                Cancel
              </Button>
              <Button
                bg="#4ECDC4"
                color="#000"
                onClick={handleApply}
                isLoading={processing}
                loadingText="Submitting"
                disabled={processing || !selectedRole || !experience || !availability || !proposal || !contact}
                _hover={{ bg: '#5ED9D1' }}
              >
                🤝 Submit Application
              </Button>
            </HStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};