import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ShieldCheck, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-secondary flex flex-col">
            {/* Navbar simplificado */}
            <nav className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                            SA
                        </div>
                        <span className="text-xl font-display font-bold text-text-primary">SoftwareArceo</span>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
                        Iniciar Sesión
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="relative overflow-hidden pt-16 pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-text-primary mb-6 animate-fade-in">
                            Sistema de Gestión Operativa de Arceo<br />

                            <span className="text-primary-600">Centralizado e Inteligente</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl text-text-secondary mb-10 leading-relaxed">
                            Digitalice y centralice la gestión de órdenes, recursos y personal.
                            Elimine la fragmentación de información y obtenga visibilidad total en tiempo real.
                        </p>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-20 bg-surface">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Users className="w-8 h-8 text-primary-600" />}
                                title="Gestión de Personal"
                                description="Coordinación eficiente de diagramas de trabajo variables y asignación optimizada de recursos."
                            />
                            <FeatureCard
                                icon={<BarChart3 className="w-8 h-8 text-primary-600" />}
                                title="Trazabilidad Total"
                                description="Seguimiento detallado de cada servicio, desde la orden de trabajo hasta la facturación."
                            />
                            <FeatureCard
                                icon={<ShieldCheck className="w-8 h-8 text-primary-600" />}
                                title="Datos Seguros"
                                description="Infraestructura robusta preparada para escalar operaciones de manera controlada."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-surface border-t border-border py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-text-tertiary">
                    © 2024 SoftwareArceo SGO. Desarrollado para SupraSense.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 rounded-xl bg-surface-secondary border border-border hover:shadow-hover transition-all duration-300">
        <div className="mb-4 bg-primary-50 w-14 h-14 rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
    </div>
);
