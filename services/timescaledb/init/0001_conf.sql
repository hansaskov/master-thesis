ALTER SYSTEM SET archive_command = 'pgbackrest archive-push %p';
ALTER SYSTEM SET archive_mode = 'on';
ALTER SYSTEM SET max_wal_senders = '3';
ALTER SYSTEM SET wal_level = 'replica';