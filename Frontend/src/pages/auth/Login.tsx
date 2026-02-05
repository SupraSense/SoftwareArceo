import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../auth/authService';
import { ForceLightMode } from '../../components/ui/ForceLightMode';

type LoginFormInputs = {
    email: string;
    password: string;
};

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        setIsLoading(true);
        setLoginError(null);
        try {
            await authService.login(data.email, data.password);
            navigate('/app');
        } catch (error) {
            console.error('Login failed', error);
            setLoginError('Credenciales inválidas. Por favor intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <ForceLightMode />
            {/* Sección Izquierda - Formulario */}
            <div className="flex items-center justify-center p-8 bg-surface">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-display font-bold text-text-primary">Bienvenido de nuevo</h2>
                        <p className="mt-2 text-text-secondary">Ingrese sus credenciales para acceder</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            placeholder="usuario@suprasense.com"
                            icon={<Mail className="w-5 h-5" />}
                            {...register('email', { required: 'El email es requerido' })}
                            error={errors.email?.message}
                        />

                        <div className="space-y-1">
                            <Input
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none hover:text-text-primary"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                }
                                {...register('password', { required: 'La contraseña es requerida' })}
                                error={errors.password?.message}
                            />
                            <div className="flex justify-end">
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    ¿Olvidó su contraseña?
                                </a>
                            </div>
                        </div>

                        {loginError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                                {loginError}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            Iniciar Sesión
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-text-tertiary">
                        Sistema protegido. El acceso no autorizado será monitoreado.
                    </p>
                </div>
            </div>

            {/* Sección Derecha - Decorativa (Oculta en móviles) */}
            <div className="hidden lg:flex relative bg-primary-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-black opacity-60"></div>
                {/* Patrón de fondo o imagen abstracta aquí */}
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h3 className="text-3xl font-bold mb-4">Eficiencia Operativa</h3>
                    <p className="text-primary-100 text-lg">
                        "La plataforma SGO nos permite escalar nuestras operaciones con confianza, garantizando precisión en cada paso del proceso."
                    </p>
                </div>
            </div>
        </div>
    );
};