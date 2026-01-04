"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaLock,
    FaEnvelope,
    FaUser,
    FaUserPlus,
    FaChevronRight,
    FaGoogle,
    FaFacebook,
    FaGithub,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);
    const router = useRouter();

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validate = () => {
        if (name.length < 2) {
            toast.error('Name must be at least 2 characters long');
            return false;
        }
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await axios.post('/api/auth/register', { name, email, password });
            toast.success('Registration successful! Welcome aboard 🎉');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (platform: string) => {
        setSocialLoading(platform);

        // Simulating professional social login behavior
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            'about:blank',
            `Sign in with ${platform}`,
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (popup) {
            popup.document.write(`
                <html>
                    <head>
                        <title>Connecting to ${platform}...</title>
                        <style>
                            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f4f7f6; }
                            .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; }
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            h2 { color: #333; margin-top: 20px; }
                            p { color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="loader"></div>
                        <h2>Connecting to ${platform}</h2>
                        <p>Please wait while we set up your connection...</p>
                        <script>
                            setTimeout(() => {
                                window.close();
                            }, 2000);
                        </script>
                    </body>
                </html>
            `);
        }

        setTimeout(() => {
            setSocialLoading(null);
            toast.success(`Successfully connected with ${platform}!`);
            // In a real app, this would redirect or update user state
        }, 2500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
            {/* Animated background highlights */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl z-10"
            >
                <Card className="glass-card border-none shadow-2xl relative overflow-hidden bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl border-white/20">
                    {/* Top Accent Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-secondary to-primary" />

                    <CardHeader className="pt-12 pb-6 text-center space-y-3">
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-white shadow-lg shadow-accent/30 mb-2"
                        >
                            <FaUserPlus size={36} className="text-white drop-shadow-md" />
                        </motion.div>
                        <CardTitle className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white uppercase italic">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-300 font-medium">
                            Enter your details to join the platform
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-10 pb-12">
                        <form onSubmit={handleRegister} className="space-y-5">
                            {/* Input Fields Container */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Name Field */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <FaUser className="text-[10px]" /> Full Name
                                    </label>
                                    <div className="relative group">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                                        <Input
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-12 h-14 bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 focus:border-accent/50 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-accent/10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <FaEnvelope className="text-[10px]" /> Email address
                                    </label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="hello@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-14 bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 focus:border-accent/50 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-accent/10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <FaLock className="text-[10px]" /> Password
                                    </label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 pr-12 h-14 bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 focus:border-accent/50 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-accent/10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <FaCheckCircle className="text-[10px]" /> Confirm Password
                                    </label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-12 h-14 bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 focus:border-accent/50 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-accent/10"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-xl bg-gradient-to-r from-accent to-secondary hover:opacity-90 transition-all font-bold text-lg shadow-xl shadow-accent/20 gap-3 mt-4"
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <FaUserPlus />
                                    </motion.div>
                                ) : (
                                    <>
                                        Get Started
                                        <FaChevronRight className="text-sm" />
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-300 dark:border-slate-600"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/50 backdrop-blur-md dark:bg-slate-800/50 px-4 text-slate-500 font-bold">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Buttons */}
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    type="button"
                                    onClick={() => handleSocialLogin('Google')}
                                    disabled={!!socialLoading}
                                    className="h-14 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-white border-2 border-slate-100 dark:border-slate-700 rounded-xl transition-all shadow-md group"
                                >
                                    <FaGoogle className="text-xl group-hover:scale-110 transition-transform text-red-500" />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleSocialLogin('Facebook')}
                                    disabled={!!socialLoading}
                                    className="h-14 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-white border-2 border-slate-100 dark:border-slate-700 rounded-xl transition-all shadow-md group"
                                >
                                    <FaFacebook className="text-xl group-hover:scale-110 transition-transform text-blue-600" />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleSocialLogin('GitHub')}
                                    disabled={!!socialLoading}
                                    className="h-14 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-white border-2 border-slate-100 dark:border-slate-700 rounded-xl transition-all shadow-md group"
                                >
                                    <FaGithub className="text-xl group-hover:scale-110 transition-transform text-slate-900 dark:text-white" />
                                </Button>
                            </div>

                            {/* Footer Link */}
                            <div className="text-center pt-6">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-accent font-extrabold hover:underline transition-all underline-offset-4">
                                        Sign In Here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
