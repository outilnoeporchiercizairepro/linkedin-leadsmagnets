import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Rocket, Settings, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_LEADMAGNET_URL;

type Post = {
  id: number;
  caption?: string | null;
  added_at: string;
  keyword?: string | null;
  post_url?: string | null;
  media_url?: string | null;
  urn_post_id?: string | null;
  url_lead_magnet?: string | null;
  message_prefait?: string | null;
  type_post?: string | null;
  lead_magnet?: boolean | null;
}

// Helper functions
const getCaption = (post: Post) => post.caption;
const getUrlLeadMagnet = (post: Post) => post.url_lead_magnet;

// Fonction pour tronquer la description
const truncateDescription = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

type PostStats = {
  totalComments: number;
  dmsSent: number;
  connectionRequests: number;
};

export default function LeadMagnet() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [configuringPost, setConfiguringPost] = useState<Post | null>(null);
  const [urlLeadMagnet, setUrlLeadMagnet] = useState("");
  const [messagePrefait, setMessagePrefait] = useState("");
  const [launching, setLaunching] = useState<{[key: number]: boolean}>({});
  const [linkedinAccountId, setLinkedinAccountId] = useState<string | null>(null);
  const [postStats, setPostStats] = useState<{[key: number]: PostStats}>({});
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    fetchPosts();
    fetchLinkedinAccountId();
    
    const interval = setInterval(() => {
      fetchPosts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (posts.length > 0 && user) {
      fetchPostStats();
    }
  }, [posts, user]);

  const fetchLinkedinAccountId = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("linkedin_account_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching linkedin_account_id:", error);
      } else if (data) {
        setLinkedinAccountId(data.linkedin_account_id || null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('account_id', user.id)
        .not('keyword', 'is', null)
        .order('added_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les posts",
          variant: "destructive",
        });
        return;
      }

      setPosts((data || []) as unknown as Post[]);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPostStats = async () => {
    if (!user) return;
    
    try {
      const statsMap: {[key: number]: PostStats} = {};
      
      for (const post of posts) {
        const { data: comments, error } = await supabase
          .from('comments')
          .select('received_dm, connection_request_statut')
          .eq('post_id', post.id)
          .eq('account_id', user.id);

        if (!error && comments) {
          statsMap[post.id] = {
            totalComments: comments.length,
            dmsSent: comments.filter(c => c.received_dm === true).length,
            connectionRequests: comments.filter(c => c.connection_request_statut === true).length,
          };
        } else {
          statsMap[post.id] = {
            totalComments: 0,
            dmsSent: 0,
            connectionRequests: 0,
          };
        }
      }
      
      setPostStats(statsMap);
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
    }
  };

  const isPostActive = (post: Post) => {
    return !!(getUrlLeadMagnet(post) && post.message_prefait);
  };

  const handleConfigure = (post: Post) => {
    setConfiguringPost(post);
    setUrlLeadMagnet(getUrlLeadMagnet(post) || "");
    setMessagePrefait(post.message_prefait || "");
  };

  const handleSaveConfiguration = async () => {
    if (!configuringPost) return;

    try {
      const updateData: any = {
        url_lead_magnet: urlLeadMagnet,
        message_prefait: messagePrefait,
      };

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', configuringPost.id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder la configuration",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour l'état local
      setPosts(posts.map(post => 
        post.id === configuringPost.id 
          ? { 
              ...post, 
              url_lead_magnet: urlLeadMagnet,
              message_prefait: messagePrefait 
            }
          : post
      ));

      setConfiguringPost(null);
      setUrlLeadMagnet("");
      setMessagePrefait("");

      toast({
        title: "Succès",
        description: "Configuration sauvegardée",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const handleLaunch = async (post: Post, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!user || !linkedinAccountId) {
      toast({
        title: "Erreur",
        description: "Veuillez vous connecter et configurer votre LinkedIn Account ID dans les paramètres.",
        variant: "destructive",
      });
      return;
    }
    if (!getUrlLeadMagnet(post) || !post.message_prefait) {
      toast({
        title: "Erreur",
        description: "Veuillez configurer l'URL du lead magnet et le message préfait avant de lancer.",
        variant: "destructive",
      });
      return;
    }

    setLaunching(prev => ({ ...prev, [post.id]: true }));

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url_lead_magnet: getUrlLeadMagnet(post),
          account_linkedin_id: linkedinAccountId,
          message_prefait: post.message_prefait,
          post_id: post.id,
          urn_post_id: post.urn_post_id,
          keyword: post.keyword,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Succès",
        description: "Lead magnet lancé avec succès !",
      });
    } catch (error) {
      console.error('Erreur lors du lancement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de lancer le lead magnet",
        variant: "destructive",
      });
    } finally {
      setLaunching(prev => ({ ...prev, [post.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des posts...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
          <h1 className="text-3xl font-bold gradient-text">Lead Magnet</h1>
          <p className="text-muted-foreground mt-2">
            Configurez et lancez vos lead magnets
          </p>
              </div>
            </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold mb-2">Aucun lead magnet trouvé</h3>
            <p className="text-muted-foreground text-center">
              Aucun post avec mot-clé n'a été trouvé dans la base de données.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => {
            const isActive = isPostActive(post);
            return (
              <Dialog key={post.id}>
                <DialogTrigger asChild>
                  <Card className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        {isActive ? (
                          <Badge variant="default" className="text-xs bg-green-500/20 text-green-600">
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Inactif
                          </Badge>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Description:</p>
                        <p className="text-sm font-medium line-clamp-3">
                          {truncateDescription(getCaption(post), 150)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {post.keyword && (
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-muted-foreground">Mot-clé:</p>
                            <Badge variant="outline" className="text-xs">
                              {post.keyword}
                            </Badge>
                          </div>
                        )}

                        {post.type_post && (
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-muted-foreground">Type:</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {post.type_post}
                            </Badge>
                        </div>
                        )}
                      </div>
                      
                      {postStats[post.id] && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Statistiques:</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                              <p className="font-semibold text-foreground">{postStats[post.id].totalComments}</p>
                              <p className="text-muted-foreground">Commentaires</p>
                        </div>
                        <div className="text-center">
                              <p className="font-semibold text-foreground">{postStats[post.id].dmsSent}</p>
                              <p className="text-muted-foreground">DM envoyés</p>
                        </div>
                        <div className="text-center">
                              <p className="font-semibold text-foreground">{postStats[post.id].connectionRequests}</p>
                              <p className="text-muted-foreground">Connexions</p>
                            </div>
                        </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfigure(post);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Configurer
                        </Button>
                        {isActive && (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => handleLaunch(post, e)}
                            disabled={launching[post.id]}
                          >
                            {launching[post.id] ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4 mr-1" />
                            )}
                            Lancer
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Détails du Post {post.id}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Date d'ajout:</h4>
                      <p className="text-sm">
                        {post.added_at ? new Date(post.added_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Date inconnue'}
                      </p>
                    </div>

                    {getCaption(post) && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Caption:</h4>
                        <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                          {getCaption(post)}
                        </p>
                      </div>
                    )}

                    {post.media_url && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Media:</h4>
                        {post.media_url.toLowerCase().includes('.pdf') ? (
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm mb-2">Document PDF:</p>
                            <a 
                              href={post.media_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {post.media_url}
                            </a>
                          </div>
                        ) : (
                          <div className="bg-muted/50 p-3 rounded-md">
                            <img 
                              src={post.media_url} 
                              alt="Media du post" 
                              className="max-w-full h-auto rounded-md border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const nextEl = target.nextElementSibling as HTMLElement;
                                if (nextEl) nextEl.style.display = 'block';
                              }}
                            />
                            <p className="text-sm text-muted-foreground hidden">
                              Impossible de charger l'image: 
                              <a 
                                href={post.media_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:underline break-all ml-1"
                              >
                                {post.media_url}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {post.keyword && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Mot-clé CTA:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded-md">{post.keyword}</p>
                      </div>
                    )}

                    {post.post_url && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">URL du post:</h4>
                        <a 
                          href={post.post_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary hover:underline break-all bg-muted/50 p-3 rounded-md block"
                        >
                          {post.post_url}
                        </a>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Statut Lead Magnet:</h4>
                      <p className="text-sm">
                        {isActive ? (
                          <Badge variant="default" className="text-xs bg-green-500/20 text-green-600">
                            Configuré et prêt
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Configuration requise
                          </Badge>
                        )}
                            </p>
                          </div>
                        </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}

      {/* Dialog de configuration */}
      <Dialog open={!!configuringPost} onOpenChange={(open) => !open && setConfiguringPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurer le Lead Magnet</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">URL du Lead Magnet:</label>
              <Input
                placeholder="https://..."
                value={urlLeadMagnet}
                onChange={(e) => setUrlLeadMagnet(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message préfait:</label>
              <Textarea
                placeholder="Entrez votre message préfait..."
                value={messagePrefait}
                onChange={(e) => setMessagePrefait(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setConfiguringPost(null);
                  setUrlLeadMagnet("");
                  setMessagePrefait("");
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveConfiguration}
                disabled={!urlLeadMagnet.trim() || !messagePrefait.trim()}
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

