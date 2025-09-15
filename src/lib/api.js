// Mock API service for Athena LMS Super Admin Dashboard
// This provides placeholder endpoints that can be easily replaced with real API calls

// Mock data
const mockOrganizations = [
  {
    id: '1',
    name: 'Creditor Academy',
    subscriptionType: 'Annual',
    totalUsers: 250,
    maxUsers: 300,
    instructors: 15,
    learners: 235,
    allotedTokens: 50000,
    // usedTokens: 32500,
    storageUsed: 85.6,
    status: 'Active',
    createdAt: '2023-01-15',
    lastPayment: '2024-01-15',
    nextBilling: '2025-01-15',
    subOrganizations: 3
  },
  {
    id: '2',
    name: 'Organization : 2',
    subscriptionType: 'Monthly',
    totalUsers: 180,
    maxUsers: 300,
    instructors: 8,
    learners: 172,
    allotedTokens: 50000,
    // usedTokens: 18750,
    storageUsed: 45.3,
    status: 'Active',
    createdAt: '2023-06-20',
    lastPayment: '2024-08-20',
    nextBilling: '2024-09-20',
    subOrganizations: 2
  },
  {
    id: '3',
    name: 'Organization : 3',
    subscriptionType: 'Annual',
    totalUsers: 320,
    maxUsers: 300,
    instructors: 12,
    learners: 308,
    allotedTokens: 50000,
    // usedTokens: 42750,
    storageUsed: 92.8,
    status: 'Active',
    createdAt: '2022-11-03',
    lastPayment: '2024-11-03',
    nextBilling: '2025-11-03',
    subOrganizations: 4
  },
  {
    id: '4',
    name: 'Organization : 4',
    subscriptionType: 'Monthly',
    totalUsers: 156,
    maxUsers: 300,
    instructors: 6,
    learners: 150,
    allotedTokens: 50000,
    // usedTokens: 4500,
    storageUsed: 34.2,
    status: 'Trial',
    createdAt: '2024-08-15',
    lastPayment: '',
    nextBilling: '2024-09-15',
    subOrganizations: 1
  },
  {
    id: '5',
    name: 'Organization : 5',
    subscriptionType: 'Annual',
    totalUsers: 290,
    maxUsers: 300,
    instructors: 10,
    learners: 280,
    allotedTokens: 50000,
    // usedTokens: 35000,
    storageUsed: 67.4,
    status: 'Active',
    createdAt: '2023-03-10',
    lastPayment: '2024-03-10',
    nextBilling: '2025-03-10',
    subOrganizations: 2
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const api = {
  /*
  // REAL API CLIENT (axios) TEMPLATE — Uncomment and replace mocks below when backend is ready
  // 1) Install axios: npm i axios
  // 2) Set VITE_API_BASE_URL in .env.local (e.g., https://api.example.com)
  // 3) Replace functions below to use http client

  import axios from 'axios';
  const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
  });
  http.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  async getOrganizations() {
    const { data } = await http.get('/api/organizations');
    return data;
  },
  async updateOrganizationStatus(id, status) {
    await http.post(`/api/organizations/${id}/status`, { status });
  },
  async deleteOrganization(id) {
    await http.delete(`/api/organizations/${id}`);
  },
  async getOrganizationOverview(id) {
    const { data } = await http.get(`/api/organizations/${id}`);
    return data;
  },
  async getUsers(organizationId) {
    const { data } = await http.get(`/api/organizations/${organizationId}/users`);
    return data;
  },
  async getAdmins(organizationId) {
    const { data } = await http.get(`/api/organizations/${organizationId}/admins`);
    return data;
  },
  async getBillingRecords() {
    const { data } = await http.get('/api/billing/records');
    return data;
  },
  async getInvoiceHistory(organizationId) {
    const { data } = await http.get(`/api/organizations/${organizationId}/invoices`);
    return data;
  },
  async sendReminder({ organizationId, subject, message, adminIds }) {
    const { data } = await http.post(`/api/organizations/${organizationId}/reminders`, { subject, message, adminIds });
    return data;
  },
  async getGlobalOverview() {
    const { data } = await http.get('/api/overview/global');
    return data;
  },
  async getApiResponseTime() {
    const { data } = await http.get('/api/metrics/api-response-time');
    return data;
  },
  */
  // Global metrics
  async getGlobalMetrics() {
    await delay(500);
    const totalOrgs = mockOrganizations.length;
    const totalUsers = mockOrganizations.reduce((sum, org) => sum + org.totalUsers, 0);
    const totalInstructors = mockOrganizations.reduce((sum, org) => sum + org.instructors, 0);
    const totalLearners = mockOrganizations.reduce((sum, org) => sum + org.learners, 0);
    const totalTokens = mockOrganizations.reduce((sum, org) => sum + org.allotedTokens, 0);
    
    return {
      totalOrganizations: totalOrgs,
      totalUsers,
      totalInstructors,
      totalLearners,
      totalCourses: totalTokens,
      activeUsers: Math.floor(totalUsers * 0.68), // 68% active rate
      monthlyGrowth: 12.5,
      revenue: 245000
    };
  },

  // Organizations
  async getOrganizations() {
    await delay(800);
    return [...mockOrganizations];
  },

  async getOrganization(id) {
    await delay(300);
    return mockOrganizations.find(org => org.id === id) || null;
  },

  async updateOrganizationStatus(id, status) {
    await delay(500);
    const org = mockOrganizations.find(o => o.id === id);
    if (org) {
      org.status = status;
    }
  },

  async deleteOrganization(id) {
    await delay(400);
    const index = mockOrganizations.findIndex(o => o.id === id);
    if (index !== -1) {
      mockOrganizations.splice(index, 1);
    }
    // In real implementation, this would call your backend API
    console.log(`Deleted organization ${id}`);
  },

  // Users
  async getUsers(organizationId) {
    await delay(700);
    // Mock user data based on organizations
    const users = [];
    mockOrganizations.forEach(org => {
      // Generate mock users for each org
      for (let i = 0; i < Math.min(org.totalUsers, 20); i++) {
        const isAdmin = i === 0; // First user is admin
        const isInstructor = i > 0 && i <= org.instructors;
        const role = isAdmin ? 'Admin' : (isInstructor ? 'Instructor' : 'Learner');
        users.push({
          id: `${org.id}-user-${i}`,
          name: `${isAdmin ? 'Admin' : (isInstructor ? 'Prof.' : '')} User ${i + 1}`,
          email: `user${i + 1}@${org.name.toLowerCase().replace(/\s+/g, '')}.com`,
          role,
          organizationId: org.id,
          organizationName: org.name,
          lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: Math.random() > 0.1 ? 'Active' : 'Inactive',
          createdAt: org.createdAt
        });
      }
    });
    
    return organizationId 
      ? users.filter(user => user.organizationId === organizationId)
      : users;
  },

  // Admins for an organization
  async getAdmins(organizationId) {
    const users = await this.getUsers(organizationId);
    return users.filter(u => u.role === 'Admin');
  },

  // Send reminder emails to selected admins
  async sendReminder({ organizationId, subject, message, adminIds }) {
    await delay(700);
    if (!organizationId || !subject || !message || !Array.isArray(adminIds)) {
      throw new Error('Invalid payload for sendReminder');
    }
    // Mock: pretend some emails could fail very rarely
    const failedIds = adminIds.filter(() => Math.random() < 0.02);
    const successCount = adminIds.length - failedIds.length;
    console.log(
      `Sent reminder to ${successCount}/${adminIds.length} admins of org ${organizationId} with subject "${subject}"`
    );
    return {
      success: true,
      sent: successCount,
      failed: failedIds.length,
      failedIds
    };
  },

  // Global overview across many metrics
  async getGlobalOverview() {
    await delay(300);
    const organizations = [...mockOrganizations];
    const storageUsedTotal = organizations.reduce((sum, org) => sum + org.storageUsed, 0);
    const storageByOrg = organizations.map(org => ({ id: org.id, name: org.name, storageUsed: org.storageUsed }));
    const totalUsers = organizations.reduce((sum, org) => sum + org.totalUsers, 0);
    const totalSubOrganizations = organizations.reduce((sum, org) => sum + (org.subOrganizations || 0), 0);

    // Revenue assumptions based on plan type
    const monthlyPrice = 999;
    const annualPrice = 9999;
    const revenueMonthly = organizations
      .filter(o => o.subscriptionType === 'Monthly')
      .reduce((sum) => sum + monthlyPrice, 0);
    const revenueAnnual = organizations
      .filter(o => o.subscriptionType === 'Annual')
      .reduce((sum) => sum + annualPrice, 0);
    const revenueTotal = revenueMonthly + revenueAnnual;

    // Collect all users (mock cap applies as in getUsers)
    const allUsers = await this.getUsers();
    const allUserEmails = allUsers.map(u => u.email);
    const allUsernames = allUsers.map(u => u.name);
    const allUserRoles = allUsers.map(u => ({ id: u.id, role: u.role }));
    const allUserStatuses = allUsers.map(u => ({ id: u.id, status: u.status }));

    return {
      organizations: organizations.map(o => ({ id: o.id, name: o.name })),
      storageUsedTotal,
      storageByOrg,
      totalUsers,
      totalSubOrganizations,
      revenueTotal,
      revenueMonthly,
      revenueAnnual,
      allUserEmails,
      allUsernames,
      allUserRoles,
      allUserStatuses,
    };
  },

  // Per-organization metrics bundle
  async getOrganizationOverview(organizationId) {
    await delay(250);
    const org = mockOrganizations.find(o => o.id === organizationId);
    if (!org) throw new Error('Organization not found');

    return {
      id: org.id,
      name: org.name,
      storageUsed: org.storageUsed,
      totalUsers: org.totalUsers,
      instructors: org.instructors,
      learners: org.learners,
      subscriptionType: org.subscriptionType,
      nextBilling: org.nextBilling,
      lastPayment: org.lastPayment || null,
      status: org.status,
      subOrganizations: org.subOrganizations || 0,
    };
  },

  // Invoice history per organization
  async getInvoiceHistory(organizationId) {
    await delay(300);
    const org = mockOrganizations.find(o => o.id === organizationId);
    if (!org) throw new Error('Organization not found');

    const baseAmount = org.subscriptionType === 'Annual' ? 9999 : 999;
    // Generate mock historical invoices
    const months = org.subscriptionType === 'Annual' ? 4 : 12;
    const invoices = Array.from({ length: months }).map((_, i) => {
      const date = new Date(org.createdAt);
      if (org.subscriptionType === 'Annual') {
        date.setFullYear(date.getFullYear() + i);
      } else {
        date.setMonth(date.getMonth() + i);
      }
      const paid = Math.random() > 0.1 || i < months - 1; // last period maybe unpaid
      return {
        id: `${organizationId}-inv-${i + 1}`,
        organizationId,
        organizationName: org.name,
        amount: baseAmount,
        status: paid ? 'Paid' : 'Overdue',
        paidDate: paid ? date.toISOString().split('T')[0] : null,
        dueDate: date.toISOString().split('T')[0],
        subscriptionType: org.subscriptionType,
      };
    });
    return invoices;
  },

  // Support tickets listing (mock)
  async getSupportTickets() {
    await delay(350);
    const priorities = ['Low', 'Medium', 'High', 'Urgent'];
    const tickets = [];
    mockOrganizations.forEach(org => {
      for (let i = 0; i < 5; i++) {
        tickets.push({
          id: `${org.id}-ticket-${i + 1}`,
          senderName: `User ${i + 1} ${org.name}`,
          organizationId: org.id,
          organizationName: org.name,
          receivedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          status: Math.random() > 0.7 ? 'Closed' : 'Open',
          subject: 'Support Inquiry',
        });
      }
    });
    return tickets;
  },

  // API response time (mock)
  async getApiResponseTime() {
    await delay(100);
    // Simulate a measured response time in ms
    return { responseTimeMs: Math.floor(120 + Math.random() * 480) };
  },

  // Courses
  async getCourses(organizationId) {
    await delay(600);
    const courses = [];
    mockOrganizations.forEach(org => {
      for (let i = 0; i < Math.min(10, 15); i++) {
        courses.push({
          id: `${org.id}-course-${i}`,
          title: `Course ${i + 1}: ${['Advanced Programming', 'Data Science', 'Web Development', 'AI & Machine Learning', 'Cybersecurity'][i % 5]}`,
          organizationId: org.id,
          organizationName: org.name,
          instructorName: `Instructor ${i + 1}`,
          enrollments: Math.floor(Math.random() * 200) + 20,
          status: ['Published', 'Draft', 'Archived'][Math.floor(Math.random() * 3)],
          createdAt: org.createdAt,
          lastUpdated: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      }
    });
    
    return organizationId 
      ? courses.filter(course => course.organizationId === organizationId)
      : courses;
  },

  async updateUserRole(userId, role) {
    await delay(300);
    // Mock implementation - in real app this would update the database
    console.log(`Updated user ${userId} role to ${role}`);
  },

  async updateUserStatus(userId, status) {
    await delay(300);
    // Mock implementation - in real app this would update the database
    console.log(`Updated user ${userId} status to ${status}`);
  },

  async deleteUser(userId) {
    await delay(300);
    // Mock implementation - in real app this would delete the user in the database
    console.log(`Deleted user ${userId}`);
  },

  // Billing
  async getBillingRecords() {
    await delay(400);
    return mockOrganizations.map(org => ({
      id: `bill-${org.id}`,
      organizationId: org.id,
      organizationName: org.name,
      amount: org.subscriptionType === 'Annual' ? 9999 : 999,
      status: org.status === 'Active' ? 'Paid' : 'Overdue',
      dueDate: org.nextBilling,
      paidDate: org.lastPayment || undefined,
      subscriptionType: org.subscriptionType
    }));
  },

  // User limit management - ready for backend integration
  async checkUserLimit(organizationId) {
    await delay(200);
    const org = mockOrganizations.find(o => o.id === organizationId);
    if (!org) {
      throw new Error('Organization not found');
    }
    
    const remainingSlots = org.maxUsers - org.totalUsers;
    return {
      canAddUser: remainingSlots > 0,
      currentUsers: org.totalUsers,
      maxUsers: org.maxUsers,
      remainingSlots: Math.max(0, remainingSlots)
    };
  },

  async updateUserLimit(organizationId, newLimit) {
    await delay(300);
    const org = mockOrganizations.find(o => o.id === organizationId);
    if (org) {
      org.maxUsers = newLimit;
    }
    // In real implementation, this would call your backend API
    console.log(`Updated organization ${organizationId} user limit to ${newLimit}`);
  },

  async validateUserAddition(organizationId) {
    await delay(200);
    const limitCheck = await this.checkUserLimit(organizationId);
    
    if (!limitCheck.canAddUser) {
      return {
        success: false,
        message: `Cannot add user. Organization has reached the maximum limit of ${limitCheck.maxUsers} users.`
      };
    }
    
    return {
      success: true,
      message: `User can be added. ${limitCheck.remainingSlots} slots remaining.`
    };
  }
};