-- Step 1: Create the new enum type
CREATE TYPE "public"."users_to_provider_roles" AS ENUM('Admin', 'User');

-- Step 2: Update the "role" column in the "users_to_organizations" table
ALTER TABLE "users_to_organizations" 
ALTER COLUMN "role" SET DATA TYPE users_to_provider_roles
USING role::users_to_provider_roles;
