import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

export const useDashboardStats = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          publishedPosts: 0,
          totalLeads: 0,
          totalComments: 0,
          postsThisMonth: 0,
          leadsThisMonth: 0,
          commentsThisMonth: 0,
        };
      }

      // Get published posts count
      const { count: publishedPosts, error: postsError } = await supabase
        .from('posts')
        .select("*", { count: "exact", head: true })
        .eq('account_id', user.id);

      if (postsError) {
        console.error("Error fetching posts:", postsError);
      }

      // Get total leads count
      const { count: totalLeads, error: leadsError } = await supabase
        .from('leads')
        .select("*", { count: "exact", head: true })
        .eq('user_id', user.id);

      if (leadsError) {
        console.error("Error fetching leads:", leadsError);
      }

      // Get total comments count
      const { count: totalComments, error: commentsError } = await supabase
        .from('comments')
        .select("*", { count: "exact", head: true })
        .eq('account_id', user.id);

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
      }

      // Get posts from this month for calculation
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);
      
      const { count: postsThisMonth, error: postsMonthError } = await supabase
        .from('posts')
        .select("*", { count: "exact", head: true })
        .eq('account_id', user.id)
        .gte("added_at", currentMonth.toISOString());

      if (postsMonthError) {
        console.error("Error fetching posts this month:", postsMonthError);
      }

      // Get leads from this month
      const { count: leadsThisMonth, error: leadsMonthError } = await supabase
        .from('leads')
        .select("*", { count: "exact", head: true })
        .eq('user_id', user.id)
        .gte("date", currentMonth.toISOString());

      if (leadsMonthError) {
        console.error("Error fetching leads this month:", leadsMonthError);
      }

      // Get comments from this month
      const { count: commentsThisMonth, error: commentsMonthError } = await supabase
        .from('comments')
        .select("*", { count: "exact", head: true })
        .eq('account_id', user.id)
        .gte("comment_date", currentMonth.toISOString());

      if (commentsMonthError) {
        console.error("Error fetching comments this month:", commentsMonthError);
      }

      const result = {
        publishedPosts: publishedPosts ?? 0,
        totalLeads: totalLeads ?? 0,
        totalComments: totalComments ?? 0,
        postsThisMonth: postsThisMonth ?? 0,
        leadsThisMonth: leadsThisMonth ?? 0,
        commentsThisMonth: commentsThisMonth ?? 0,
      };

      console.log("Dashboard stats:", result);
      return result;
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
  });
};