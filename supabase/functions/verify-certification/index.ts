// Supabase Edge Function for Certificate Verification
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get verification hash from URL or request body
    const url = new URL(req.url)
    let verificationHash = url.searchParams.get('hash')
    
    if (!verificationHash && req.method === 'POST') {
      const body = await req.json()
      verificationHash = body.hash
    }

    if (!verificationHash) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Verification hash is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Query certification with related data
    const { data: certification, error } = await supabaseClient
      .from('certifications')
      .select(`
        *,
        certification_types (
          title,
          description,
          validity_months
        ),
        user_profiles!inner (
          user_id,
          overall_level,
          total_xp,
          best_wpm,
          best_accuracy,
          total_challenges_completed,
          total_lessons_completed,
          community_contributions,
          mentorship_hours
        )
      `)
      .eq('verification_hash', verificationHash)
      .eq('status', 'active')
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Certificate not found or invalid' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if certificate is expired
    const isExpired = certification.expires_at ? 
      new Date(certification.expires_at) < new Date() : false

    // Prepare verification response
    const verificationResult = {
      valid: true,
      certificate: {
        certificateNumber: certification.certificate_number,
        type: certification.certification_types.title,
        description: certification.certification_types.description,
        issuedAt: certification.issued_at,
        expiresAt: certification.expires_at,
        isExpired: isExpired,
        status: certification.status
      },
      qualifications: {
        level: certification.user_profiles.overall_level,
        totalXP: certification.user_profiles.total_xp,
        challengesCompleted: certification.user_profiles.total_challenges_completed,
        lessonsCompleted: certification.user_profiles.total_lessons_completed,
        bestWPM: certification.user_profiles.best_wpm,
        bestAccuracy: certification.user_profiles.best_accuracy,
        communityContributions: certification.user_profiles.community_contributions,
        mentorshipHours: certification.user_profiles.mentorship_hours
      },
      verifiedAt: new Date().toISOString(),
      platform: 'Terminal IDE Learning Platform'
    }

    return new Response(
      JSON.stringify(verificationResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Verification error:', error)
    
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: 'Internal server error during verification' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})