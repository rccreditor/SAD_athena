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
    usedTokens: 32500,
    storageUsed: 85.6,
    status: 'Active',
    createdAt: '2023-01-15',
    lastPayment: '2024-01-15',
    nextBilling: '2025-01-15'
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
    usedTokens: 18750,
    storageUsed: 45.3,
    status: 'Active',
    createdAt: '2023-06-20',
    lastPayment: '2024-08-20',
    nextBilling: '2024-09-20'
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
    usedTokens: 42750,
    storageUsed: 92.8,
    status: 'Active',
    createdAt: '2022-11-03',
    lastPayment: '2024-11-03',
    nextBilling: '2025-11-03'
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
    usedTokens: 4500,
    storageUsed: 34.2,
    status: 'Trial',
    createdAt: '2024-08-15',
    lastPayment: '',
    nextBilling: '2024-09-15'
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
    usedTokens: 35000,
    storageUsed: 67.4,
    status: 'Active',
    createdAt: '2023-03-10',
    lastPayment: '2024-03-10',
    nextBilling: '2025-03-10'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const api = {
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