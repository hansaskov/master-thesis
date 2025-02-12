-- First, ensure the enum type exists
DO $$ BEGIN
    CREATE TYPE system_models_enum AS ENUM (
        'VisioPointer',
        'VisioCompact',
        'VisioLine',
        'SmartInspector',
        '360 Inspector',
        'VisioOne',
        'IML-Inspector'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Function to generate random string of specified length
CREATE OR REPLACE FUNCTION generate_random_string(length INTEGER) RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert the system models
INSERT INTO system_models (id, name)
VALUES 
    (generate_random_string(12), 'VisioPointer'),
    (generate_random_string(12), 'VisioCompact'),
    (generate_random_string(12), 'VisioLine'),
    (generate_random_string(12), 'SmartInspector'),
    (generate_random_string(12), '360 Inspector'),
    (generate_random_string(12), 'VisioOne'),
    (generate_random_string(12), 'IML-Inspector')
ON CONFLICT (id) DO NOTHING;

-- Clean up the function if you don't need it anymore
DROP FUNCTION generate_random_string(INTEGER);