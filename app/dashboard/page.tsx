"use client";
import { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';
import { FaUsers, FaUserCheck, FaUserTimes, FaCalendarAlt, FaChartLine, FaSearch, FaUserGraduate } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const { stats, fetchStats, fetchStudents, students, user, isAuthChecking } = useStore();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [chartRange, setChartRange] = useState<'week' | 'month'>('week');

    useEffect(() => {
        fetchStats();
        fetchStudents();

        // Auto-select student if it's a student user
        if (user && !user.admin && user.studentId) {
            setSelectedStudentId(user.studentId);
        }

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1E293B', '#0D9488', '#6366F1']
        });
    }, [user]);

    const attendanceRecords = stats?.attendance || [];

    // Filter attendance for selected date
    const selectedDateRecords = useMemo(() =>
        attendanceRecords.filter(r => r.date === selectedDate),
        [attendanceRecords, selectedDate]
    );

    // Stats for selected date
    const datePresent = selectedDateRecords.filter(r => r.status === 'Present').length;
    const dateAbsent = selectedDateRecords.filter(r => r.status === 'Absent').length;
    const totalInSystem = students.length;

    // Personal Stats for Student
    const personalStats = useMemo(() => {
        if (!user?.studentId) return { present: 0, late: 0, total: 0, percentage: 0 };
        const myRecords = attendanceRecords.filter(r => (r.studentId?._id || r.studentId) === user.studentId);
        const present = myRecords.filter(r => r.status === 'Present').length;
        const late = myRecords.filter(r => r.status === 'Late').length;
        return {
            present,
            late,
            total: myRecords.length,
            percentage: myRecords.length ? Math.round((present / myRecords.length) * 100) : 0
        };
    }, [attendanceRecords, user]);

    // Trend data for charts
    const chartData = useMemo(() => {
        const grouped = attendanceRecords.reduce((acc: any, curr: any) => {
            if (!acc[curr.date]) acc[curr.date] = { date: curr.date, present: 0, absent: 0 };
            if (curr.status === 'Present') acc[curr.date].present++;
            else acc[curr.date].absent++;
            return acc;
        }, {});
        return Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(-10);
    }, [attendanceRecords]);

    // Individual student data
    const studentAttendanceData = useMemo(() => {
        if (!selectedStudentId) return [];

        // Sort all records for this student
        const studentRecords = attendanceRecords
            .filter(r => (r.studentId?._id || r.studentId) === selectedStudentId)
            .sort((a, b) => a.date.localeCompare(b.date));

        const limit = chartRange === 'week' ? 7 : 30;
        return studentRecords.slice(-limit).map(r => ({
            date: r.date.slice(5),
            status: r.status === 'Present' ? 1 : 0
        }));
    }, [selectedStudentId, attendanceRecords, chartRange]);

    if (isAuthChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full shadow-lg"
                />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight premium-gradient-text pb-1">
                        {user?.admin ? 'Analytics Dashboard' : 'Student Overview'}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {user?.admin ? 'Monitoring attendance with precision.' : 'Track your progress and attendance.'}
                    </p>
                </motion.div>

                {user && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-premium"
                    >
                        <div className="flex items-center gap-2 pl-2 text-primary">
                            <FaCalendarAlt className="animate-pulse-slow" />
                            <span className="text-sm font-semibold">View Date:</span>
                        </div>
                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-40 border-none bg-transparent focus-visible:ring-0 font-medium"
                        />
                    </motion.div>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {user?.admin ? (
                    <>
                        <KpiCard title="Total Capacity" value={totalInSystem} icon={FaUsers} color="primary" label="Students Enrolled" />
                        <KpiCard title="Present Today" value={datePresent} icon={FaUserCheck} color="secondary" label="Confirmed Presence" />
                        <KpiCard title="Absent Today" value={dateAbsent} icon={FaUserTimes} color="accent" label="Noticed Absences" />
                        <KpiCard title="Daily Avg %" value={`${totalInSystem ? Math.round((datePresent / totalInSystem) * 100) : 0}%`} icon={FaChartLine} color="primary" label="Attendance Rate" />
                    </>
                ) : (
                    <>
                        <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3">
                            <Link href={`/students/${user?.studentId}`}>
                                <Button className="w-full h-[120px] rounded-3xl bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-2 group hover:scale-[1.02] transition-transform">
                                    <div className="p-3 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-colors">
                                        <FaUserGraduate size={24} className="text-white" />
                                    </div>
                                    <span className="font-bold text-white tracking-wide uppercase text-xs">My Complete Profile</span>
                                </Button>
                            </Link>
                        </div>
                        <KpiCard title="Your Presence" value={`${personalStats.percentage}%`} icon={FaUserCheck} color="secondary" label="Attendance Rate" />
                        <KpiCard title="Total Sessions" value={personalStats.total} icon={FaCalendarAlt} color="primary" label="Days Logged" />
                        <KpiCard title="Status" value={personalStats.percentage > 75 ? 'Good' : 'Warning'} icon={FaUsers} color="primary" label="Current Standing" />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trends Chart */}
                <Card className={user?.admin ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <CardHeader>
                        <CardTitle>{user?.admin ? 'Global Presence Trends' : 'Your Attendance History'}</CardTitle>
                        <CardDescription>{user?.admin ? 'Daily activity visualization for the last 10 sessions' : 'Visual breakdown of your presence history'}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={user?.admin ? chartData : studentAttendanceData}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1E293B" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#1E293B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(val) => val.includes('-') ? val.slice(5) : val} fontSize={12} dy={10} />
                                <YAxis tickLine={false} axisLine={false} fontSize={12} dx={-10} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey={user?.admin ? 'present' : 'status'} stroke="#1E293B" strokeWidth={3} fill="url(#colorPresent)" />
                                {user?.admin && <Area type="monotone" dataKey="absent" stroke="#6366F1" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />}
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Student Attendance Summary List */}
                <Card className={`lg:col-span-1 border-accent/20 ${!user?.admin ? 'h-full' : ''}`}>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Daily Status Log</CardTitle>
                        <CardDescription>{selectedDate}</CardDescription>
                        <div className="relative mt-2">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs" />
                            <Input
                                placeholder="Search student..."
                                className="pl-8 h-9 text-sm rounded-xl focus:ring-accent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                        {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => {
                            const sid = (student.id || (student as any)._id) as string;
                            const record = selectedDateRecords.find(r => (r.studentId?._id || r.studentId) === sid);
                            const status = record?.status || 'N/A';
                            return (
                                <div
                                    key={sid}
                                    onClick={() => setSelectedStudentId(sid)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${selectedStudentId === sid ? 'bg-accent/10 border-accent/30' : 'bg-white/40 border-transparent hover:border-slate-200'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{student.name}</div>
                                            <div className="text-[10px] text-muted-foreground">{student.class}</div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${status === 'Present' ? 'bg-teal-100 text-teal-700' :
                                        status === 'Absent' ? 'bg-red-100 text-red-600' :
                                            status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {status}
                                    </span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Student Specific Analytics (Only selectable for Admin, always shown for Student) */}
            <AnimatePresence>
                {selectedStudentId && (user?.admin || selectedStudentId === user?.studentId) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="pb-20 sm:pb-0" // Add padding for bottom nav on mobile
                    >
                        <Card className="overflow-hidden border-secondary/20">
                            <div className="h-2 bg-gradient-to-r from-accent via-secondary to-primary" />
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent to-secondary flex items-center justify-center text-white shadow-lg">
                                        <FaUserGraduate size={24} />
                                    </div>
                                    <div>
                                        <CardTitle>{students.find(s => s.id === selectedStudentId)?.name}&apos;s Analytics</CardTitle>
                                        <CardDescription>Personal performance overview</CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                                    <Button
                                        variant={chartRange === 'week' ? 'default' : 'ghost'}
                                        size="sm"
                                        className="h-8 rounded-lg text-xs"
                                        onClick={() => setChartRange('week')}
                                    >Weekly</Button>
                                    <Button
                                        variant={chartRange === 'month' ? 'default' : 'ghost'}
                                        size="sm"
                                        className="h-8 rounded-lg text-xs"
                                        onClick={() => setChartRange('month')}
                                    >Monthly</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[250px]">
                                {studentAttendanceData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={studentAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis hide domain={[0, 1]} />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white p-2 rounded-xl border shadow-premium text-xs font-bold">
                                                                {payload[0].value === 1 ? '🎉 Present' : '❌ Absent'}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar dataKey="status" radius={[4, 4, 0, 0]}>
                                                {studentAttendanceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.status === 1 ? '#0D9488' : '#F43F5E'} fillOpacity={0.8} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground italic">
                                        No attendance records found for this period.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function KpiCard({ title, value, icon: Icon, color, label }: any) {
    const colorMap: any = {
        primary: 'from-slate-700 to-slate-900 shadow-slate-200',
        secondary: 'from-teal-500 to-teal-700 shadow-teal-100',
        accent: 'from-indigo-500 to-indigo-700 shadow-indigo-100'
    };

    return (
        <Card className="group relative overflow-hidden bg-white/40 border-transparent hover:border-slate-200 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${colorMap[color]} text-white shadow-xl group-hover:scale-110 transition-transform`}>
                    <Icon size={14} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-extrabold text-slate-800 tracking-tight">{value}</div>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{label}</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
    );
}
