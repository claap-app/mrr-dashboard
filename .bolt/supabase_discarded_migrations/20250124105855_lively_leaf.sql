/*
  # Add sample MRR data

  1. Sample Data
    - Adds 180 days of sample MRR data
    - Starting from 6 months ago
    - With realistic growth patterns
*/

-- Function to generate sample MRR data
DO $$
DECLARE
    current_date date := CURRENT_DATE - interval '180 days';
    base_mrr integer := 40000; -- Starting MRR of $40,000
    daily_growth numeric := 1.003; -- Approximately 0.3% daily growth
    i integer;
BEGIN
    FOR i IN 1..180 LOOP
        -- Add some random variation to the growth (-0.5% to +0.5%)
        base_mrr := round(base_mrr * (daily_growth + (random() * 0.01 - 0.005)));
        
        -- Insert the data point
        INSERT INTO mrr_data (creation_date, mrr)
        VALUES (current_date + (i || ' days')::interval, base_mrr)
        ON CONFLICT (creation_date) DO UPDATE
        SET mrr = EXCLUDED.mrr;
    END LOOP;
END $$;