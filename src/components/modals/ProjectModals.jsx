import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  Select,
  Text,
  Badge,
  Box,
  Grid,
  Checkbox
} from '@chakra-ui/react';
import { designSystem } from '../../design/system/DesignSystem';

export const DonationModal = ({ isOpen, onClose, project }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const presetAmounts = [5, 10, 25, 50, 100];

  const handleDonate = () => {
    const donationAmount = amount === 'custom' ? customAmount : amount;
    console.log('Processing donation:', {
      amount: donationAmount,
      paymentMethod,
      email,
      message,
      anonymous,
      project: project.id
    });
    // Here you would integrate with payment processor
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="rgba(0,0,0,0.8)" />
      <ModalContent 
        bg={designSystem.colors.backgrounds.secondary} 
        color={designSystem.colors.text.primary}
        border={`1px solid ${designSystem.colors.borders.default}`}
      >
        <ModalHeader 
          bg={designSystem.colors.backgrounds.elevated}
          borderBottom={`1px solid ${designSystem.colors.borders.default}`}
        >
          <VStack align="start" spacing={2}>
            <Text size="lg" color="accent">💰 Support: {project.title}</Text>
            <Text size="sm" color="muted">Help bring this project to life</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton color={designSystem.colors.text.muted} />
        
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Amount Selection */}
            <VStack spacing={3} align="stretch">
              <Text fontWeight="bold" color="secondary">Choose Amount</Text>
              <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset ? 'solid' : 'outline'}
                    bg={amount === preset ? '#FFD700' : 'transparent'}
                    color={amount === preset ? '#000' : designSystem.colors.text.primary}
                    borderColor={amount === preset ? '#FFD700' : designSystem.colors.borders.default}
                    onClick={() => setAmount(preset)}
                  >
                    ${preset}
                  </Button>
                ))}
              </Grid>
              
              <HStack>
                <Button
                  variant={amount === 'custom' ? 'solid' : 'outline'}
                  bg={amount === 'custom' ? '#FFD700' : 'transparent'}
                  color={amount === 'custom' ? '#000' : designSystem.colors.text.primary}
                  borderColor={amount === 'custom' ? '#FFD700' : designSystem.colors.borders.default}
                  onClick={() => setAmount('custom')}
                  flex={1}
                >
                  Custom
                </Button>
                {amount === 'custom' && (
                  <Input
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    type="number"
                    min="1"
                    bg={designSystem.colors.backgrounds.surface}
                    borderColor={designSystem.colors.borders.default}
                    flex={2}
                  />
                )}
              </HStack>
            </VStack>

            {/* Payment Method */}
            <VStack spacing={3} align="stretch">
              <Text fontWeight="bold" color="secondary">Payment Method</Text>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                bg={designSystem.colors.backgrounds.surface}
                borderColor={designSystem.colors.borders.default}
              >
                <option value="card">💳 Credit/Debit Card</option>
                <option value="paypal">🟦 PayPal</option>
                <option value="crypto">₿ Cryptocurrency</option>
              </Select>
            </VStack>

            {/* Contact Info */}
            <VStack spacing={3} align="stretch">
              <Text fontWeight="bold" color="secondary">Contact Information</Text>
              <Input
                placeholder="Email for receipt and updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                bg={designSystem.colors.backgrounds.surface}
                borderColor={designSystem.colors.borders.default}
              />
              <Checkbox
                isChecked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                colorScheme="green"
              >
                <Text size="sm" color="muted">Make donation anonymous</Text>
              </Checkbox>
            </VStack>

            {/* Optional Message */}
            <VStack spacing={3} align="stretch">
              <Text fontWeight="bold" color="secondary">Message (Optional)</Text>
              <Textarea
                placeholder="Leave a message of support for the creator..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                bg={designSystem.colors.backgrounds.surface}
                borderColor={designSystem.colors.borders.default}
                rows={3}
              />
            </VStack>

            {/* Benefits */}
            <Box p={4} bg={designSystem.colors.backgrounds.surface} borderRadius="md">
              <Text fontWeight="bold" color="accent" mb={2}>Your Support Includes:</Text>
              <VStack spacing={1} align="start" fontSize="sm" color={designSystem.colors.text.secondary}>
                <Text>✓ Project completion updates</Text>
                <Text>✓ Early access to releases</Text>
                <Text>✓ Special thanks in project credits</Text>
                <Text>✓ Access to source code repository</Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter borderTop={`1px solid ${designSystem.colors.borders.default}`}>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="#FFD700"
              color="#000"
              onClick={handleDonate}
              disabled={!amount || (amount === 'custom' && !customAmount) || !email}
              _hover={{ bg: '#FFED4E' }}
            >
              💰 Donate ${amount === 'custom' ? customAmount : amount}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const CollaborationModal = ({ isOpen, onClose, project }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [proposal, setProposal] = useState('');
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState('');

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const availabilityOptions = ['Part-time (5-10 hrs/week)', 'Part-time (10-20 hrs/week)', 'Full-time availability', 'Flexible schedule'];

  const handleApply = () => {
    console.log('Submitting collaboration application:', {
      role: selectedRole,
      experience,
      availability,
      portfolio,
      proposal,
      skills,
      contact,
      project: project.id
    });
    // Here you would send the application to the creator
    onClose();
  };

  const toggleSkill = (skill) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const allSkills = ['React', 'Node.js', 'Python', 'Unity', 'C#', 'JavaScript', 'TypeScript', 'UI/UX Design', 'Game Design', 'Audio Design'];

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
        <ModalHeader 
          bg={designSystem.colors.backgrounds.elevated}
          borderBottom={`1px solid ${designSystem.colors.borders.default}`}
        >
          <VStack align="start" spacing={2}>
            <Text size="lg" color="brand">🤝 Apply to Collaborate: {project.title}</Text>
            <Text size="sm" color="muted">Join the team and help build something amazing</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton color={designSystem.colors.text.muted} />
        
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Role Selection */}
            <VStack spacing={3} align="stretch">
              <Text fontWeight="bold" color="secondary">Available Positions</Text>
              <VStack spacing={2} align="stretch">
                {project.openRoles.map((role) => (
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
              </VStack>
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
          </VStack>
        </ModalBody>

        <ModalFooter borderTop={`1px solid ${designSystem.colors.borders.default}`}>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="#4ECDC4"
              color="#000"
              onClick={handleApply}
              disabled={!selectedRole || !experience || !availability || !proposal || !contact}
              _hover={{ bg: '#5ED9D1' }}
            >
              🤝 Submit Application
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};