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
  const { getTableName } = useUser();

  return useQuery({
    queryKey: ["activity-chart", days],
    queryFn: async () => {
      const leadsTableName = getTableName("Leads Linkedin");
      const postsTableName = getTableName("Posts En Ligne");

      // Récupérer les données des X derniers jours
      const startDate = startOfDay(subDays(new Date(), days));

      // Récupérer tous les leads avec leur date
      const { data: leads, error: leadsError } = await supabase
        .from(leadsTableName as any)
        .select("date")
        .gte("date", startDate.toISOString());

      if (leadsError) throw leadsError;

      // Récupérer les posts avec leurs tables de commentaires
      const { data: posts, error: postsError } = await supabase
        .from(postsTableName as any)
        .select("comments_table_name, added_at")
        .not("comments_table_name", "is", null);

      if (postsError) throw postsError;

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

      // Pour chaque table de commentaires, récupérer les statistiques
      if (posts) {
        for (const post of posts as any[]) {
          if (post.comments_table_name) {
            try {
              // Récupérer tous les commentaires de cette table
              const { data: comments } = await supabase
                .from(post.comments_table_name)
                .select("created_at, received_dm")
                .gte("created_at", startDate.toISOString());

              comments?.forEach((comment: any) => {
                const dateKey = format(new Date(comment.created_at), "yyyy-MM-dd");
                if (dataMap.has(dateKey)) {
                  const existing = dataMap.get(dateKey)!;
                  dataMap.set(dateKey, {
                    ...existing,
                    comments: existing.comments + 1,
                    dms: existing.dms + (comment.received_dm ? 1 : 0),
                  });
                }
              });
            } catch (error) {
              console.error(`Error fetching comments from ${post.comments_table_name}:`, error);
            }
          }
        }
      }

      // Convertir la Map en tableau et trier par date
      const chartData = Array.from(dataMap.entries())
        .map(([key, value]) => value)
        .reverse(); // Du plus ancien au plus récent

      return chartData;
    },
  });
};
