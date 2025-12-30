"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaUserPlus, FaChevronRight } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/auth/register', { email, password });
            toast.success('Registration successful! Please login.');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md lg:max-w-lg relative"
            >
                {/* Decorative background elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />

                <Card className="glass-card overflow-hidden !border-white/20 relative z-10 shadow-2xl backdrop-blur-2xl bg-white/40">
                    <div className="h-2 bg-gradient-to-r from-secondary via-accent to-primary" />
                    <CardHeader className="text-center space-y-2 pb-8 pt-10 px-8 sm:px-12">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-white shadow-xl shadow-secondary/20 mb-4 transform hover:rotate-12 transition-transform duration-500">
                            <FaUserPlus size={36} />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase">Create Account</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Join the student management system.</CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 sm:px-12 pb-12">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-14 bg-white/50 border-slate-200 focus:border-secondary/50 rounded-2xl transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                                    <div className="relative group">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 h-14 bg-white/50 border-slate-200 focus:border-secondary/50 rounded-2xl transition-all shadow-sm"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-all font-bold text-base shadow-xl shadow-secondary/20 gap-3 group"
                            >
                                {loading ? 'Creating Account...' : (
                                    <>
                                        Register New Account
                                        <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <div className="text-center pt-4">
                                <p className="text-sm text-slate-500">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-secondary font-bold hover:underline">
                                        Sign In
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
