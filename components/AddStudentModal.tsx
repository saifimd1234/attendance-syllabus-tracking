import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes, FaUserPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import toast from 'react-hot-toast';

export default function AddStudentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { addStudent } = useStore();
    const [formData, setFormData] = useState({ name: '', class: '', school: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addStudent(formData);

            toast.success('Student added successfully!');
            setFormData({ name: '', class: '', school: '' });
            onClose();
        } catch (error) {
            toast.error('Failed to add student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md"
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <FaUserPlus className="text-primary" /> Add New Student
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <FaTimes />
                                </Button>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input
                                            placeholder="e.g. John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">School Name</label>
                                        <Input
                                            placeholder="e.g. Green Valley High"
                                            value={formData.school}
                                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Class/Grade</label>
                                        <Input
                                            placeholder="e.g. Class 10 A"
                                            value={formData.class}
                                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                            required
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Add Student'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
