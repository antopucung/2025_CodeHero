import React from 'react';
import {
  Card,
  Stack,
  Grid,
  SectionTitle,
  BodyText,
  CourseCard,
  StandardButton
} from '../../design/components/StandardizedComponents';

export function EnrolledCourses({ enrolledCourses, onNavigateToMarketplace, onNavigateToCourse }) {
  // Ensure enrolledCourses is always an array
  const safeCourses = Array.isArray(enrolledCourses) ? enrolledCourses : [];
  
  return (
    <Card animated>
      <Stack horizontal>
        <SectionTitle flex={1}>
          📚 My Courses
        </SectionTitle>
        <StandardButton 
          variant="primary" 
          animated
          onClick={onNavigateToMarketplace}
        >
          + Browse More
        </StandardButton>
      </Stack>
      
      {safeCourses.length > 0 ? (
        <Stack>
          {safeCourses.slice(0, 3).map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              animated
              onNavigate={(course) => onNavigateToCourse?.(course.slug)}
            />
          ))}
          
          {safeCourses.length > 3 && (
            <BodyText textAlign="center">
              +{safeCourses.length - 3} more courses
            </BodyText>
          )}
        </Stack>
      ) : (
        <Stack>
          <BodyText textAlign="center">📚</BodyText>
          <BodyText textAlign="center">No courses enrolled yet</BodyText>
          <Stack horizontal justify="center">
            <StandardButton 
              variant="primary" 
              animated
              onClick={() => onNavigateToMarketplace && onNavigateToMarketplace()}
            >
              Explore Marketplace
            </StandardButton>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}