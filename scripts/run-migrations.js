import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import crypto from 'crypto';

// Load Supabase environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is not set in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrationsDir = path.resolve(process.cwd(), 'supabase/migrations');

// Calculate MD5 hash of file content
function calculateChecksum(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Calculate MD5 hash of file content
function calculateChecksum(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

    // Check if the schema_migrations table exists by trying to query it directly
    const { data: tablesData, error: tablesError } = await supabase
      .from('schema_migrations')
      .select('version')
      .limit(1);

    // If schema_migrations table doesn't exist, we need to run the initial migration
    if (tablesError && tablesError.message.includes('relation "public.schema_migrations" does not exist')) {
      console.log('Schema migrations table not found. Running initial migration setup...');
      
      // Find the migration tracking system file
      const files = await fs.readdir(migrationsDir);
      const trackingFile = files.find(file => file.includes('migration_tracking_system') || file.includes('schema_migrations'));
      
      if (!trackingFile) {
        console.error('Migration tracking system file not found!');
        process.exit(1);
      }
      
      // Apply the tracking system migration directly
      const trackingFilePath = path.join(migrationsDir, trackingFile);
      const trackingSql = await fs.readFile(trackingFilePath, 'utf8');
      
      const { data: setupResult, error: setupError } = await supabase.rpc('execute_sql_query', { query: trackingSql });
      
      if (setupError) {
        // If we got an error, it might be because the function doesn't exist yet
        // In that case, we need to find another way to execute the SQL
        console.log('Could not execute tracking setup via RPC. Attempting direct SQL...');
        
        // Try executing via SQL API (if available)
        const { error: directError } = await supabase.auth.admin.executeRaw(trackingSql);
        
        if (directError) {
        // If we got an error, it might be because the function doesn't exist yet
        // In that case, we need to find another way to execute the SQL
        console.log('Could not execute tracking setup via RPC. Attempting direct SQL...');
        
        // Try executing via SQL API (if available)
        const { error: directError } = await supabase.auth.admin.executeRaw(trackingSql);
        
        if (directError) {
          console.error('Failed to initialize migration tracking system:', directError.message);
          console.error('Please execute the migration_tracking_system.sql file manually in the Supabase SQL editor.');
          process.exit(1);
        }
        }
      }
      
      console.log('Migration tracking system initialized successfully!');
    }

    // Fetch already applied migrations
    const { data: appliedMigrations, error: fetchError } = await supabase
      .from('schema_migrations')
      .select('version, checksum');

    if (fetchError) {
      console.error('Error fetching applied migrations:', fetchError.message);
      process.exit(1);
    }

    const appliedVersionsMap = new Map();
    appliedMigrations?.forEach(m => appliedVersionsMap.set(m.version, m.checksum));
    appliedMigrations?.forEach(m => appliedVersionsMap.set(m.version, m.checksum));

    // Read migration files
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in order by filename

    console.log(`Found ${migrationFiles.length} migration files`);
    
    let appliedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    console.log(`Found ${migrationFiles.length} migration files`);
    
    let appliedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const file of migrationFiles) {
      // Skip the tracking system file if it was just applied
      if (file.includes('migration_tracking_system') && !appliedVersionsMap.has(file)) {
        appliedVersionsMap.set(file, ''); // Mark as processed
        console.log(`Skipping tracking system file: ${file} (already initialized)`);
        skippedCount++;
        continue;
      }
      
      if (appliedVersionsMap.has(file)) {
      if (file.includes('migration_tracking_system') && !appliedVersionsMap.has(file)) {
        appliedVersionsMap.set(file, ''); // Mark as processed
        console.log(`Skipping tracking system file: ${file} (already initialized)`);
        skippedCount++;
        continue;
      }
      
      if (appliedVersionsMap.has(file)) {
        console.log(`Migration already applied: ${file}`);
        skippedCount++;
        skippedCount++;
        continue;
      }

      console.log(`Processing migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');
      const checksum = calculateChecksum(sql);
      const checksum = calculateChecksum(sql);

      // Apply migration using the apply_migration function
      const { data: result, error: migrationError } = await supabase
        .rpc('apply_migration', {
          migration_name: file,
          migration_sql: sql
        });

      if (migrationError) {
        console.error(`Error applying migration ${file}:`, migrationError.message);
        
        // Attempt to apply via execute_sql_query as fallback
        console.log(`Attempting to apply ${file} via execute_sql_query...`);
        const { error: executeError } = await supabase
          .rpc('execute_sql_query', { query: sql });
          
        if (executeError) {
          console.error(`Failed to apply ${file} via execute_sql_query:`, executeError.message);
          errorCount++;
          // Skip to the next migration instead of stopping completely
          continue;
        }
        
        // Manually record the migration since we bypassed apply_migration
        const { error: recordError } = await supabase
          .from('schema_migrations')
          .insert([{ 
            version: file, 
            checksum: checksum,
            description: 'Applied via execute_sql_query fallback' 
          }]);
          
        if (recordError) {
          console.error(`Error recording migration ${file}:`, recordError.message);
          // Continue anyway
        }
        
        console.log(`Successfully applied ${file} via fallback method`);
        appliedCount++;
      } else {
      // Apply migration using the apply_migration function
      const { data: result, error: migrationError } = await supabase
        .rpc('apply_migration', {
          migration_name: file,
          migration_sql: sql
        });
          appliedCount++;
    }
      if (migrationError) {
        console.error(`Error applying migration ${file}:`, migrationError.message);
        
        // These are common errors that we can safely ignore and continue
        const nonFatalErrors = [
          "already exists",
          "duplicate key",
          "invalid input syntax for type uuid", // Handle UUID issues
          "relation",
          "does not exist"
        ];
        
        // Check if it's a non-fatal error
        const isNonFatal = nonFatalErrors.some(errMsg => migrationError.message.includes(errMsg));
        
        if (!isNonFatal) {
          // Stop on fatal errors
          console.error('This appears to be a fatal error. Migration aborted.');
          process.exit(1);
        }
        
        // For non-fatal errors, just increment the error count and continue
        errorCount++;
        console.log(`This is a non-fatal error. Continuing with next migration.`);
        continue;
      } else {
        if (result && result.success) {
          console.log(`Successfully applied: ${file} - ${result.message}`);
          appliedCount++;
        } else {
          console.error(`Error applying ${file}: ${result ? result.message : 'Unknown error'}`);
          errorCount++;
        }
    if (errorCount > 0) {
    }

    console.log(`
Migration Summary:
  Total files: ${migrationFiles.length}
  Applied: ${appliedCount}
  Skipped (already applied): ${skippedCount}
  Errors: ${errorCount}
    `);

    if (errorCount > 0) {
      console.warn('Some migrations had errors. Please check the logs and resolve manually if needed.');
      // Don't exit with error code, so the server can still start
    } else {
      console.log('All migrations checked and applied successfully.');
    }
  } catch (error) {
    console.error('An unexpected error occurred during migrations:', error.message);
    console.error(error.stack);
    console.error(error.stack);
    // Don't exit with error code, so the server can still start
  }
}

// Execute migrations
runMigrations().catch(err => {
  console.error('Unhandled error in migration script:', err);
  // Don't exit with error code, so the server can still start
});
  console.error('Unhandled error in migration script:', err);
  process.exit(1);
});