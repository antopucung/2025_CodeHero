import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'collaboration_system_data';

export const useCollaborationSystem = () => {
  const [collaborationRequests, setCollaborationRequests] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : [];
  });

  const [userCollaborations, setUserCollaborations] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfiles, setUserProfiles] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profiles`);
    return saved ? JSON.parse(saved) : [];
  });

  const [projectCollaborations, setProjectCollaborations] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : [];
  });

  // Save state to local storage on change
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(collaborationRequests));
  }, [collaborationRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(userCollaborations));
  }, [userCollaborations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profiles`, JSON.stringify(userProfiles));
  }, [userProfiles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projectCollaborations));
  }, [projectCollaborations]);

  // Create a collaboration profile
  const createCollaborationProfile = async (profileData) => {
    try {
      const { userId, skills, roles, portfolio, availability, questionnaire } = profileData;
      
      const newProfile = {
        id: Date.now().toString(),
        userId: userId || 'current_user',
        skills: skills || [],
        roles: roles || [],
        portfolio: portfolio || '',
        availability: availability || {},
        questionnaire: questionnaire || {},
        rating: 5.0, // Default rating
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUserProfiles(prev => [...prev, newProfile]);
      
      return { success: true, profile: newProfile };
    } catch (error) {
      console.error('Error creating collaboration profile:', error);
      return { success: false, error: error.message };
    }
  };

  // Update a collaboration profile
  const updateCollaborationProfile = async (userId, profileData) => {
    try {
      setUserProfiles(prev => prev.map(profile => 
        profile.userId === userId ? {
          ...profile,
          ...profileData,
          updatedAt: new Date().toISOString()
        } : profile
      ));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating collaboration profile:', error);
      return { success: false, error: error.message };
    }
  };

  // Get a collaboration profile
  const getCollaborationProfile = (userId = 'current_user') => {
    return userProfiles.find(profile => profile.userId === userId) || null;
  };

  // Create a collaboration request
  const createCollaborationRequest = async (requestData) => {
    try {
      const { projectId, userId, message, role } = requestData;
      
      const newRequest = {
        id: Date.now().toString(),
        projectId,
        userId: userId || 'current_user',
        message: message || '',
        role: role || 'contributor',
        status: 'pending', // pending, approved, rejected
        createdAt: new Date().toISOString()
      };
      
      setCollaborationRequests(prev => [...prev, newRequest]);
      
      return { success: true, request: newRequest };
    } catch (error) {
      console.error('Error creating collaboration request:', error);
      return { success: false, error: error.message };
    }
  };

  // Update a collaboration request
  const updateCollaborationRequest = async (requestId, updateData) => {
    try {
      setCollaborationRequests(prev => prev.map(request => 
        request.id === requestId ? {
          ...request,
          ...updateData,
          updatedAt: new Date().toISOString()
        } : request
      ));
      
      // If request was approved, create a project collaboration
      const updatedRequest = collaborationRequests.find(r => r.id === requestId);
      if (updatedRequest && updateData.status === 'approved') {
        await createProjectCollaboration({
          projectId: updatedRequest.projectId,
          userId: updatedRequest.userId,
          role: updatedRequest.role
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating collaboration request:', error);
      return { success: false, error: error.message };
    }
  };

  // Create a project collaboration
  const createProjectCollaboration = async (collaborationData) => {
    try {
      const { projectId, userId, role } = collaborationData;
      
      const newCollaboration = {
        id: Date.now().toString(),
        projectId,
        userId: userId || 'current_user',
        role: role || 'contributor',
        status: 'active', // active, completed, removed
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProjectCollaborations(prev => [...prev, newCollaboration]);
      setUserCollaborations(prev => [...prev, newCollaboration]);
      
      return { success: true, collaboration: newCollaboration };
    } catch (error) {
      console.error('Error creating project collaboration:', error);
      return { success: false, error: error.message };
    }
  };

  // Find collaborators for a project
  const findCollaborators = async (criteria) => {
    try {
      const { skills, roles, projectId } = criteria;
      
      // Filter profiles based on criteria
      let matchedProfiles = [...userProfiles];
      
      // Filter by skills if provided
      if (skills && skills.length > 0) {
        matchedProfiles = matchedProfiles.filter(profile => 
          profile.skills.some(skill => skills.includes(skill))
        );
      }
      
      // Filter by roles if provided
      if (roles && roles.length > 0) {
        matchedProfiles = matchedProfiles.filter(profile => 
          profile.roles.some(role => roles.includes(role))
        );
      }
      
      // Sort by matching skills count (descending)
      if (skills && skills.length > 0) {
        matchedProfiles.sort((a, b) => {
          const aMatches = a.skills.filter(skill => skills.includes(skill)).length;
          const bMatches = b.skills.filter(skill => skills.includes(skill)).length;
          return bMatches - aMatches;
        });
      }
      
      return { success: true, profiles: matchedProfiles };
    } catch (error) {
      console.error('Error finding collaborators:', error);
      return { success: false, error: error.message };
    }
  };

  // Get project collaborations
  const getProjectCollaborations = (projectId) => {
    // Get all collaborations for this project
    const collaborations = projectCollaborations.filter(c => c.projectId === projectId);
    
    // Get collaborator profiles
    const collaborators = collaborations.map(collab => {
      const profile = userProfiles.find(p => p.userId === collab.userId);
      return { collaboration: collab, profile };
    });
    
    return collaborators;
  };

  // Get user collaborations
  const getUserCollaborations = (userId = 'current_user') => {
    // Get all collaborations for this user
    const collaborations = userCollaborations.filter(c => c.userId === userId);
    
    return collaborations;
  };

  // Get collaboration requests for a project
  const getCollaborationRequests = (projectId) => {
    return collaborationRequests.filter(r => r.projectId === projectId);
  };

  // Get collaboration requests by a user
  const getUserCollaborationRequests = (userId = 'current_user') => {
    return collaborationRequests.filter(r => r.userId === userId);
  };

  // Check if user has collaboration profile
  const hasCollaborationProfile = (userId = 'current_user') => {
    return userProfiles.some(profile => profile.userId === userId);
  };

  // Check if user is collaborating on a project
  const isCollaboratingOnProject = (userId = 'current_user', projectId) => {
    return projectCollaborations.some(
      c => c.userId === userId && c.projectId === projectId && c.status === 'active'
    );
  };

  return {
    createCollaborationProfile,
    updateCollaborationProfile,
    getCollaborationProfile,
    createCollaborationRequest,
    updateCollaborationRequest,
    createProjectCollaboration,
    findCollaborators,
    getProjectCollaborations,
    getUserCollaborations,
    getCollaborationRequests,
    getUserCollaborationRequests,
    hasCollaborationProfile,
    isCollaboratingOnProject
  };
};