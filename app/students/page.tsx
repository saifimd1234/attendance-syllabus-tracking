"use client";
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaSearch, FaTrash, FaUserGraduate, FaChevronRight } from 'react-icons/fa';
import AddStudentModal from '@/components/AddStudentModal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function StudentsPage() {
    const { students, fetchStudents, deleteStudent, stats, fetchStats, user, isAuthChecking } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchStats();
    }, []);

    // Authorization: Remove student auto-redirect to allow browsing

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculateMonthlyAttendance = (studentId: string) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const isoDate = thirtyDaysAgo.toISOString().split('T')[0];

        const studentRecords = stats.attendance.filter(r =>
            (r.studentId?._id || r.studentId) === studentId && r.date >= isoDate
        );

        if (studentRecords.length === 0) return { percentage: "N/A", lateCount: 0 };
        const present = studentRecords.filter(r => r.status === 'Present').length;
        const lateCount = studentRecords.filter(r => r.status === 'Late').length;
        return {
            percentage: `${Math.round((present / studentRecords.length) * 100)}%`,
            lateCount
        };
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            await deleteStudent(id);
            toast.success('Student deleted');
        }
    }

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
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Students</h1>
                    <p className="text-muted-foreground">Manage your class roster.</p>
                </div>
                {user?.admin && (
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                        <FaPlus /> Add Student
                    </Button>
                )}
            </div>

            <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <Input
                    placeholder="Search by name..."
                    className="pl-10 bg-white/50 backdrop-blur-sm border-slate-200 focus:border-accent/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {filteredStudents.map((student) => {
                        const sid = (student.id || student._id) as string;
                        const { percentage, lateCount } = calculateMonthlyAttendance(sid);
                        const isExcessiveLate = lateCount > 3;

                        return (
                            <motion.div
                                key={sid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <Card
                                    className={`group relative overflow-hidden transition-all duration-500 ${isExcessiveLate
                                        ? 'border-red-200/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                                        : 'bg-white/40 border-transparent hover:border-slate-200'
                                        }`}
                                    style={isExcessiveLate ? {
                                        backgroundColor: `rgba(239, 68, 68, ${Math.min(0.1 + (lateCount - 3) * 0.05, 0.4)})`,
                                        backdropFilter: 'blur(8px)'
                                    } : {}}
                                >
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isExcessiveLate ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <FaUserGraduate size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{student.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{student.class}</span>
                                                <span>•</span>
                                                <span className={`font-bold ${isExcessiveLate ? 'text-red-700' : 'text-teal-600'}`}>{percentage}</span>
                                                {lateCount > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isExcessiveLate ? 'bg-red-200 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {lateCount} Late
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {user?.admin && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(sid)}
                                            >
                                                <FaTrash size={14} />
                                            </Button>
                                        )}
                                        <Link href={`/students/${sid}`}>
                                            <Button variant="ghost" size="icon" className="text-primary">
                                                <FaChevronRight />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                    {isExcessiveLate && (
                                        <div className="absolute top-2 right-2 flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                            <span className="text-[10px] font-black text-red-700 uppercase tracking-tighter">Warning</span>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {!filteredStudents.length && (
                <div className="text-center py-20 text-muted-foreground">
                    No students found. Add one to get started!
                </div>
            )}

            <AddStudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
