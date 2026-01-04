import { create } from 'zustand';
import axios from 'axios';

export type Student = {
    id: string;
    _id?: string; // MongoDB ID
    name: string;
    class: string;
    school: string;
    status: string;
};

export type Chapter = {
    _id: string;
    title: string;
    status: 'Incomplete' | 'Ongoing' | 'Completed' | 'Revised Once' | 'Revised Twice';
    startDate?: string;
    endDate?: string;
    timeTaken?: number;
};

export type Subject = {
    _id: string;
    name: string;
    chapters: Chapter[];
};

export type SyllabusData = {
    studentId: string;
    subjects: Subject[];
};

export type User = {
    id: string;
    email: string;
    admin: boolean;
    studentId?: string;
};

type Store = {
    students: Student[];
    isLoading: boolean;
    isAuthChecking: boolean;
    user: User | null;
    fetchStudents: () => Promise<void>;
    stats: { totalStudents: number; attendance: any[] };
    fetchStats: () => Promise<void>;
    addStudent: (student: { name: string; class: string; school: string }) => Promise<void>;
    saveAttendance: (date: string, attendanceData: { studentId: string; status: string }[]) => Promise<void>;
    fetchAttendanceByDate: (date: string) => Promise<{ studentId: string; status: string }[]>;
    deleteStudent: (id: string) => Promise<void>;
    syllabus: SyllabusData | null;
    fetchSyllabus: (studentId: string) => Promise<void>;
    updateSyllabus: (studentId: string, payload: any) => Promise<void>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
};

export const useStore = create<Store>((set) => ({
    students: [],
    stats: { totalStudents: 0, attendance: [] },
    isLoading: false,
    isAuthChecking: true,
    user: null,

    checkAuth: async () => {
        set({ isAuthChecking: true });
        try {
            const res = await axios.get('/api/auth/me');
            set({ user: res.data.user });
        } catch (error) {
            set({ user: null });
        } finally {
            set({ isAuthChecking: false });
        }
    },

    logout: async () => {
        try {
            await axios.post('/api/auth/logout');
            set({ user: null });
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
        }
    },
    fetchStudents: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('/api/students');
            set({ students: res.data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },
    fetchStats: async () => {
        try {
            const res = await axios.get('/api/stats');
            set({ stats: res.data });
        } catch (error) {
            console.error(error);
        }
    },
    saveAttendance: async (date, attendanceData) => {
        set({ isLoading: true });
        try {
            await axios.post('/api/attendance', { date, attendanceData });
            // Refresh stats after save
            const res = await axios.get('/api/stats');
            set({ stats: res.data });
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    deleteStudent: async (id) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/api/students/${id}`);
            set((state) => ({ students: state.students.filter(s => (s.id || (s as any)._id) !== id) }));
            // Refresh stats
            const res = await axios.get('/api/stats');
            set({ stats: res.data });
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    addStudent: async (student) => {
        set({ isLoading: true });
        try {
            const res = await axios.post('/api/students', student);
            set((state) => ({ students: [...state.students, res.data] }));
            // Refresh stats
            const sRes = await axios.get('/api/stats');
            set({ stats: sRes.data });
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    fetchAttendanceByDate: async (date) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`/api/attendance?date=${date}`);
            return res.data;
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            set({ isLoading: false });
        }
    },
    syllabus: null,
    fetchSyllabus: async (studentId) => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`/api/syllabus/${studentId}`);
            set({ syllabus: res.data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },
    updateSyllabus: async (studentId, payload) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`/api/syllabus/${studentId}`, payload);
            set({ syllabus: res.data });
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));
