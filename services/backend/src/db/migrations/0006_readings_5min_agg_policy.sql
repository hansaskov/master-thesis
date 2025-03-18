-- Custom SQL migration file, put your code below! --
SELECT add_continuous_aggregate_policy('"public"."readings_5min_agg"',
  start_offset => INTERVAL '5 minutes',
  end_offset   => INTERVAL '30 seconds',
  schedule_interval => INTERVAL '15 seconds');