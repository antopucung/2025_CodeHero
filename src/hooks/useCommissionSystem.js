import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'commission_data';

export const useCommissionSystem = () => {
  const [commissions, setCommissions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('commission_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('creator_profile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem('commission_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('creator_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const createCommission = async (commissionData) => {
    const newCommission = {
      id: Date.now().toString(),
      ...commissionData,
      status: 'open',
      applications: 0,
      createdAt: new Date().toISOString(),
      clientId: 'current_user' // In real app, this would be the authenticated user ID
    };

    setCommissions(prev => [newCommission, ...prev]);
    return newCommission;
  };

  const applyToCommission = async (commissionId, applicationData) => {
    const application = {
      id: Date.now().toString(),
      commissionId,
      ...applicationData,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      creatorId: 'current_user' // In real app, this would be the authenticated user ID
    };

    setApplications(prev => [application, ...prev]);
    
    // Update commission application count
    setCommissions(prev => prev.map(commission => 
      commission.id === commissionId 
        ? { ...commission, applications: commission.applications + 1 }
        : commission
    ));

    return application;
  };

  const updateCommissionStatus = async (commissionId, status) => {
    setCommissions(prev => prev.map(commission => 
      commission.id === commissionId 
        ? { ...commission, status }
        : commission
    ));
  };

  const updateApplicationStatus = async (applicationId, status) => {
    setApplications(prev => prev.map(application => 
      application.id === applicationId 
        ? { ...application, status }
        : application
    ));
  };

  const getCommissionsByStatus = (status) => {
    return commissions.filter(commission => commission.status === status);
  };

  const getApplicationsByCommission = (commissionId) => {
    return applications.filter(app => app.commissionId === commissionId);
  };

  const getUserApplications = () => {
    return applications.filter(app => app.creatorId === 'current_user');
  };

  const createCreatorProfile = async (profileData) => {
    const profile = {
      id: 'current_user',
      ...profileData,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      completedProjects: 0,
      totalEarnings: 0
    };

    setUserProfile(profile);
    return profile;
  };

  const updateCreatorProfile = async (updates) => {
    if (userProfile) {
      setUserProfile(prev => ({ ...prev, ...updates }));
    }
  };

  const getCommissionStats = () => {
    const totalCommissions = commissions.length;
    const openCommissions = commissions.filter(c => c.status === 'open').length;
    const totalBudget = commissions.reduce((sum, c) => sum + (c.budget?.max || 0), 0);
    const avgBudget = totalCommissions > 0 ? totalBudget / totalCommissions : 0;

    return {
      totalCommissions,
      openCommissions,
      totalBudget,
      avgBudget,
      totalApplications: applications.length
    };
  };

  return {
    commissions,
    applications,
    userProfile,
    createCommission,
    applyToCommission,
    updateCommissionStatus,
    updateApplicationStatus,
    getCommissionsByStatus,
    getApplicationsByCommission,
    getUserApplications,
    createCreatorProfile,
    updateCreatorProfile,
    getCommissionStats
  };
};