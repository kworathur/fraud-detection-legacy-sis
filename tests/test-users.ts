/**
 * Test user definitions for E2E tests.
 * Used by global-setup to create users and by tests to log in as them.
 *
 * Multiple students with different last names support testing advisor
 * assignment rules (e.g. LAST_NAME_RANGE A-F, G-M, N-Z).
 */

export const TEST_PASSWORD = 'E2eTest123!';

export interface TestUser {
    username: string;
    email: string;
    temporaryPassword: string;
    groups: string[];
    attributes?: Record<string, string>;
    student?: {
        id?: number;
        name: string;
        email: string;
        address: string;
        birthdate: string;
        level_of_study: 'BACHELORS' | 'MASTERS' | 'DOCTORAL';
    };
}

export const TEST_USERS: TestUser[] = [
    // ── Students (different last names for advisor assignment testing) ──
    {
        username: 'e2e-student-anderson',
        email: 'e2e-student-anderson@test.quaid.ai',
        temporaryPassword: TEST_PASSWORD,
        groups: [],
        attributes: { name: 'Alice Anderson' },
        student: {
            name: 'Alice Anderson',
            email: 'e2e-student-anderson@test.quaid.ai',
            address: '100 North Ave NW, Atlanta, GA 30332',
            birthdate: '2002-03-12',
            level_of_study: 'BACHELORS',
        },
    },
    {
        username: 'e2e-student-martinez',
        email: 'e2e-student-martinez@test.quaid.ai',
        temporaryPassword: TEST_PASSWORD,
        groups: [],
        attributes: { name: 'Charlie Martinez' },
        student: {
            name: 'Charlie Martinez',
            email: 'e2e-student-martinez@test.quaid.ai',
            address: '200 Bobby Dodd Way, Atlanta, GA 30332',
            birthdate: '2001-07-25',
            level_of_study: 'MASTERS',
        },
    },
    {
        username: 'e2e-student-williams',
        email: 'e2e-student-williams@test.quaid.ai',
        temporaryPassword: TEST_PASSWORD,
        groups: [],
        attributes: { name: 'Zara Williams' },
        student: {
            name: 'Zara Williams',
            email: 'e2e-student-williams@test.quaid.ai',
            address: '300 Ferst Dr, Atlanta, GA 30332',
            birthdate: '2003-11-08',
            level_of_study: 'BACHELORS',
        },
    },
    // ── Advisor ──
    {
        username: 'e2e-advisor',
        email: 'e2e-advisor@test.quaid.ai',
        temporaryPassword: TEST_PASSWORD,
        groups: ['advising-advisor'],
        attributes: { name: 'Jane Austen' },
    },
    // ── Admin ──
    {
        username: 'e2e-admin',
        email: 'e2e-admin@test.quaid.ai',
        temporaryPassword: TEST_PASSWORD,
        groups: ['advising-admin'],
        attributes: { name: 'E2E Admin' },
    },
];

/**
 * Get a test user by role. For students, returns the first student by default.
 * Use `getStudentByLastName` for specific students.
 */
export function getUserByRole(role: 'student' | 'advisor' | 'admin'): TestUser {
    if (role === 'student') {
        const student = TEST_USERS.find(
            (u) => u.groups.length === 0 && u.student
        );
        if (!student) throw new Error('No test student found');
        return student;
    }

    const groupMap: Record<string, string> = {
        advisor: 'advising-advisor',
        admin: 'advising-admin',
    };
    const user = TEST_USERS.find((u) => u.groups.includes(groupMap[role]));
    if (!user) throw new Error(`No test user found for role: ${role}`);
    return user;
}

/**
 * Get a specific student test user by last name (case-insensitive).
 */
export function getStudentByLastName(lastName: string): TestUser {
    const lower = lastName.toLowerCase();
    const user = TEST_USERS.find(
        (u) =>
            u.student && u.student.name.toLowerCase().split(' ').pop() === lower
    );
    if (!user)
        throw new Error(`No test student found with last name: ${lastName}`);
    return user;
}
