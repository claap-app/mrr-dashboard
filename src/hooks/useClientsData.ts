import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type ClientsData = {
  creation_date: string;
  clients: number;
  starter: number;
  pro: number;
  business: number;
};

export function useClientsData() {
  const [clientsData, setClientsData] = useState<ClientsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const { data, error } = await supabase
          .from('mrr_data')
          .select('creation_date, clients, starter, pro, business')
          .order('creation_date', { ascending: true });

        if (error) throw error;
        setClientsData(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clients data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientsData();
  }, []);

  return { clientsData, isLoading, error };
}