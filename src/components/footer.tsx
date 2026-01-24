import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-background border-t mt-auto py-6">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        © 2025 Happy People 31. Tous droits réservés.
                    </p>
                    <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            À propos
                        </Link>
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Politique de confidentialité
                        </Link>
                        <Link href="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Mentions légales
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Charte d'utilisation
                        </Link>
                        <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Nous contacter
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
