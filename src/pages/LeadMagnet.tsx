import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TrendingUp, Users, ExternalLink, Play, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

type Post = {
  id: number;
  Caption: string | null;
  post_url: string | null;
  added_at: string;
  comments_table_name: string | null;
  table_exist: boolean | null;
  urn_post_id: string | null;
  Url_lead_magnet: string | null;
  keyword: string | null;
  B2B_ou_B2C: string | null;
};

type CommentsCount = {
  total: number;
  received_dm: number;
  connection_request: number;
  not_received_dm: number;
  not_connection_request: number;
};

export default function LeadMagnet() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsData, setCommentsData] = useState<Record<number, CommentsCount>>({});
  const [totalLeads, setTotalLeads] = useState(0);
  const [loadingPostId, setLoadingPostId] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'b2b' | 'tout-le-monde'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getTableName, userType } = useUser();

  useEffect(() => {
    fetchPosts();
    fetchTotalLeads();
  }, []);

  const fetchPosts = async () => {
    try {
      const tableName = getTableName("Posts En Ligne");
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .not('comments_table_name', 'is', null)
        .order('added_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as unknown as Post[]);
      
      // Fetch comments for each post
      if (data) {
        for (const post of data as any[]) {
          if (post.comments_table_name) {
            // Ajouter le suffixe utilisateur au nom de la table de commentaires
            const commentsTableWithSuffix = userType ? `${post.comments_table_name}_${userType}` : post.comments_table_name;
            await fetchCommentsCount(post.id, commentsTableWithSuffix);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsCount = async (postId: number, tableName: string) => {
    try {
      const { data, error } = await supabase.rpc('count_comments_by_status', {
        p_table_name: tableName
      });

      if (error) throw error;

      const result = data as { 
        total: number; 
        received_dm: number; 
        connection_request: number; 
        not_received_dm: number; 
        not_connection_request: number; 
        error?: string 
      };
      
      if (result.error) {
        console.error(`Error in RPC for ${tableName}:`, result.error);
        return;
      }

      setCommentsData(prev => ({
        ...prev,
        [postId]: {
          total: result.total || 0,
          received_dm: result.received_dm || 0,
          connection_request: result.connection_request || 0,
          not_received_dm: result.not_received_dm || 0,
          not_connection_request: result.not_connection_request || 0
        }
      }));
    } catch (error) {
      console.error(`Error fetching comments for ${tableName}:`, error);
    }
  };

  const fetchTotalLeads = async () => {
    try {
      const tableName = getTableName("Leads Linkedin");
      const { count, error } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalLeads(count || 0);
    } catch (error) {
      console.error('Error fetching total leads:', error);
    }
  };

  const handleLaunchLeadMagnet = async (post: Post) => {
    if (!post.urn_post_id) {
      toast({
        title: "Erreur",
        description: "L'URN du post est manquant",
        variant: "destructive",
      });
      return;
    }

    setLoadingPostId(post.id);
    console.log("Lancement du lead magnet pour:", post.urn_post_id);

    try {
      // Déterminer l'account_linkedin_id selon l'utilisateur
      const accountLinkedinId = userType === "bapt" 
        ? "JkoJKDJnQ2uE6Ev-JOtzlg" 
        : "aaaaaaaaa";

      const response = await fetch("https://n8n.srv802543.hstgr.cloud/webhook/leadmagnet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urn_post_id: post.urn_post_id,
          url_lead_magnet: post.Url_lead_magnet,
          comments_table_name: post.comments_table_name,
          keyword: post.keyword,
          type_post: post.B2B_ou_B2C,
          account_linkedin_id: accountLinkedinId,
          leads_table_name: getTableName("Leads Linkedin"),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      toast({
        title: "Lead Magnet lancé",
        description: "La requête a été envoyée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du lancement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de lancer le lead magnet",
        variant: "destructive",
      });
    } finally {
      setLoadingPostId(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    // Filtre par type B2B/Tout le monde
    if (typeFilter === 'b2b' && post.B2B_ou_B2C !== 'B2B') return false;
    if (typeFilter === 'tout-le-monde' && post.B2B_ou_B2C !== 'All') return false;
    
    return true;
  });

  const totalComments = Object.values(commentsData).reduce((sum, data) => sum + data.total, 0);
  const totalReceivedDM = Object.values(commentsData).reduce((sum, data) => sum + data.received_dm, 0);
  const totalConnectionRequests = Object.values(commentsData).reduce((sum, data) => sum + data.connection_request, 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Lead Magnet</h1>
          <p className="text-muted-foreground text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Lead Magnet</h1>
        <p className="text-muted-foreground text-lg">
          Analysez vos posts LinkedIn et récupérez un maximum de leads
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts actifs</p>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total commentaires</p>
                <p className="text-2xl font-bold text-foreground">{totalComments}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">DM envoyés</p>
                <p className="text-2xl font-bold text-green-600">{totalReceivedDM}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Demandes connexion</p>
                <p className="text-2xl font-bold text-blue-600">{totalConnectionRequests}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads totaux</p>
                <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Button 
              onClick={() => navigate('/leads')} 
              className="w-full mt-4"
              variant="outline"
            >
              Voir tous les leads
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Posts avec tables créées</CardTitle>
          <CardDescription>
            Liste de vos posts LinkedIn avec leurs statistiques de commentaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Bar */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground mr-2">Type:</span>
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              Tous ({posts.length})
            </Button>
            <Button
              variant={typeFilter === 'tout-le-monde' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('tout-le-monde')}
            >
              Tout le monde ({posts.filter(p => p.B2B_ou_B2C === 'All').length})
            </Button>
            <Button
              variant={typeFilter === 'b2b' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('b2b')}
            >
              B2B ({posts.filter(p => p.B2B_ou_B2C === 'B2B').length})
            </Button>
          </div>

          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun post avec table créée</p>
                <p className="text-sm">Les posts doivent avoir une table de commentaires créée</p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const comments = commentsData[post.id] || { 
                  total: 0, 
                  received_dm: 0, 
                  connection_request: 0, 
                  not_received_dm: 0, 
                  not_connection_request: 0 
                };
                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate pr-4">
                        Post {post.id} : {post.Caption ? post.Caption.split(' ').slice(0, 3).join(' ') : 'Sans titre'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(post.added_at).toLocaleDateString()}
                        </Badge>
                        {post.post_url && (
                          <a
                            href={post.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            Voir le post
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold text-foreground">{comments.total}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">DM envoyés</p>
                        <p className="text-lg font-semibold text-green-600">{comments.received_dm}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Connexions</p>
                        <p className="text-lg font-semibold text-blue-600">{comments.connection_request}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sans DM</p>
                        <p className="text-lg font-semibold text-orange-600">{comments.not_received_dm}</p>
                      </div>
                      <Button
                        onClick={() => handleLaunchLeadMagnet(post)}
                        disabled={loadingPostId === post.id}
                        className="ml-4"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {loadingPostId === post.id ? "Envoi..." : "Lancer"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}