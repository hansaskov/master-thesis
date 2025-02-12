-- Custom SQL migration file, put your code below! --
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'system_models_enum') THEN
        CREATE TYPE system_models_enum AS ENUM (
            'VisioPointer',
            'VisioCompact',
            'VisioLine',
            'SmartInspector',
            '360 Inspector',
            'VisioOne',
            'IML-Inspector'
        );
    END IF;
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
    (generate_random_string(12), 'VisioPointer'::system_models_enum),
    (generate_random_string(12), 'VisioCompact'::system_models_enum),
    (generate_random_string(12), 'VisioLine'::system_models_enum),
    (generate_random_string(12), 'SmartInspector'::system_models_enum),
    (generate_random_string(12), '360 Inspector'::system_models_enum),
    (generate_random_string(12), 'VisioOne'::system_models_enum),
    (generate_random_string(12), 'IML-Inspector'::system_models_enum)
ON CONFLICT (id) DO NOTHING;

-- Clean up the function
DROP FUNCTION IF EXISTS generate_random_string(INTEGER);