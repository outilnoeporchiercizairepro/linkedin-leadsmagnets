import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

export const useRecentActivity = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ["recent-activity", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const activities = [];

      // Get recent published posts
      const { data: recentPosts } = await supabase
        .from('posts')
        .select("added_at, caption")
        .eq('account_id', user.id)
        .order("added_at", { ascending: false })
        .limit(2);

      if (recentPosts) {
        (recentPosts as any[]).forEach((post) => {
          activities.push({
            action: "Nouveau post publié",
            time: formatTimeAgo(post.added_at),
            type: "post",
          });
        });
      }

      // Get recent leads
      const { data: recentLeads } = await supabase
        .from('leads')
        .select("date")
        .eq('user_id', user.id)
        .order("date", { ascending: false })
        .limit(2);

      if (recentLeads) {
        (recentLeads as any[]).forEach((lead) => {
          activities.push({
            action: "Nouveau lead généré",
            time: formatTimeAgo(lead.date),
            type: "lead",
          });
        });
      }

      // Get recent comments
      const { data: recentComments } = await supabase
        .from('comments')
        .select("comment_date, person_name")
        .eq('account_id', user.id)
        .order("comment_date", { ascending: false })
        .limit(2);

      if (recentComments) {
        (recentComments as any[]).forEach((comment) => {
          const personName = comment.person_name || "Quelqu'un";
          activities.push({
            action: `Nouveau commentaire de ${personName}`,
            time: formatTimeAgo(comment.comment_date),
            type: "comment",
          });
        });
      }

      // Sort by most recent first
      return activities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      }).slice(0, 4);
    },
  });
};

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Date inconnue";
  
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes}min`;
  } else if (diffInMinutes < 1440) {
    return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
  } else {
    return `Il y a ${Math.floor(diffInMinutes / 1440)} jour(s)`;
  }
}

function parseTimeAgo(timeStr: string): number {
  const match = timeStr.match(/Il y a (\d+)(min|h|jour)/);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'min': return value;
    case 'h': return value * 60;
    case 'jour': return value * 1440;
    default: return 0;
  }
}