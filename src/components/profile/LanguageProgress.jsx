import React from 'react';
import {
  Card,
  Stack,
  SectionTitle,
  BodyText,
  Caption,
  StatusBadge,
  ProgressBar
} from '../../design/components/StandardizedComponents';

export function LanguageProgress({ languageProgress }) {
  function getLanguageColor(language) {
    const colors = {
      javascript: '#F7DF1E',
      typescript: '#3178C6',
      python: '#3776AB',
      java: '#ED8B00',
      csharp: '#239120',
      php: '#777BB4'
    };
    return colors[language] || '#00ff00';
  }

  const progressData = Object.entries(languageProgress || {}).map(([lang, data]) => ({
    language: lang,
    level: data?.level ?? 1,
    xp: data?.xp ?? 0,
    color: getLanguageColor(lang)
  }));

  // If no language progress data, show placeholder
  if (progressData.length === 0) {
    return (
      <Card animated>
        <SectionTitle>
          📊 Language Progress
        </SectionTitle>
        <Stack>
          <BodyText textAlign="center">
            Start coding challenges to track language progress!
          </BodyText>
        </Stack>
      </Card>
    );
  }
  return (
    <Card animated>
      <SectionTitle>
        📊 Language Progress
      </SectionTitle>
      <Stack>
        {progressData.map((lang, index) => (
          <Stack key={lang.language}>
            <Stack horizontal>
              <Stack horizontal flex={1}>
                <BodyText fontWeight="bold">
                  {lang.language.toUpperCase()}
                </BodyText>
                <StatusBadge 
                  style={{ backgroundColor: lang.color, color: '#000' }}
                >
                  Level {lang.level}
                </StatusBadge>
              </Stack>
              <Caption>
                {Math.min(((lang.xp ?? 0) / ((lang.level ?? 1) * 50)) * 100, 100).toFixed(0)}% Complete
              </Caption>
            </Stack>
            <ProgressBar 
              value={Math.min(((lang.xp ?? 0) / ((lang.level ?? 1) * 50)) * 100, 100)}
              animated
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}