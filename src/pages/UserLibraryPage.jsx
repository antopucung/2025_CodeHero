import React from 'react';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { UserAssetLibrary } from '../components/marketplace/user/UserAssetLibrary';
import { useProgressionSystem } from '../hooks/useProgressionSystem';
import { useDigitalAssets } from '../hooks/useDigitalAssets';

const UserLibraryPage = () => {
  const { profile } = useProgressionSystem();
  const { userPurchasedAssets, getUserAssetStats } = useDigitalAssets();
  
  const assetStats = getUserAssetStats();
  
  // Prepare stats for header
  const stats = [
    { value: userPurchasedAssets.length, label: 'ASSETS OWNED' },
    { value: assetStats.totalDownloads, label: 'DOWNLOADS' },
    { value: `$${assetStats.totalSpent.toFixed(2)}`, label: 'TOTAL SPENT' },
    { value: profile?.level || 1, label: 'LEVEL' }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="📚 My Asset Library"
        subtitle="Your Collection of Digital Assets"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        <UserAssetLibrary />
      </SectionLayout>
    </PageLayout>
  );
};

export default UserLibraryPage;