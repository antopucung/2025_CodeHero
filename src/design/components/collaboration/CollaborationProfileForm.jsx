import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Input, 
  Textarea, 
  Select, 
  Grid,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast
} from "@chakra-ui/react";
import { designSystem } from '../../system/DesignSystem';
import { CustomText } from '../Typography';
import { Button } from '../Button';

export const CollaborationProfileForm = ({
  profile = null,
  onSubmit,
  onCancel
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    // Personal info
    name: profile?.name || '',
    email: profile?.email || '',
    portfolio: profile?.portfolio || '',
    githubProfile: profile?.githubProfile || '',
    bio: profile?.bio || '',
    
    // Skills
    skills: profile?.skills || [],
    
    // Preferred roles
    roles: profile?.roles || [],
    
    // Availability
    hoursPerWeek: profile?.availability?.hoursPerWeek || '',
    preferredTimeZone: profile?.availability?.preferredTimeZone || '',
    availableDays: profile?.availability?.availableDays || ['weekdays'],
    
    // Questionnaire
    experience: profile?.questionnaire?.experience || '',
    previousWork: profile?.questionnaire?.previousWork || '',
    interests: profile?.questionnaire?.interests || '',
    goals: profile?.questionnaire?.goals || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Available skills options
  const skillOptions = [
    // Frontend
    'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Svelte',
    // Backend
    'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go',
    // Mobile
    'React Native', 'Flutter', 'Swift', 'Kotlin',
    // Design
    'UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
    // Game Development
    'Unity', 'Unreal Engine', 'Godot', 'Phaser', 'Three.js',
    // Data
    'SQL', 'NoSQL', 'Data Analysis', 'Machine Learning', 'AI',
    // DevOps
    'Git', 'Docker', 'AWS', 'Azure', 'GCP', 'CI/CD',
    // Other
    'Technical Writing', 'Project Management', 'QA Testing', 'Accessibility'
  ];
  
  // Available role options
  const roleOptions = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'Game Developer', 'UI/UX Designer',
    'Visual Designer', 'Project Manager', 'Technical Writer',
    'QA Tester', 'DevOps Engineer', 'Database Administrator',
    'Mentor/Coach', 'Content Creator', 'Community Manager'
  ];
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox group changes
  const handleCheckboxChange = (name, values) => {
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for submission
      const profileData = {
        // Personal info
        name: formData.name,
        email: formData.email,
        portfolio: formData.portfolio,
        githubProfile: formData.githubProfile,
        bio: formData.bio,
        
        // Skills and roles
        skills: formData.skills,
        roles: formData.roles,
        
        // Availability
        availability: {
          hoursPerWeek: formData.hoursPerWeek,
          preferredTimeZone: formData.preferredTimeZone,
          availableDays: formData.availableDays
        },
        
        // Questionnaire
        questionnaire: {
          experience: formData.experience,
          previousWork: formData.previousWork,
          interests: formData.interests,
          goals: formData.goals
        }
      };
      
      await onSubmit(profileData);
      
      toast({
        title: profile ? "Profile updated" : "Profile created",
        description: profile 
          ? "Your collaboration profile has been updated successfully."
          : "Your collaboration profile has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting collaboration profile:', error);
      toast({
        title: "Submission error",
        description: error.message || "An error occurred while submitting your profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit}
      maxW="900px"
      mx="auto"
    >
      <VStack spacing={designSystem.spacing[8]} align="stretch">
        {/* Personal Information */}
        <Box>
          <CustomText 
            size="xl" 
            color="brand" 
            fontWeight={designSystem.typography.weights.bold} 
            mb={designSystem.spacing[4]}
          >
            Personal Information
          </CustomText>
          
          <Grid 
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={designSystem.spacing[4]}
          >
            <FormControl isRequired>
              <FormLabel>
                <CustomText size="sm" color="muted">Name</CustomText>
              </FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>
                <CustomText size="sm" color="muted">Email</CustomText>
              </FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
              />
            </FormControl>
          </Grid>
          
          <Grid 
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={designSystem.spacing[4]}
            mt={designSystem.spacing[4]}
          >
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">Portfolio URL</CustomText>
              </FormLabel>
              <Input
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
              />
              <FormHelperText>
                <CustomText size="xs" color="muted">
                  Share your portfolio or personal website
                </CustomText>
              </FormHelperText>
            </FormControl>
            
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">GitHub Profile</CustomText>
              </FormLabel>
              <Input
                name="githubProfile"
                value={formData.githubProfile}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
              />
            </FormControl>
          </Grid>
          
          <FormControl mt={designSystem.spacing[4]}>
            <FormLabel>
              <CustomText size="sm" color="muted">Bio</CustomText>
            </FormLabel>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself, your background, and your interests..."
              bg={designSystem.colors.backgrounds.surface}
              border={`1px solid ${designSystem.colors.borders.default}`}
              color={designSystem.colors.text.primary}
              _hover={{ borderColor: designSystem.colors.brand.primary }}
              _focus={{ borderColor: designSystem.colors.brand.primary }}
              rows={4}
            />
          </FormControl>
        </Box>
        
        {/* Skills */}
        <Box>
          <CustomText 
            size="xl" 
            color="secondary" 
            fontWeight={designSystem.typography.weights.bold} 
            mb={designSystem.spacing[4]}
          >
            Skills & Expertise
          </CustomText>
          
          <FormControl>
            <FormLabel>
              <CustomText size="sm" color="muted">Select your skills</CustomText>
            </FormLabel>
            <CheckboxGroup
              value={formData.skills}
              onChange={(values) => handleCheckboxChange('skills', values)}
              colorScheme="green"
            >
              <Grid 
                templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
                gap={designSystem.spacing[2]}
              >
                {skillOptions.map((skill) => (
                  <Checkbox 
                    key={skill} 
                    value={skill}
                    colorScheme="green"
                  >
                    <CustomText size="sm" color="secondary">{skill}</CustomText>
                  </Checkbox>
                ))}
              </Grid>
            </CheckboxGroup>
          </FormControl>
          
          <FormControl mt={designSystem.spacing[6]}>
            <FormLabel>
              <CustomText size="sm" color="muted">Select your preferred roles</CustomText>
            </FormLabel>
            <CheckboxGroup
              value={formData.roles}
              onChange={(values) => handleCheckboxChange('roles', values)}
              colorScheme="purple"
            >
              <Grid 
                templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
                gap={designSystem.spacing[2]}
              >
                {roleOptions.map((role) => (
                  <Checkbox 
                    key={role} 
                    value={role}
                    colorScheme="purple"
                  >
                    <CustomText size="sm" color="secondary">{role}</CustomText>
                  </Checkbox>
                ))}
              </Grid>
            </CheckboxGroup>
          </FormControl>
        </Box>
        
        {/* Availability */}
        <Box>
          <CustomText 
            size="xl" 
            color="accent" 
            fontWeight={designSystem.typography.weights.bold} 
            mb={designSystem.spacing[4]}
          >
            Availability
          </CustomText>
          
          <Grid 
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={designSystem.spacing[4]}
          >
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">Hours per week</CustomText>
              </FormLabel>
              <Select
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
              >
                <option value="">Select hours per week</option>
                <option value="0-5">0-5 hours per week</option>
                <option value="5-10">5-10 hours per week</option>
                <option value="10-20">10-20 hours per week</option>
                <option value="20-30">20-30 hours per week</option>
                <option value="30+">30+ hours per week</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">Preferred time zone</CustomText>
              </FormLabel>
              <Select
                name="preferredTimeZone"
                value={formData.preferredTimeZone}
                onChange={handleChange}
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
              >
                <option value="">Select time zone</option>
                <option value="UTC-12:00">UTC-12:00</option>
                <option value="UTC-11:00">UTC-11:00</option>
                <option value="UTC-10:00">UTC-10:00</option>
                <option value="UTC-09:00">UTC-09:00</option>
                <option value="UTC-08:00">UTC-08:00 (PST)</option>
                <option value="UTC-07:00">UTC-07:00 (MST)</option>
                <option value="UTC-06:00">UTC-06:00 (CST)</option>
                <option value="UTC-05:00">UTC-05:00 (EST)</option>
                <option value="UTC-04:00">UTC-04:00</option>
                <option value="UTC-03:00">UTC-03:00</option>
                <option value="UTC-02:00">UTC-02:00</option>
                <option value="UTC-01:00">UTC-01:00</option>
                <option value="UTC+00:00">UTC+00:00</option>
                <option value="UTC+01:00">UTC+01:00</option>
                <option value="UTC+02:00">UTC+02:00</option>
                <option value="UTC+03:00">UTC+03:00</option>
                <option value="UTC+04:00">UTC+04:00</option>
                <option value="UTC+05:00">UTC+05:00</option>
                <option value="UTC+05:30">UTC+05:30 (IST)</option>
                <option value="UTC+06:00">UTC+06:00</option>
                <option value="UTC+07:00">UTC+07:00</option>
                <option value="UTC+08:00">UTC+08:00</option>
                <option value="UTC+09:00">UTC+09:00 (JST)</option>
                <option value="UTC+10:00">UTC+10:00</option>
                <option value="UTC+11:00">UTC+11:00</option>
                <option value="UTC+12:00">UTC+12:00</option>
              </Select>
            </FormControl>
          </Grid>
          
          <FormControl mt={designSystem.spacing[4]}>
            <FormLabel>
              <CustomText size="sm" color="muted">Available days</CustomText>
            </FormLabel>
            <CheckboxGroup
              value={formData.availableDays}
              onChange={(values) => handleCheckboxChange('availableDays', values)}
              colorScheme="blue"
            >
              <HStack spacing={designSystem.spacing[4]} flexWrap="wrap">
                <Checkbox value="weekdays">
                  <CustomText size="sm" color="secondary">Weekdays</CustomText>
                </Checkbox>
                <Checkbox value="weekends">
                  <CustomText size="sm" color="secondary">Weekends</CustomText>
                </Checkbox>
                <Checkbox value="flexible">
                  <CustomText size="sm" color="secondary">Flexible</CustomText>
                </Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>
        </Box>
        
        {/* Questionnaire */}
        <Box>
          <CustomText 
            size="xl" 
            color="error" 
            fontWeight={designSystem.typography.weights.bold} 
            mb={designSystem.spacing[4]}
          >
            Collaboration Questionnaire
          </CustomText>
          
          <VStack spacing={designSystem.spacing[4]} align="stretch">
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">How would you describe your experience level?</CustomText>
              </FormLabel>
              <Select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="experienced">Experienced (3-5 years)</option>
                <option value="advanced">Advanced (5-8 years)</option>
                <option value="expert">Expert (8+ years)</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">Tell us about your previous collaboration experience</CustomText>
              </FormLabel>
              <Textarea
                name="previousWork"
                value={formData.previousWork}
                onChange={handleChange}
                placeholder="Describe your experience working in teams or on collaborative projects..."
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
                rows={3}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">What types of projects interest you most?</CustomText>
              </FormLabel>
              <Textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="What kinds of projects are you passionate about working on?"
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
                rows={3}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>
                <CustomText size="sm" color="muted">What do you hope to gain from collaborating?</CustomText>
              </FormLabel>
              <Textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="Describe your goals and what you hope to learn or achieve..."
                bg={designSystem.colors.backgrounds.surface}
                border={`1px solid ${designSystem.colors.borders.default}`}
                color={designSystem.colors.text.primary}
                _hover={{ borderColor: designSystem.colors.brand.primary }}
                _focus={{ borderColor: designSystem.colors.brand.primary }}
                rows={3}
              />
            </FormControl>
          </VStack>
        </Box>
        
        {/* Submit Button */}
        <HStack justify="flex-end" spacing={designSystem.spacing[3]}>
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Submitting"
            disabled={isSubmitting || !formData.name || !formData.email}
          >
            {profile ? "Update Profile" : "Create Profile"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};