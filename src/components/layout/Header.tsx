import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';
  const shouldHideHeader = isHomePage && !isScrolled;

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm py-2 md:py-3',
      shouldHideHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo on the left */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            style={{ pointerEvents: 'auto' }}
          >
            <img
              src="/lovable-uploads/d8b82a03-78f9-4b90-ac43-39097201c852.png"
              alt="Atlangrove Homes Logo"
              className="h-10 sm:h-12 navbar-logo"
              style={{ filter: 'none !important', WebkitFilter: 'none !important' }}
              tabIndex={-1}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={cn(
            'hidden transition-all duration-300',
            isScrolled ? 'md:flex' : 'md:hidden',
            'space-x-8'
          )}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-blue relative py-2',
                  isActive(item.href)
                    ? 'text-brand-blue after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-blue'
                    : 'text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Contact Button - Desktop */}
          <div className={cn(
            'hidden transition-all duration-300 items-center gap-4',
            isScrolled ? 'md:flex' : 'md:hidden'
          )}>
            <Button asChild className="bg-brand-blue text-white hover:brightness-90">
              <Link to="/contact">Get In Touch</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-border py-4 shadow-lg animate-fadeIn">
            <div className="px-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'block text-base font-medium py-2 transition-colors',
                    isActive(item.href) ? 'text-brand-blue' : 'text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="w-full mt-4 bg-brand-blue text-white hover:brightness-90">
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
