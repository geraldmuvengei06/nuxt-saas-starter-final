-- Supabase Auth ↔ Profiles Synchronization Triggers
-- Run this script in the Supabase SQL Editor to enable automatic synchronization
-- between auth.users and profiles tables

-- Step 1: Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new profile with data from auth.users and user_metadata
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url,
    role,
    email_verified,
    phone_verified,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    'USER', -- Default role
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END,
    CASE WHEN NEW.phone_confirmed_at IS NOT NULL THEN true ELSE false END,
    NEW.last_sign_in_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    email_verified = EXCLUDED.email_verified,
    phone_verified = EXCLUDED.phone_verified,
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    updated_at = NOW();

  -- Log the sync operation
  INSERT INTO public.sync_logs (
    id,
    operation,
    user_id,
    status,
    details,
    created_at
  )
  VALUES (
    gen_random_uuid()::text,
    'profile_created_by_trigger',
    NEW.id,
    'success',
    jsonb_build_object(
      'trigger', 'handle_new_user',
      'email', NEW.email,
      'metadata', NEW.raw_user_meta_data
    ),
    NOW()
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error
  INSERT INTO public.sync_logs (
    id,
    operation,
    user_id,
    status,
    details,
    created_at
  )
  VALUES (
    gen_random_uuid()::text,
    'profile_created_by_trigger',
    NEW.id,
    'error',
    jsonb_build_object(
      'trigger', 'handle_new_user',
      'error', SQLERRM,
      'email', NEW.email
    ),
    NOW()
  );
  
  -- Return NEW to not block the auth user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile when auth user data changes
  UPDATE public.profiles SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', profiles.full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', profiles.avatar_url),
    email_verified = CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN true ELSE false END,
    phone_verified = CASE WHEN NEW.phone_confirmed_at IS NOT NULL THEN true ELSE false END,
    last_sign_in_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;

  -- Log the sync operation
  INSERT INTO public.sync_logs (
    id,
    operation,
    user_id,
    status,
    details,
    created_at
  )
  VALUES (
    gen_random_uuid()::text,
    'profile_updated_by_trigger',
    NEW.id,
    'success',
    jsonb_build_object(
      'trigger', 'handle_user_update',
      'changes', jsonb_build_object(
        'email_changed', OLD.email != NEW.email,
        'metadata_changed', OLD.raw_user_meta_data != NEW.raw_user_meta_data,
        'confirmed_changed', OLD.email_confirmed_at != NEW.email_confirmed_at
      )
    ),
    NOW()
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error
  INSERT INTO public.sync_logs (
    id,
    operation,
    user_id,
    status,
    details,
    created_at
  )
  VALUES (
    gen_random_uuid()::text,
    'profile_updated_by_trigger',
    NEW.id,
    'error',
    jsonb_build_object(
      'trigger', 'handle_user_update',
      'error', SQLERRM
    ),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the user deletion before it happens
  INSERT INTO public.activity_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    description,
    created_at
  )
  VALUES (
    OLD.id,
    'user_deleted_by_trigger',
    'user',
    OLD.id::text,
    'User account permanently deleted via auth trigger',
    NOW()
  );

  -- Log the sync operation
  INSERT INTO public.sync_logs (
    id,
    operation,
    user_id,
    status,
    details,
    created_at
  )
  VALUES (
    gen_random_uuid()::text,
    'user_deleted_by_trigger',
    OLD.id,
    'success',
    jsonb_build_object(
      'trigger', 'handle_user_delete',
      'email', OLD.email
    ),
    NOW()
  );

  RETURN OLD;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't block deletion
  INSERT INTO public.sync_logs (
    id,
    operation,
    user_id,
    status,
    details,
    created_at
  )
  VALUES (
    gen_random_uuid()::text,
    'user_deleted_by_trigger',
    OLD.id,
    'error',
    jsonb_build_object(
      'trigger', 'handle_user_delete',
      'error', SQLERRM
    ),
    NOW()
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Step 5: Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Step 6: Enable RLS policies for sync_logs table
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for sync_logs (only accessible by service role or super admins)
CREATE POLICY "sync_logs_policy" ON public.sync_logs
  FOR ALL
  USING (
    -- Allow service role to access all logs
    auth.role() = 'service_role'
    OR
    -- Allow super admins to access all logs
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'SUPER_ADMIN'
    )
  );

-- Step 7: Create manual sync function for backfilling existing users
CREATE OR REPLACE FUNCTION public.manual_sync_all_users()
RETURNS TABLE(
  total_users bigint,
  synced_users bigint,
  errors bigint
) AS $$
DECLARE
  user_record RECORD;
  sync_count bigint := 0;
  error_count bigint := 0;
  total_count bigint := 0;
BEGIN
  -- Count total users
  SELECT COUNT(*) INTO total_count FROM auth.users;
  
  -- Loop through all auth users and sync their profiles
  FOR user_record IN 
    SELECT * FROM auth.users
  LOOP
    BEGIN
      -- Try to insert or update the profile
      INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url,
        role,
        email_verified,
        phone_verified,
        last_sign_in_at,
        created_at,
        updated_at
      )
      VALUES (
        user_record.id,
        user_record.email,
        COALESCE(user_record.raw_user_meta_data->>'full_name', user_record.raw_user_meta_data->>'name'),
        COALESCE(user_record.raw_user_meta_data->>'avatar_url', user_record.raw_user_meta_data->>'picture'),
        'USER',
        CASE WHEN user_record.email_confirmed_at IS NOT NULL THEN true ELSE false END,
        CASE WHEN user_record.phone_confirmed_at IS NOT NULL THEN true ELSE false END,
        user_record.last_sign_in_at,
        user_record.created_at,
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        email_verified = EXCLUDED.email_verified,
        phone_verified = EXCLUDED.phone_verified,
        last_sign_in_at = EXCLUDED.last_sign_in_at,
        updated_at = NOW();
      
      sync_count := sync_count + 1;
      
      -- Log successful sync
      INSERT INTO public.sync_logs (
        id,
        operation,
        user_id,
        status,
        details,
        created_at
      )
      VALUES (
        gen_random_uuid()::text,
        'manual_bulk_sync',
        user_record.id,
        'success',
        jsonb_build_object('manual_sync', true),
        NOW()
      );
      
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
      
      -- Log error
      INSERT INTO public.sync_logs (
        id,
        operation,
        user_id,
        status,
        details,
        created_at
      )
      VALUES (
        gen_random_uuid()::text,
        'manual_bulk_sync',
        user_record.id,
        'error',
        jsonb_build_object(
          'manual_sync', true,
          'error', SQLERRM
        ),
        NOW()
      );
    END;
  END LOOP;
  
  RETURN QUERY SELECT total_count, sync_count, error_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Grant necessary permissions
-- Note: These grants may need to be adjusted based on your Supabase setup
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.sync_logs TO authenticated;
GRANT EXECUTE ON FUNCTION public.manual_sync_all_users() TO service_role;

-- Completion message
DO $$
BEGIN
  RAISE NOTICE 'Supabase Auth ↔ Profiles synchronization triggers have been successfully installed!';
  RAISE NOTICE 'The following triggers are now active:';
  RAISE NOTICE '- on_auth_user_created: Creates profile when user registers';
  RAISE NOTICE '- on_auth_user_updated: Updates profile when auth user changes';
  RAISE NOTICE '- on_auth_user_deleted: Logs deletion before user is removed';
  RAISE NOTICE '';
  RAISE NOTICE 'To sync existing users, run: SELECT * FROM public.manual_sync_all_users();';
  RAISE NOTICE 'To monitor sync operations, query: SELECT * FROM public.sync_logs ORDER BY created_at DESC;';
END $$;
