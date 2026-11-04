export const seedNewsletters = [
  {
    title: 'Placement Dispatch #14: The 2026 Tech Hiring Landscape & Strategy',
    editionNumber: 14,
    summary: 'Essential breakdown of active product hiring bar, the resurgence of system design in junior interviews, and tips for time-management in online tests.',
    targetAudience: 'All Final & Pre-Final Year Engineering Students',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    recipientCount: 1420,
    contentHtml: `
      <h2>Welcome to Issue #14: Navigating the 2026 Campus Drive</h2>
      <p>Dear Students,</p>
      <p>As the placement season enters its high-velocity window, we are observing a noticeable shift in candidate evaluation criteria across Tier-1 tech firms and global capability centres (GCCs).</p>
      
      <h3>1. Quantitative Screening Cut-offs Are Rising</h3>
      <p>Recruiters from firms like <strong>TCS Digital, Cognizant, and Oracle</strong> have recalibrated their online assessment cutoffs. In past years, answering 60% of quantitative aptitude questions was sufficient to qualify for technical rounds. Today, that threshold is closer to <strong>75% with zero negative marking errors</strong>.</p>
      <blockquote><strong>Action Item:</strong> Complete at least two full-length timed tests every week on EduConnect to lock in your calculation speed.</blockquote>

      <h3>2. Practical Knowledge Over Memorization</h3>
      <p>Technical interviewers are asking students to write raw SQL joins on whiteboard sessions rather than asking definitions of 3NF. Ensure you know the difference between <code>LEFT JOIN</code> and <code>INNER JOIN</code> when NULL keys are present.</p>

      <h3>3. Recommended Target of the Week</h3>
      <ul>
        <li>Solve 5 questions from the <em>Time, Speed & Distance</em> module.</li>
        <li>Review the <em>STAR Method Guide</em> before your scheduled mock interviews this Friday.</li>
      </ul>
      <p>Best regards,<br/><strong>University Placement Cell & Career Guidance Office</strong></p>
    `,
  },
  {
    title: 'Placement Dispatch #15: Cracking Behavioral Rounds & Resume Audits',
    editionNumber: 15,
    summary: 'Why behavioral elimination rates are up to 35% in final rounds, plus how to convert academic capstone projects into high-impact portfolio pieces.',
    targetAudience: 'All Registered Students',
    status: 'PUBLISHED',
    scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    recipientCount: 1560,
    contentHtml: `
      <h2>Issue #15: Don't Let Behavioral Rounds Derail Your Hard Work</h2>
      <p>Greetings future engineers,</p>
      <p>Our audit of last week's campus drive showed that nearly <strong>30% of candidates who cleared technical coding screens were rejected in the managerial/HR round</strong>. Here is how to ensure you stand out positively:</p>

      <h3>The XYZ Resume Framework</h3>
      <p>Stop writing generic bullet points like "Built an e-commerce website with React and Node." Instead, quantify impact:</p>
      <p><em>"Engineered a full-stack inventory portal using React and PostgreSQL, reducing query latency by 42% through connection pooling and indexing."</em></p>

      <h3>3 Questions You MUST Prepare:</h3>
      <ol>
        <li>"Walk me through a difficult bug you encountered and how you isolated it."</li>
        <li>"Tell me about a disagreement you had with a teammate during a group project."</li>
        <li>"Why our company, and what do you hope to learn in your first 90 days?"</li>
      </ol>
      <p>Good luck with your preparation!</p>
    `,
  },
];
