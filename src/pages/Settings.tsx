import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_LEADMAGNET_URL;

export default function Settings() {
  const [linkedinAccountId, setLinkedinAccountId] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState(N8N_WEBHOOK_URL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    fetchLinkedinAccountId();
  }, [user]);

  const fetchLinkedinAccountId = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("linkedin_account_id, n8n_webhook_url, linkedin_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile settings:", error);
      } else if (data) {
        setLinkedinAccountId(data.linkedin_account_id || "");
        setLinkedinUrl(data.linkedin_url || "");
        if (data.n8n_webhook_url) {
          setWebhookUrl(data.n8n_webhook_url);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Veuillez vous connecter",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          linkedin_account_id: linkedinAccountId.trim(),
          linkedin_url: linkedinUrl.trim(),
          n8n_webhook_url: webhookUrl.trim()
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile settings:", error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Paramètres sauvegardés",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "URL copiée dans le presse-papiers",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Configurez vos paramètres d'application
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Account ID</CardTitle>
            <CardDescription>
              Configurez votre LinkedIn Account ID pour utiliser les fonctionnalités de lead magnet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin-account-id">LinkedIn Account ID</Label>
              <Input
                id="linkedin-account-id"
                placeholder="Entrez votre LinkedIn Account ID"
                value={linkedinAccountId}
                onChange={(e) => setLinkedinAccountId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin-url">URL Profil LinkedIn</Label>
              <Input
                id="linkedin-url"
                placeholder="https://www.linkedin.com/in/votre-nom"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook N8N</CardTitle>
            <CardDescription>
              URL du webhook unique pour toutes les opérations (Récupération des posts et Lead Magnets)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL du Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  placeholder="https://n8n..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(webhookUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

