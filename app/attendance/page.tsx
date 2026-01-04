"use client";
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSave, FaCheck, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Our simple wrapper
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function AttendancePage() {
    const { students, fetchStudents, saveAttendance, fetchAttendanceByDate, user, isAuthChecking } = useStore();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [hasExistingData, setHasExistingData] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        const loadExisting = async () => {
            setLoading(true);
            const data = await fetchAttendanceByDate(date);
            if (data && data.length > 0) {
                const mapped: Record<string, string> = {};
                data.forEach(r => mapped[r.studentId] = r.status);
                setAttendance(mapped);
                setHasExistingData(true);
            } else {
                setAttendance({});
                setHasExistingData(false);
            }
            setLoading(false);
        };
        loadExisting();
    }, [date]);

    const handleToggle = (studentId: string) => {
        setAttendance(prev => {
            const current = prev[studentId];
            let next = 'Present';
            if (current === 'Present') next = 'Absent';
            else if (current === 'Absent') next = 'Late';
            else if (current === 'Late') next = 'Present';
            return { ...prev, [studentId]: next };
        });
    };

    const markAll = (status: 'Present' | 'Absent' | 'Late') => {
        const newState: Record<string, string> = {};
        students.forEach(s => {
            const sid = (s.id || s._id) as string;
            newState[sid] = status;
        });
        setAttendance(newState);
    };

    const handleSave = async () => {
        if (hasExistingData) {
            const confirmOverwrite = confirm("Attendance already exists for this date. Do you want to overwrite it?");
            if (!confirmOverwrite) return;
        }

        setLoading(true);
        const payload = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status
        }));

        if (payload.length === 0) {
            toast.error("No attendance marked!");
            setLoading(false);
            return;
        }

        try {
            await saveAttendance(date, payload);
            toast.success("Attendance saved successfully!");
            setHasExistingData(true);
        } catch (error) {
            toast.error("Failed to save attendance.");
        } finally {
            setLoading(false);
        }
    };

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
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Attendance</h1>
                    <p className="text-muted-foreground">Mark attendance for {date}</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Calendar
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full sm:w-auto"
                    />
                    <Button onClick={handleSave} disabled={loading || !user?.admin} className="gap-2">
                        <FaSave /> {loading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>

            {user?.admin ? (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => markAll('Present')} className="text-teal-600 border-teal-200 hover:bg-teal-50/50">
                        Mark All Present
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => markAll('Absent')} className="text-red-600 border-red-200 hover:bg-red-50/50">
                        Mark All Absent
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => markAll('Late')} className="text-amber-600 border-amber-200 hover:bg-amber-50/50">
                        Mark All Late
                    </Button>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm flex items-center gap-2">
                    <FaCalendarAlt /> Attendance is read-only for students.
                </div>
            )}

            <div className="space-y-2">
                {students.map((student, index) => {
                    const studentId = (student.id || student._id) as string;
                    return (
                        <motion.div
                            key={studentId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={`transition-colors border-transparent hover:border-slate-200 ${user?.admin ? 'hover:bg-accent/10 cursor-pointer group' : 'cursor-default'}`}
                                onClick={() => user?.admin && handleToggle(studentId)}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{student.name}</h3>
                                        <p className="text-sm text-muted-foreground">{student.class}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${attendance[studentId] === 'Present' ? 'bg-teal-100 text-teal-700' :
                                        attendance[studentId] === 'Absent' ? 'bg-red-100 text-red-700' :
                                            attendance[studentId] === 'Late' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-400'
                                        }`}>
                                        {attendance[studentId] === 'Present' && <FaCheck />}
                                        {attendance[studentId] === 'Absent' && <FaTimes />}
                                        {attendance[studentId] === 'Late' && <FaCalendarAlt className="text-amber-600" />}
                                        <span>{attendance[studentId] || 'Mark'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
                {!students.length && <div className="text-center py-10 text-muted-foreground">No students found.</div>}
            </div>
        </div>
    );
}
