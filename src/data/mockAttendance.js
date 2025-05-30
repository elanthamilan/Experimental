// src/data/mockAttendance.js
export const mockAttendance = [
  // Student student001 (Alice)
  // Course c1: Target 30% attendance (3/10)
  { studentId: 'student001', courseId: 'c1', date: '2024-04-01', status: 'Present' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-02', status: 'Present' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-03', status: 'Absent' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-04', status: 'Present' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-05', status: 'Absent' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-08', status: 'Absent' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-09', status: 'Absent' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-10', status: 'Absent' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-11', status: 'Absent' },
  { studentId: 'student001', courseId: 'c1', date: '2024-04-12', status: 'Absent' }, // 3 Present / 10 Total = 30%

  // Course c2: Target 80% attendance (8/10)
  { studentId: 'student001', courseId: 'c2', date: '2024-04-01', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-02', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-03', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-04', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-05', status: 'Absent' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-08', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-09', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-10', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-11', status: 'Present' },
  { studentId: 'student001', courseId: 'c2', date: '2024-04-12', status: 'Absent' }, // 8 Present / 10 Total = 80%

  // Student student002 (Bob)
  // Course c1: Target 90% attendance (9/10)
  { studentId: 'student002', courseId: 'c1', date: '2024-04-01', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-02', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-03', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-04', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-05', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-08', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-09', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-10', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-11', status: 'Present' },
  { studentId: 'student002', courseId: 'c1', date: '2024-04-12', status: 'Absent' }, // 9 Present / 10 Total = 90%

  // Course c3: Target 60% attendance (6/10)
  { studentId: 'student002', courseId: 'c3', date: '2024-04-01', status: 'Present' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-02', status: 'Absent' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-03', status: 'Present' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-04', status: 'Absent' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-05', status: 'Present' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-08', status: 'Present' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-09', status: 'Absent' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-10', status: 'Present' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-11', status: 'Present' },
  { studentId: 'student002', courseId: 'c3', date: '2024-04-12', status: 'Absent' }, // 6 Present / 10 Total = 60%
  
  // Student student003 (Charlie)
  // Course c1: Target 100% attendance (10/10)
  { studentId: 'student003', courseId: 'c1', date: '2024-04-01', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-02', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-03', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-04', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-05', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-08', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-09', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-10', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-11', status: 'Present' },
  { studentId: 'student003', courseId: 'c1', date: '2024-04-12', status: 'Present' }, // 10 Present / 10 Total = 100%

  // Course c2: Target 10% attendance (1/10)
  { studentId: 'student003', courseId: 'c2', date: '2024-04-01', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-02', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-03', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-04', status: 'Present' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-05', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-08', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-09', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-10', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-11', status: 'Absent' },
  { studentId: 'student003', courseId: 'c2', date: '2024-04-12', status: 'Absent' }, // 1 Present / 10 Total = 10%

  // Student student004 (Diana) - For varied data, not strictly above/below 35% for all
  // Course c4: Target 50% attendance (5/10)
  { studentId: 'student004', courseId: 'c4', date: '2024-04-01', status: 'Present' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-02', status: 'Absent' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-03', status: 'Present' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-04', status: 'Absent' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-05', status: 'Present' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-08', status: 'Absent' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-09', status: 'Present' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-10', status: 'Absent' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-11', status: 'Present' },
  { studentId: 'student004', courseId: 'c4', date: '2024-04-12', status: 'Absent' }, // 5 Present / 10 Total = 50%

  // Course c5: Target 33% attendance (approx, 4/12)
  { studentId: 'student004', courseId: 'c5', date: '2024-03-01', status: 'Present' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-04', status: 'Absent' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-05', status: 'Present' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-06', status: 'Absent' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-07', status: 'Absent' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-08', status: 'Present' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-11', status: 'Absent' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-12', status: 'Absent' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-13', status: 'Present' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-14', status: 'Absent' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-15', status: 'Absent' },
  { studentId: 'student004', courseId: 'c5', date: '2024-03-18', status: 'Absent' }, // 4 Present / 12 Total = 33.33%
];
