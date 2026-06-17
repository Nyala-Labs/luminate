-- Deploy this script in the Supabase SQL Editor (Dashboard > SQL Editor).
-- It syncs Google OAuth logins with the public.users table.
-- 1. Fires AFTER INSERT OR UPDATE on auth.users (Supabase's internal auth schema).
-- 2. Looks up the email in public.users.
-- 3. If found and status is PENDING → flips to ACTIVE, updates last_signed_in, syncs profile data.
-- 4. If found and status is REVOKED → deletes the auth user (prevents login).
-- 5. If not found → optionally creates a new user record.

-- NOTE: All camelCase column names are quoted ("profilePic", "last_signed_in") because
-- Drizzle preserves their exact case in PostgreSQL. Unquoted identifiers are folded to
-- lowercase by PostgreSQL which would cause "record has no field" errors.

CREATE OR REPLACE FUNCTION public.handle_auth_user_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user public.users%ROWTYPE;
  v_raw_user_meta JSONB;
BEGIN
  v_raw_user_meta := NEW.raw_user_meta_data;

  -- Look up the custom user record by email
  SELECT * INTO v_user FROM public.users WHERE email = NEW.email LIMIT 1;

  IF FOUND THEN
    -- REVOKED: block login by deleting the Supabase auth identity
    IF v_user.status = 'REVOKED' THEN
      DELETE FROM auth.users WHERE id = NEW.id;
      RETURN NULL;
    END IF;

    -- ACTIVE or PENDING: update profile and flip status
    UPDATE public.users
    SET
      "last_signed_in" = NOW(),
      status = CASE WHEN v_user.status = 'PENDING' THEN 'ACTIVE' ELSE v_user.status END,
      firstname = COALESCE(v_user.firstname, v_raw_user_meta ->> 'given_name'),
      lastname  = COALESCE(v_user.lastname, v_raw_user_meta ->> 'family_name'),
      "profilePic" = COALESCE(v_user."profilePic", v_raw_user_meta ->> 'picture')
    WHERE id = v_user.id;
  ELSE
    -- No user record exists -> optionally create one (auto-provision)
    INSERT INTO public.users (email, firstname, lastname, "profilePic", status, "last_signed_in")
    VALUES (
      NEW.email,
      v_raw_user_meta ->> 'given_name',
      v_raw_user_meta ->> 'family_name',
      v_raw_user_meta ->> 'picture',
      'ACTIVE',
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_login();
