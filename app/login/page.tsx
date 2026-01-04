"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaUserShield, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { checkAuth } = useStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/login', { email, password });
            await checkAuth(); // Update global state immediately
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-accent font-bold transition-colors group z-50">
                <div className="p-2 rounded-lg bg-white/50 border border-slate-200 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                    <FaArrowLeft size={14} />
                </div>
                <span className="text-sm uppercase tracking-widest italic">Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md lg:max-w-lg relative"
            >
                {/* Decorative background elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />

                <Card className="glass-card overflow-hidden !border-white/20 relative z-10 shadow-2xl backdrop-blur-2xl bg-white/40">
                    <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary" />
                    <CardHeader className="text-center space-y-2 pb-8 pt-10 px-8 sm:px-12">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4 transform hover:rotate-12 transition-transform duration-500">
                            <FaUserShield size={36} />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase">Secure Access</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Please sign in to manage your student records.</CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 sm:px-12 pb-12">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-14 bg-white/50 border-slate-200 focus:border-primary/50 rounded-2xl transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Secret Key</label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 h-14 bg-white/50 border-slate-200 focus:border-primary/50 rounded-2xl transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all font-bold text-base shadow-xl shadow-primary/20 gap-3 group"
                            >
                                {loading ? 'System Authenticating...' : (
                                    <>
                                        Authorize & Enter
                                        <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <div className="text-center pt-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Protected by AES-256 standard encryption.<br />Authorized personnel only.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
