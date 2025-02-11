-- Custom SQL migration file, put you code below! --

-- Convert regular table to hypertable with multi-column partitioning
SELECT create_hypertable('readings', 'time', if_not_exists => TRUE);
SELECT add_dimension('readings', 'systems_id', number_partitions => 4, if_not_exists => TRUE);