import { useState, useEffect } from 'react';
import { supabase, MRRData } from '../lib/supabase';

export function useMRRData() {
  const [mrrData, setMrrData] = useState<MRRData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMRRData = async () => {
      try {
        const { data, error } = await supabase
          .from('mrr_data')
          .select('creation_date, mrr')
          .order('creation_date', { ascending: true });

        if (error) throw error;
        setMrrData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch MRR data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMRRData();
  }, []);

  return { mrrData, isLoading, error };
}