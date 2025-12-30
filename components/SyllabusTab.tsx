import { useState, useEffect } from 'react';
import { useStore, Subject, Chapter } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaPlus, FaCheckCircle, FaBookOpen, FaLayerGroup } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    'Incomplete': '#94a3b8', // slate-400
    'Ongoing': '#f59e0b',    // amber-500
    'Completed': '#10b981',  // emerald-500
    'Revised Once': '#3b82f6', // blue-500
    'Revised Twice': '#8b5cf6' // violet-500
};

const STATUS_OPTIONS = ['Incomplete', 'Ongoing', 'Completed', 'Revised Once', 'Revised Twice'];

export default function SyllabusTab({ studentId }: { studentId: string }) {
    const { syllabus, fetchSyllabus, updateSyllabus, user } = useStore();
    const [newSubject, setNewSubject] = useState('');
    const [newChapters, setNewChapters] = useState<Record<string, string>>({}); // subjectId -> chapterTitle

    const isEditable = user?.admin || (user?.studentId === studentId);

    useEffect(() => {
        fetchSyllabus(studentId);
    }, [studentId]);

    const handleAddSubject = async () => {
        if (!newSubject.trim()) return;
        try {
            await updateSyllabus(studentId, {
                action: 'ADD_SUBJECT',
                subjectName: newSubject
            });
            setNewSubject('');
            toast.success('Subject added!');
        } catch (error) {
            toast.error('Failed to add subject');
        }
    };

    const handleAddChapter = async (subjectId: string) => {
        const title = newChapters[subjectId];
        if (!title?.trim()) return;
        try {
            await updateSyllabus(studentId, {
                action: 'ADD_CHAPTER',
                subjectId,
                chapterTitle: title
            });
            setNewChapters(prev => ({ ...prev, [subjectId]: '' }));
            toast.success('Chapter added!');
        } catch (error) {
            toast.error('Failed to add chapter');
        }
    };

    const handleStatusUpdate = async (subjectId: string, chapterId: string, status: string) => {
        try {
            await updateSyllabus(studentId, {
                action: 'UPDATE_STATUS',
                subjectId,
                chapterId,
                chapterStatus: status
            });
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const calculateProgress = (chapters: Chapter[]) => {
        if (!chapters.length) return 0;
        const completeCount = chapters.filter(c => ['Completed', 'Revised Once', 'Revised Twice'].includes(c.status)).length;
        return Math.round((completeCount / chapters.length) * 100);
    };

    // Prepare data for Overview Chart
    const overviewData = syllabus?.subjects.map(sub => ({
        name: sub.name,
        progress: calculateProgress(sub.chapters)
    })) || [];

    return (
        <div className="space-y-8">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Syllabus Overview</CardTitle>
                        <CardDescription>Progress per subject</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px] sm:h-[250px] p-2 sm:p-6">
                        {overviewData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={overviewData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="progress" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={16}>
                                        {/* Label list could go here */}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                No subjects added yet.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Add Subject</CardTitle>
                        <CardDescription>Create a new tracking track</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditable ? (
                            <>
                                <Input
                                    placeholder="Subject Name (e.g. Physics)"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                />
                                <Button onClick={handleAddSubject} className="w-full gap-2">
                                    <FaPlus size={12} /> Create Subject
                                </Button>
                            </>
                        ) : (
                            <div className="text-center py-4 text-muted-foreground text-sm italic">
                                Read-only mode
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Subjects List */}
            <div className="grid grid-cols-1 gap-6">
                {syllabus?.subjects.map((subject) => {
                    const progress = calculateProgress(subject.chapters);
                    const completed = subject.chapters.filter(c => ['Completed', 'Revised Once', 'Revised Twice'].includes(c.status)).length;
                    const pending = subject.chapters.length - completed;
                    const pieData = [
                        { name: 'Completed', value: completed },
                        { name: 'Pending', value: pending }
                    ];

                    return (
                        <motion.div key={subject._id} layout>
                            <Card className="overflow-hidden border-slate-200">
                                <div className="bg-slate-50 p-3 sm:p-4 border-b flex justify-between items-center">
                                    <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                                        <FaBookOpen className="text-teal-600 shrink-0" />
                                        <span className="truncate">{subject.name}</span>
                                    </h3>
                                    <Badge variant="outline" className="bg-white text-xs sm:text-base px-2 sm:px-3 py-0.5 sm:py-1 shrink-0">
                                        {progress}% Done
                                    </Badge>
                                </div>
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Charts & Info Side */}
                                        <div className="w-full md:w-1/3 p-4 sm:p-6 border-b md:border-b-0 md:border-r bg-slate-50/30 flex flex-row md:flex-col items-center justify-center gap-4">
                                            <div className="h-[100px] md:h-[150px] w-1/2 md:w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            innerRadius={30}
                                                            outerRadius={45}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            <Cell fill="#10b981" />
                                                            <Cell fill="#e2e8f0" />
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="text-center w-1/2 md:w-full">
                                                <div className="text-[10px] sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Chapters</div>
                                                <div className="text-xl sm:text-2xl font-black text-slate-800">{subject.chapters.length}</div>
                                            </div>
                                        </div>

                                        {/* Chapters List Side */}
                                        <div className="w-full md:w-2/3 p-4 sm:p-6 space-y-4">
                                            {/* Add Chapter */}
                                            {isEditable && (
                                                <div className="flex gap-2 mb-4">
                                                    <Input
                                                        placeholder="Chapter title..."
                                                        value={newChapters[subject._id] || ''}
                                                        onChange={(e) => setNewChapters(prev => ({ ...prev, [subject._id]: e.target.value }))}
                                                        className="bg-white h-9 text-sm"
                                                    />
                                                    <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => handleAddChapter(subject._id)}>
                                                        <FaPlus size={14} />
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="space-y-2 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                                {subject.chapters.map((chapter) => (
                                                    <div key={chapter._id} className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-xl border hover:shadow-sm transition-all">
                                                        <span className="font-semibold text-xs sm:text-sm text-slate-700 truncate mr-2">{chapter.title}</span>
                                                        <select
                                                            disabled={!isEditable}
                                                            className="text-[10px] sm:text-xs font-bold p-1 rounded-lg border-none focus:ring-1 focus:ring-offset-0 cursor-pointer outline-none bg-slate-50 disabled:cursor-default"
                                                            style={{
                                                                color: STATUS_COLORS[chapter.status as keyof typeof STATUS_COLORS] || '#64748b',
                                                                backgroundColor: `${STATUS_COLORS[chapter.status as keyof typeof STATUS_COLORS]}15`
                                                            }}
                                                            value={chapter.status}
                                                            onChange={(e) => handleStatusUpdate(subject._id, chapter._id, e.target.value)}
                                                        >
                                                            {STATUS_OPTIONS.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ))}
                                                {subject.chapters.length === 0 && (
                                                    <div className="text-center py-8 text-muted-foreground text-sm italic">
                                                        No chapters yet. Add one above!
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
