import React from 'react';
import { StyledContainer } from '../components';
import styles from './DashboardPage.module.scss';

const DashboardPage = () => {
  return (
    <StyledContainer fluid className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>🏠 DASHBOARD PAGE</h1>
      <p className={styles.pageSubtitle}>✅ You are now on the DASHBOARD page! Navigation is working!</p>
      <p className={styles.currentTime}>Current time: {new Date().toLocaleTimeString()}</p>

      {/*
        Conceptual Admin Dashboard Widget Ideas (Student Data Focused):

        1.  **Total Enrolled Students Widget:**
            *   **Display:** A large number representing the count of all students with an "Enrolled" status.
            *   **Data Source:** `mockStudents.filter(s => s.enrollmentStatus === 'Enrolled').length`
            *   **Interaction:** Clicking could navigate to the `StudentListPage` pre-filtered for "Enrolled" status.
            *   **Visualization:** Simple KPI display card.

        2.  **Enrollment Status Breakdown Widget:**
            *   **Display:** A pie chart or bar chart showing the distribution of students across different `enrollmentStatus` values (e.g., Enrolled, On Leave, Graduated, Withdrawn, Prospective).
            *   **Data Source:** Group and count students by `enrollmentStatus` from `mockStudents`.
            *   **Interaction:** Hovering over chart segments could show exact counts/percentages. Clicking a segment could navigate to `StudentListPage` pre-filtered for that status.
            *   **Visualization:** Pie Chart or Bar Chart.

        3.  **Students by Major Widget:**
            *   **Display:** A horizontal bar chart or a table showing the top 5-10 majors by student enrollment count.
            *   **Data Source:** Group and count students by `major` from `mockStudents`.
            *   **Interaction:** Clicking a major could navigate to `StudentListPage` pre-filtered for that major.
            *   **Visualization:** Horizontal Bar Chart or ranked Table.

        4.  **Academic Standing Overview Widget:**
            *   **Display:** A donut chart or bar chart showing the distribution of students across different `academicStanding` values (e.g., Good Standing, Academic Probation, Dean's List).
            *   **Data Source:** Group and count students by `academicStanding` from `mockStudents`.
            *   **Interaction:** Clicking a segment could navigate to `StudentListPage` pre-filtered for that academic standing.
            *   **Visualization:** Donut Chart or Bar Chart.

        5.  **Recent Admissions Widget (Optional Bonus):**
            *   **Display:** A small list showing the names and admission dates of the 5 most recently admitted students.
            *   **Data Source:** `mockStudents` sorted by `admissionDate` descending.
            *   **Interaction:** Clicking a student name could navigate to their profile.
            *   **Visualization:** List Group or small Table.
      */}
    </StyledContainer>
  );
};

export default DashboardPage;
