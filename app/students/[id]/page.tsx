"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import { useStore } from '@/store/useStore';
import { FaArrowLeft, FaUserGraduate, FaCalendarCheck, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

import SyllabusTab from '@/components/SyllabusTab';

export default function StudentProfile() {
    const params = useParams();
    const { id } = params as { id: string };
    const { user } = useStore();

    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'attendance' | 'syllabus'>('attendance');

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        school: '',
        class: '',
        status: ''
    });

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/students/${id}`);
                setStudentData(res.data);
                setEditForm({
                    name: res.data.student.name,
                    school: res.data.student.school,
                    class: res.data.student.class,
                    status: res.data.student.status
                });
            } catch (error: any) {
                console.error(error);
                if (error.response?.status === 403) {
                    toast.error("Forbidden: You cannot access this profile.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`/api/students/${id}`, editForm);
            setStudentData({ ...studentData, student: res.data });
            setIsEditing(false);
            toast.success("Profile updated!");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div className="p-8 text-center bg-transparent backdrop-blur-3xl min-h-screen">Loading profile...</div>;
    if (!studentData) return <div className="p-8 text-center">Student not found.</div>;

    const { student, history, stats } = studentData;

    // Students can view other profiles but cannot edit them

    // Transform history for chart
    const chartData = [...history].reverse().map((h: any) => ({
        date: h.date,
        value: h.status === 'Present' ? 1 : 0
    }));

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
            {user && (
                <Link href="/students">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:underline">
                        <FaArrowLeft /> Back to Students
                    </Button>
                </Link>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Card */}
                <Card className="w-full md:w-1/3 h-fit overflow-hidden relative group">
                    <div className="absolute top-4 right-4 z-10">
                        {(user?.admin || user?.studentId === id) && (
                            !isEditing ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 rounded-full shadow-lg bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <FaEdit size={14} className="text-primary" />
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0 rounded-full shadow-lg bg-white/80 backdrop-blur-sm"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <FaTimes size={14} className="text-destructive" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        className="h-8 w-8 p-0 rounded-full shadow-lg"
                                        onClick={handleUpdate}
                                    >
                                        <FaSave size={14} />
                                    </Button>
                                </div>
                            )
                        )}
                    </div>

                    <CardHeader className="text-center pb-2 relative">
                        <div className="w-24 h-24 mx-auto rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-4 border-4 border-white shadow-xl">
                            <FaUserGraduate size={40} />
                        </div>
                        {isEditing ? (
                            <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="text-center text-xl font-bold h-10 mb-2"
                                placeholder="Student Name"
                            />
                        ) : (
                            <CardTitle className="text-2xl font-black">{student.name}</CardTitle>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Academic Institution</span>
                                {isEditing ? (
                                    <Input
                                        value={editForm.school}
                                        onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                                        className="h-9"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 rounded-xl font-semibold border border-transparent hover:border-slate-200 transition-all">{student.school}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Grade / Class</span>
                                    {isEditing ? (
                                        <Input
                                            value={editForm.class}
                                            onChange={(e) => setEditForm({ ...editForm, class: e.target.value })}
                                            className="h-9"
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-50 rounded-xl font-semibold border border-transparent hover:border-slate-200 transition-all">{student.class}</div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Status</span>
                                    {isEditing ? (
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    ) : (
                                        <div className={`p-3 bg-slate-50 rounded-xl font-bold border border-transparent hover:border-slate-200 transition-all ${student.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                                            {student.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20 shadow-sm transition-transform hover:scale-105">
                                <div className="text-2xl font-black text-secondary">{stats.percentage}%</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attendance</div>
                            </div>
                            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm transition-transform hover:scale-105">
                                <div className="text-2xl font-black text-primary">{stats.present}/{stats.total}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Days Present</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Tabs & Content */}
                <div className="flex-1 space-y-6">
                    {/* Tabs Navigation */}
                    <div className="flex p-1 bg-slate-100/50 rounded-xl backdrop-blur-sm border border-white/20">
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'attendance' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            Attendance
                        </button>
                        <button
                            onClick={() => setActiveTab('syllabus')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'syllabus' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            Syllabus Tracking
                        </button>
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'attendance' ? (
                            <motion.div
                                key="attendance"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Attendance History</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#547792" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#547792" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                                <XAxis dataKey="date" hide />
                                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                                <Area type="step" dataKey="value" stroke="#547792" fill="url(#colorValue)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Logs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                            {history.map((record: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                                                    <div className="flex items-center gap-3">
                                                        <FaCalendarCheck className="text-muted-foreground" />
                                                        <span>{record.date}</span>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                                        record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                                            record.status === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="syllabus"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <SyllabusTab studentId={id} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
