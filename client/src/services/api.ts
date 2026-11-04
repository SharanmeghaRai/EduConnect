const BASE_URL = '/api/v1';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('educonnect_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('educonnect_token', token);
    } else {
      localStorage.removeItem('educonnect_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('educonnect_token');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      // Attempt token refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers.set('Authorization', `Bearer ${this.getToken()}`);
        const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
        });
        const retryData = await retryRes.json();
        if (!retryRes.ok) throw new Error(retryData.error?.message || 'Request failed');
        return retryData.data;
      }
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/csv')) {
      return (await res.text()) as unknown as T;
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }
    return data.data;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.data?.accessToken) {
        this.setToken(data.data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // --- API MODULES ---
  auth = {
    google: (credential: string) =>
      this.request<{ user: any; accessToken: string }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      }),
    demoLogin: (type: 'student' | 'admin') =>
      this.request<{ user: any; accessToken: string }>('/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ type }),
      }),
    login: (email: string, password?: string) =>
      this.request<{ user: any; accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (data: {
      name: string;
      email: string;
      password?: string;
      role?: string;
      department?: string;
      rollNumber?: string;
    }) =>
      this.request<{ user: any; accessToken: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () => {
      this.setToken(null);
      return this.request('/auth/logout', { method: 'POST' });
    },
    me: () => this.request<{ user: any }>('/auth/me'),
  };

  students = {
    onboarding: (data: any) =>
      this.request('/students/onboarding', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    dashboard: () => this.request<any>('/students/dashboard'),
    updateProfile: (data: any) =>
      this.request('/students/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    notifications: {
      list: () =>
        this.request<{ notifications: import('../types/index.js').NotificationItem[]; unreadCount: number }>(
          '/students/notifications'
        ),
      markRead: (id: string) =>
        this.request(`/students/notifications/${id}/read`, { method: 'PUT' }),
      markAllRead: () =>
        this.request('/students/notifications/read-all', { method: 'PUT' }),
    },
    leaderboard: (params?: { category?: string; department?: string; sortBy?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<{
        leaderboard: import('../types/index.js').LeaderboardEntry[];
        currentUserRank: import('../types/index.js').LeaderboardEntry | null;
        totalParticipants: number;
        streakSummary?: import('../types/index.js').StreakSummary;
      }>(`/students/leaderboard${query ? `?${query}` : ''}`);
    },
  };

  search = (q: string) =>
    this.request<import('../types/index.js').GlobalSearchResult>(`/search?q=${encodeURIComponent(q)}`);

  exams = {
    list: (params?: { category?: string; difficulty?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<{ exams: any[] }>(`/exams${query ? `?${query}` : ''}`);
    },
    get: (id: string) => this.request<{ exam: any }>(`/exams/${id}`),
    start: (id: string) =>
      this.request<any>(`/exams/${id}/start`, { method: 'POST' }),
    syncAnswer: (attemptId: string, data: any) =>
      this.request<any>(`/exams/attempts/${attemptId}/sync`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    submit: (attemptId: string) =>
      this.request<any>(`/exams/attempts/${attemptId}/submit`, {
        method: 'POST',
      }),
    getReview: (attemptId: string) =>
      this.request<any>(`/exams/attempts/${attemptId}/review`),
    myAttempts: (examId?: string) =>
      this.request<{ attempts: any[] }>(
        `/exams/user/my-attempts${examId ? `?examId=${examId}` : ''}`
      ),
  };

  jobs = {
    list: (params?: { jobType?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<{ jobs: any[] }>(`/jobs${query ? `?${query}` : ''}`);
    },
    get: (id: string) => this.request<{ job: any }>(`/jobs/${id}`),
    toggleBookmark: (id: string) =>
      this.request<any>(`/jobs/${id}/bookmark`, { method: 'POST' }),
    trackClick: (id: string) =>
      this.request<any>(`/jobs/${id}/track-click`, { method: 'POST' }),
    report: (id: string, reason: string) =>
      this.request<any>(`/jobs/${id}/report`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
  };

  materials = {
    list: (params?: { category?: string; subCategory?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<{ materials: any[] }>(`/materials${query ? `?${query}` : ''}`);
    },
    referencePdfs: () =>
      this.request<{ resources: any[] }>('/reference-resources'),
    toggleProgress: (id: string, isCompleted: boolean) =>
      this.request<any>(`/materials/${id}/progress`, {
        method: 'POST',
        body: JSON.stringify({ isCompleted }),
      }),
    toggleBookmark: (id: string) =>
      this.request<any>(`/materials/${id}/bookmark`, { method: 'POST' }),
  };

  newsletters = {
    list: () => this.request<{ newsletters: any[] }>('/newsletters'),
    get: (id: string) => this.request<{ newsletter: any }>(`/newsletters/${id}`),
    subscribe: (isSubscribed: boolean) =>
      this.request<any>('/newsletters/subscribe', {
        method: 'POST',
        body: JSON.stringify({ isSubscribed }),
      }),
  };

  aiNewsletters = {
    listRecent: () =>
      this.request<{
        newsletters: import('../types/index.js').AiNewsletter[];
        stats: {
          totalRecentDays: number;
          todayDate: string;
          latestDispatchTime: string;
          nextScheduledDispatch: string;
          cronSchedule: string;
          updateFrequency: string;
        };
      }>('/ai-newsletters/recent'),
    get: (id: string) =>
      this.request<{
        newsletter: import('../types/index.js').AiNewsletter;
        navigation: {
          prevEditionId: string | null;
          nextEditionId: string | null;
          currentIndex: number;
          total: number;
        };
      }>(`/ai-newsletters/${id}`),
    triggerDaily: () =>
      this.request<{ newsletter: import('../types/index.js').AiNewsletter }>(
        '/ai-newsletters/trigger-daily',
        { method: 'POST' }
      ),
    subscribe: (isSubscribed: boolean) =>
      this.request<any>('/ai-newsletters/subscribe', {
        method: 'POST',
        body: JSON.stringify({ isSubscribed }),
      }),
  };

  chat = {
    listSessions: () => this.request<{ sessions: any[] }>('/chat/sessions'),
    getMessages: (sessionId: string) =>
      this.request<{ messages: any[] }>(`/chat/sessions/${sessionId}/messages`),
    explainQuestion: (questionId: string) =>
      this.request<{ questionId: string; explanation: string }>('/chat/explain-question', {
        method: 'POST',
        body: JSON.stringify({ questionId }),
      }),
    feedback: (messageId: string, rating: number) =>
      this.request('/chat/feedback', {
        method: 'POST',
        body: JSON.stringify({ messageId, rating }),
      }),
  };

  admin = {
    analytics: () => this.request<any>('/admin/analytics'),
    students: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return this.request<{ students: any[]; total: number }>(`/admin/students?${query}`);
    },
    studentDetails: (id: string) => this.request<{ student: any }>(`/admin/students/${id}`),
    toggleStudentStatus: (id: string, isActive: boolean) =>
      this.request(`/admin/students/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      }),
    createExam: (data: any) =>
      this.request('/admin/exams', { method: 'POST', body: JSON.stringify(data) }),
    updateExam: (id: string, data: any) =>
      this.request(`/admin/exams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteExam: (id: string) =>
      this.request(`/admin/exams/${id}`, { method: 'DELETE' }),
    bulkUploadMCQs: (examId: string, csvContent: string) =>
      this.request(`/admin/exams/${examId}/bulk-csv`, {
        method: 'POST',
        body: JSON.stringify({ csvContent }),
      }),
    createJob: (data: any) =>
      this.request('/admin/jobs', { method: 'POST', body: JSON.stringify(data) }),
    updateJob: (id: string, data: any) =>
      this.request(`/admin/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteJob: (id: string) =>
      this.request(`/admin/jobs/${id}`, { method: 'DELETE' }),
    createMaterial: (data: any) =>
      this.request('/admin/materials', { method: 'POST', body: JSON.stringify(data) }),
    deleteMaterial: (id: string) =>
      this.request(`/admin/materials/${id}`, { method: 'DELETE' }),
    broadcastSession: (data: {
      title: string;
      message: string;
      type?: string;
      link?: string;
      sessionDate?: string;
      sessionTime?: string;
      meetingUrl?: string;
    }) =>
      this.request<{ broadcastCount: number; message: string }>('/admin/broadcast-session', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    createNewsletter: (data: any) =>
      this.request('/admin/newsletters', { method: 'POST', body: JSON.stringify(data) }),
    publishNewsletter: (id: string) =>
      this.request(`/admin/newsletters/${id}/publish`, { method: 'POST' }),
    addQuestion: (examId: string, data: any) =>
      this.request<{ question: any }>(`/admin/exams/${examId}/questions`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateQuestion: (questionId: string, data: any) =>
      this.request<{ question: any }>(`/admin/questions/${questionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteQuestion: (questionId: string) =>
      this.request(`/admin/questions/${questionId}`, { method: 'DELETE' }),
    auditLogs: () => this.request<{ logs: any[] }>('/admin/audit-logs'),
    exportCSV: () => this.request<string>('/admin/reports/cohort-export'),
    performance: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return this.request<{
        summary: {
          totalStudents: number;
          totalAttempts: number;
          cohortAverageScore: number;
          cohortAverageAccuracy: number;
          cohortPassRate: number;
          topDepartment: string;
          filteredCount: number;
        };
        exams: any[];
        departments: string[];
        studentCards: any[];
        attempts: any[];
        total: number;
      }>(`/admin/performance${query ? `?${query}` : ''}`);
    },
    attemptDetails: (attemptId: string) =>
      this.request<{
        attempt: any;
        topicBreakdown: Array<{
          topic: string;
          totalQuestions: number;
          correctCount: number;
          accuracyPercentage: number;
          totalMarks: number;
        }>;
      }>(`/admin/attempts/${attemptId}/details`),
    exportMarksCSV: (params?: any) => {
      const query = new URLSearchParams(params).toString();
      return this.request<string>(`/admin/reports/marks-export${query ? `?${query}` : ''}`);
    },
  };
}

export const api = new ApiClient();
