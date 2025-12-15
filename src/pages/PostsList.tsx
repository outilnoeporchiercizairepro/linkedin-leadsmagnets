import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Rocket, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

type Post = {
  id: number;
  post_id?: string | null;
  caption?: string | null;
  added_at: string;
  keyword?: string | null;
  post_url?: string | null;
  media_url?: string | null;
  urn_post_id?: string | null;
  url_lead_magnet?: string | null;
  type_post?: string | null;
  lead_magnet?: boolean | null;
}

// Helper functions
const getCaption = (post: Post) => post.caption;

// Fonction pour tronquer la description
const truncateDescription = (text: string | null | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

type PostTypeFilter = 'all' | 'normal' | 'leadmagnet';
type MediaTypeFilter = 'all' | 'image' | 'carousel' | 'video';

const N8N_WEBHOOK_FETCH_POST_URL = "https://n8n.srv802543.hstgr.cloud/webhook/récupération-post";

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingPost, setFetchingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [postTypeFilter, setPostTypeFilter] = useState<PostTypeFilter>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilter>('all');
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    fetchPosts();
    
    // Rafraîchissement automatique toutes les minutes
    const interval = setInterval(() => {
      fetchPosts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const handleDeletePost = async () => {
    if (!postToDelete || !user) {
      return;
    }

    setDeleting(true);

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postToDelete.id)
        .eq('account_id', user.id);

      if (error) {
        throw error;
      }

      // Mettre à jour la liste des posts
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      setPostToDelete(null);

      toast({
        title: "Succès",
        description: "Post supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le post",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleFetchLastPost = async () => {
    if (!user || !user.email) {
      toast({
        title: "Erreur",
        description: "Veuillez vous connecter pour récupérer le dernier post",
        variant: "destructive",
      });
      return;
    }

    setFetchingPost(true);

    try {
      const response = await fetch(N8N_WEBHOOK_FETCH_POST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Succès",
        description: "Récupération du dernier post déclenchée. Les posts seront mis à jour automatiquement.",
      });

      // Rafraîchir les posts après un court délai
      setTimeout(() => {
        fetchPosts();
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la récupération du post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le dernier post",
        variant: "destructive",
      });
    } finally {
      setFetchingPost(false);
    }
  };

  // Filtrer les posts selon les filtres sélectionnés
  const filteredPosts = posts.filter(post => {
    // Filtre par type de post
    if (postTypeFilter === 'leadmagnet' && !post.keyword) return false;
    if (postTypeFilter === 'normal' && post.keyword) return false;

    // Filtre par type de média
    if (mediaTypeFilter !== 'all') {
      const postMediaType = post.type_post?.toLowerCase() || '';
      if (mediaTypeFilter === 'image' && postMediaType !== 'image') return false;
      if (mediaTypeFilter === 'carousel' && postMediaType !== 'carousel') return false;
      if (mediaTypeFilter === 'video' && postMediaType !== 'video') return false;
    }

    return true;
  });

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
          <h1 className="text-3xl font-bold gradient-text">Posts LinkedIn</h1>
          <p className="text-muted-foreground mt-2">
            Tous les posts de la base de données
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleFetchLastPost}
            disabled={fetchingPost || !user}
            variant="default"
          >
            {fetchingPost ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Récupération...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Récupérer dernier post
              </>
            )}
          </Button>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} post{filteredPosts.length > 1 ? 's' : ''} affiché{filteredPosts.length > 1 ? 's' : ''} sur {posts.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Actualisé automatiquement
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <Select value={postTypeFilter} onValueChange={(value: PostTypeFilter) => setPostTypeFilter(value)}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Type de post" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="leadmagnet">Lead Magnet</SelectItem>
          </SelectContent>
        </Select>

        <Select value={mediaTypeFilter} onValueChange={(value: MediaTypeFilter) => setMediaTypeFilter(value)}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Type de média" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="video">Vidéo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold mb-2">Aucun post trouvé</h3>
            <p className="text-muted-foreground text-center">
              Aucun post n'a été trouvé dans la base de données.
            </p>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold mb-2">Aucun post correspondant</h3>
            <p className="text-muted-foreground text-center">
              Aucun post ne correspond aux filtres sélectionnés.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-280px)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="w-[20%]">Type de post</TableHead>
                <TableHead className="w-[20%]">Type de média</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow 
                  key={post.id}
                  className="hover:bg-muted/50"
                >
                  <TableCell 
                    className="text-sm cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.added_at ? new Date(post.added_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    }) : '-'}
                  </TableCell>
                  <TableCell 
                    className="font-medium cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    {truncateDescription(getCaption(post), 100) || `Post ${post.id}`}
                  </TableCell>
                  <TableCell 
                    onClick={() => setSelectedPost(post)}
                    className="cursor-pointer"
                  >
                    {post.keyword ? (
                      <Badge variant="default" className="text-xs bg-primary/20 text-primary hover:bg-primary/30">
                        <Rocket className="h-3 w-3 mr-1" /> Lead Magnet
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell 
                    onClick={() => setSelectedPost(post)}
                    className="cursor-pointer"
                  >
                    {post.type_post ? (
                      <Badge variant="outline" className="text-xs capitalize">
                        {post.type_post}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPostToDelete(post);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}

      {/* Dialog de détails du post */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <>
                          <DialogHeader>
                <DialogTitle>Détails du Post {selectedPost.id}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">Date d'ajout:</h4>
                              <p className="text-sm">
                    {selectedPost.added_at ? new Date(selectedPost.added_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Date inconnue'}
                              </p>
                            </div>

                    {getCaption(selectedPost) && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Caption:</h4>
                        <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                          {getCaption(selectedPost)}
                        </p>
                      </div>
                    )}

                    {selectedPost.media_url && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Media:</h4>
                        {selectedPost.media_url.toLowerCase().includes('.pdf') ? (
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm mb-2">Document PDF:</p>
                            <a 
                              href={selectedPost.media_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {selectedPost.media_url}
                            </a>
                          </div>
                        ) : (
                          <div className="bg-muted/50 p-3 rounded-md">
                            <img 
                              src={selectedPost.media_url} 
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
                                href={selectedPost.media_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:underline break-all ml-1"
                              >
                                {selectedPost.media_url}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                {selectedPost.keyword && (
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Mot-clé CTA:</h4>
                    <p className="text-sm bg-muted/50 p-3 rounded-md">{selectedPost.keyword}</p>
                              </div>
                            )}

                {selectedPost.post_url && (
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">URL du post:</h4>
                                <a 
                      href={selectedPost.post_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-sm text-primary hover:underline break-all bg-muted/50 p-3 rounded-md block"
                                >
                      {selectedPost.post_url}
                                </a>
                              </div>
                            )}

                              <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Type de post:</h4>
                  <p className="text-sm">
                    {selectedPost.keyword ? (
                      <Badge variant="default" className="text-xs bg-primary/20 text-primary">
                        <Rocket className="h-3 w-3 mr-1" /> Lead Magnet
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Normal</Badge>
                    )}
                  </p>
                              </div>

                {selectedPost.type_post && (
                              <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Type de média:</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedPost.type_post}
                    </Badge>
                                    </div>
                                  )}
                                </div>
            </>
                            )}
                        </DialogContent>
                      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.
              {postToDelete && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <p className="font-medium">Post #{postToDelete.id}</p>
                  {getCaption(postToDelete) && (
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {truncateDescription(getCaption(postToDelete), 100)}
                    </p>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPostToDelete(null)}
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
