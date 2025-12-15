import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { startOfDay, subDays, format } from "date-fns";

export interface ChartDataPoint {
  date: string;
  leads: number;
  comments: number;
  dms: number;
}

export const useActivityChart = (days: number = 30) => {
  const { user } = useUser();

  return useQuery({
    queryKey: ["activity-chart", days, user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Récupérer les données des X derniers jours
      const startDate = startOfDay(subDays(new Date(), days));

      // Récupérer tous les leads avec leur date
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select("date")
        .eq('user_id', user.id)
        .gte("date", startDate.toISOString());

      if (leadsError) throw leadsError;

      // Récupérer tous les commentaires
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select("comment_date, received_dm")
        .eq('account_id', user.id)
        .gte("comment_date", startDate.toISOString());

      if (commentsError) throw commentsError;

      // Créer un objet pour agréger les données par date
      const dataMap = new Map<string, ChartDataPoint>();

      // Initialiser tous les jours de la période
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        const displayFormat = days === 1 ? "HH:mm" : days <= 7 ? "dd/MM" : days <= 30 ? "dd/MM" : "dd/MM/yy";
        dataMap.set(date, {
          date: format(subDays(new Date(), i), displayFormat),
          leads: 0,
          comments: 0,
          dms: 0,
        });
      }

      // Compter les leads par jour
      leads?.forEach((lead: any) => {
        if (lead.date) {
          const dateKey = format(new Date(lead.date), "yyyy-MM-dd");
          if (dataMap.has(dateKey)) {
            const existing = dataMap.get(dateKey)!;
            dataMap.set(dateKey, { ...existing, leads: existing.leads + 1 });
          }
        }
      });

      // Compter les commentaires et DMs par jour
      comments?.forEach((comment: any) => {
        if (comment.comment_date) {
          const dateKey = format(new Date(comment.comment_date), "yyyy-MM-dd");
          if (dataMap.has(dateKey)) {
            const existing = dataMap.get(dateKey)!;
            dataMap.set(dateKey, {
              ...existing,
              comments: existing.comments + 1,
              dms: existing.dms + (comment.received_dm ? 1 : 0),
            });
          }
        }
      });

      // Convertir la Map en tableau et trier par date
      const chartData = Array.from(dataMap.entries())
        .map(([key, value]) => value)
        .reverse(); // Du plus ancien au plus récent

      return chartData;
    },
  });
};
