"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaUserGraduate, FaCalendarCheck, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, checkAuth, logout } = useStore();

    useEffect(() => {
        checkAuth();
    }, []);

    const links = [
        { href: '/', label: 'Overview', icon: FaHome, adminOnly: false },
        { href: '/students', label: 'Students', icon: FaUserGraduate, adminOnly: false },
        { href: '/attendance', label: 'Attendance', icon: FaCalendarCheck, adminOnly: false },
    ].filter(link => !user || (!link.adminOnly || user.admin));

    return (
        <nav className="fixed bottom-0 left-0 right-0 sm:top-0 sm:bottom-auto w-full sm:w-20 sm:h-screen glass-card !rounded-none sm:!rounded-r-3xl border-t sm:border-r border-white/20 flex sm:flex-col items-center justify-between sm:py-8 z-50 px-6 sm:px-0 h-16 sm:h-auto backdrop-blur-xl bg-white/70">
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-secondary text-white shadow-lg shadow-accent/20 mb-8">
                <FaChartLine size={24} />
            </div>

            <div className="flex sm:flex-col items-center justify-around sm:justify-center w-full sm:w-auto gap-1 sm:gap-6 p-1 sm:p-0">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative p-2 sm:p-3 group outline-none flex flex-col items-center gap-1"
                        >
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-secondary/10 sm:from-accent/20 sm:to-secondary/20 rounded-xl sm:rounded-2xl border border-accent/20"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    />
                                )}
                            </AnimatePresence>
                            <div className={`relative z-10 p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-accent scale-110' : 'text-slate-400 group-hover:text-primary'}`}>
                                <Icon size={isActive ? 22 : 20} className="sm:text-[24px]" />
                            </div>
                            <span className={`text-[10px] font-bold sm:hidden relative z-10 transition-colors ${isActive ? 'text-accent' : 'text-slate-400'}`}>
                                {link.label}
                            </span>

                            {/* Tooltip for desktop */}
                            <span className="absolute left-20 bg-primary text-primary-foreground px-3 py-1.5 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap hidden sm:block pointer-events-none shadow-xl border border-white/10 z-50">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>


            <button
                onClick={logout}
                className="p-3 mb-4 text-slate-400 hover:text-red-500 transition-colors group relative"
                title="Logout"
            >
                <FaSignOutAlt size={22} />
                <span className="absolute left-20 bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap hidden sm:block pointer-events-none shadow-xl border border-white/10 z-50">
                    Logout
                </span>
            </button>

            <div className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                v2.2
            </div>
        </nav>
    );
}
