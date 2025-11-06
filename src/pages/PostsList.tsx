import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Database, Loader2, Save, CheckCircle, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

type Post = {
  id: number;
  Post_id: number | null;
  Caption: string | null;
  added_at: string;
  table_exist?: boolean | null;
  keyword?: string | null;
  post_url?: string | null;
  media?: string | null;
  urn_post_id?: string | null;
  Url_lead_magnet?: string | null;
  leadmagnet?: boolean | null;
  type_post?: string | null;
  comments_table_name?: string | null;
  B2B_ou_B2C?: string | null;
}

type FilterOption = 'all' | 'b2b';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadMagnetUrls, setLeadMagnetUrls] = useState<{[key: number]: string}>({});
  const [filter, setFilter] = useState<FilterOption>('all');
  const [isUpdatingTypes, setIsUpdatingTypes] = useState(false);
  const { toast } = useToast();
  const { getTableName, userType } = useUser();

  const updateAllPostsTypes = async () => {
    setIsUpdatingTypes(true);
    try {
      const tableName = getTableName("Posts En Ligne");
      
      // Mettre à jour tous les posts sans B2B_ou_B2C ou qui ne sont pas B2B
      const { error } = await supabase
        .from(tableName as any)
        .update({ B2B_ou_B2C: 'All' } as any)
        .or('B2B_ou_B2C.is.null,B2B_ou_B2C.neq.B2B');

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tous les posts ont été mis à jour avec le type 'All'",
      });
      
      // Recharger les posts
      await fetchPosts();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les posts",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingTypes(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Rafraîchissement automatique toutes les minutes
    const interval = setInterval(() => {
      fetchPosts();
    }, 60000); // 60000ms = 1 minute

    // Nettoyage de l'interval au démontage du composant
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const tableName = getTableName("Posts En Ligne");
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
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

  const handleCreateTable = async (postId: number) => {
    try {
      // Appeler la fonction RPC pour créer la table avec le user_type
      const { data, error: rpcError } = await supabase.rpc('create_post_comments_table', {
        post_id_param: postId,
        user_type_param: userType
      });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        toast({
          title: "Erreur",
          description: "Impossible de créer la table",
          variant: "destructive",
        });
        return;
      }

      // Type assertion pour la réponse
      const result = data as { success: boolean; error?: string; table_name?: string };

      if (!result.success) {
        console.error('Function Error:', result.error);
        toast({
          title: "Erreur",
          description: `Erreur lors de la création: ${result.error}`,
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour le post avec table_exist = true et le nom de la table
      const tableName = getTableName("Posts En Ligne");
      const { error: updateError } = await supabase
        .from(tableName as any)
        .update({ 
          table_exist: true,
          comments_table_name: result.table_name,
          leadmagnet: true
        })
        .eq('id', postId);

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Erreur",
          description: "Impossible de marquer la table comme créée",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour l'état local
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, table_exist: true, leadmagnet: true }
          : post
      ));

      toast({
        title: "Table créée",
        description: `Table ${result.table_name} créée avec succès`,
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

  const handleUpdateLeadMagnet = async (postId: number, url: string) => {
    try {
      const tableName = getTableName("Posts En Ligne");
      const { error } = await supabase
        .from(tableName as any)
        .update({ Url_lead_magnet: url } as any)
        .eq('id', postId);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'URL du lead magnet",
          variant: "destructive",
        });
        return;
      }

      // Mettre à jour l'état local
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, Url_lead_magnet: url }
          : post
      ));

      // Vider le champ input
      setLeadMagnetUrls(prev => ({
        ...prev,
        [postId]: ''
      }));

      toast({
        title: "Succès",
        description: "URL du lead magnet mise à jour",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des posts...</span>
      </div>
    );
  }

  // Filtrer les posts selon le filtre sélectionné
  const filteredPosts = posts.filter(post => {
    if (filter === 'all') {
      return post.B2B_ou_B2C === 'All';
    }
    if (filter === 'b2b') {
      return post.B2B_ou_B2C === 'B2B';
    }
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Posts LinkedIn</h1>
          <p className="text-muted-foreground mt-2">
            Tous les posts de la base de données
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">
            {filteredPosts.length} post{filteredPosts.length > 1 ? 's' : ''} affiché{filteredPosts.length > 1 ? 's' : ''} sur {posts.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Actualisé automatiquement
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtrer:</span>
        </div>
        <Select value={filter} onValueChange={(value: FilterOption) => setFilter(value)}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Sélectionner un filtre" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="all">Tout le monde</SelectItem>
            <SelectItem value="b2b">B2B</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={updateAllPostsTypes} 
          disabled={isUpdatingTypes}
          variant="outline"
          size="sm"
        >
          {isUpdatingTypes ? "Mise à jour..." : "Mettre tous les posts à 'All'"}
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun post trouvé</h3>
            <p className="text-muted-foreground text-center">
              Aucun post n'a été trouvé dans la base de données.
            </p>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
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
                <TableHead>Titre</TableHead>
                <TableHead className="w-[150px]">Mot-clé</TableHead>
                <TableHead className="w-[150px]">Lead Magnet</TableHead>
                <TableHead className="w-[250px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="text-sm">
                    {post.added_at ? new Date(post.added_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    }) : '-'}
                  </TableCell>
                  <TableCell className="font-medium">
                    {(() => {
                      const description = post.Caption || '';
                      const firstSixWords = description.split(' ').slice(0, 6).join(' ');
                      return firstSixWords || `Post ${post.id}`;
                    })()}
                  </TableCell>
                  <TableCell>
                    {post.keyword ? (
                      <Badge variant="outline" className="text-xs">
                        {post.keyword}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {post.Url_lead_magnet && post.keyword && post.comments_table_name ? (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Configuré
                      </Badge>
                    ) : post.comments_table_name ? (
                      <Badge variant="secondary" className="text-xs">
                        En attente
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Détail
                          </Button>
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

                            {post.Caption && (
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Caption:</h4>
                                <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{post.Caption}</p>
                              </div>
                            )}

                            {post.media && (
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Media:</h4>
                                {post.media.toLowerCase().includes('.pdf') ? (
                                  <div className="bg-muted/50 p-3 rounded-md">
                                    <p className="text-sm mb-2">Document PDF:</p>
                                    <a 
                                      href={post.media} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-sm text-primary hover:underline break-all"
                                    >
                                      {post.media}
                                    </a>
                                  </div>
                                ) : (
                                  <div className="bg-muted/50 p-3 rounded-md">
                                    <img 
                                      src={post.media} 
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
                                        href={post.media} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-primary hover:underline break-all ml-1"
                                      >
                                        {post.media}
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

                            {post.comments_table_name && (
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-1">Lead Magnet URL:</h4>
                                {!post.Url_lead_magnet ? (
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Coller l'URL du lead magnet..."
                                      value={leadMagnetUrls[post.id] || ''}
                                      onChange={(e) => setLeadMagnetUrls(prev => ({
                                        ...prev,
                                        [post.id]: e.target.value
                                      }))}
                                      className="flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateLeadMagnet(post.id, leadMagnetUrls[post.id] || '')}
                                      disabled={!leadMagnetUrls[post.id]?.trim()}
                                    >
                                      <Save className="h-4 w-4 mr-1" />
                                      OK
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-green-700 dark:text-green-300 font-medium">Lead magnet configuré</span>
                                    <a 
                                      href={post.Url_lead_magnet} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-primary hover:underline break-all ml-auto"
                                    >
                                      Voir le lien
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {post.keyword && (
                        !post.comments_table_name ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleCreateTable(post.id)}
                          >
                            <Database className="h-4 w-4 mr-1" />
                            Créer table
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Table créée
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}