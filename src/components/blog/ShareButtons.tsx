import { Copy, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied to clipboard!',
      description: 'The link to this blog post has been copied to your clipboard.',
    });
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Share:</span>
      <Button variant="outline" size="icon" onClick={copyToClipboard}>
        <Copy className="h-4 w-4" />
      </Button>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon">
          <Facebook className="h-4 w-4" />
        </Button>
      </a>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon">
          <Twitter className="h-4 w-4" />
        </Button>
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="icon">
          <Linkedin className="h-4 w-4" />
        </Button>
      </a>
    </div>
  );
};

export default ShareButtons;
