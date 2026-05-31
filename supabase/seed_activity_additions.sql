-- ======================================================================
-- Additional event and announcement seed data for non-system organizations
-- ======================================================================

-- ---------- Acme events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Acme Q4 Planning Summit',
  'Leadership planning session for Q4 roadmap, staffing, and product milestones.',
  'Acme HQ — Strategy Room',
  '2026-11-18 09:00:00+08',
  '2026-11-18 12:00:00+08'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Acme Innovation Demo Day',
  'Internal showcase of team prototypes, workflow automation demos, and customer success case studies.',
  'Acme HQ — Innovation Hall',
  '2026-12-09 13:00:00+08',
  '2026-12-09 17:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Acme extra events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaf',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Acme Customer Advisory Council',
  'Quarterly feedback session with key customers, product managers, and leadership.',
  'Acme HQ — Conference Room B',
  '2026-09-17 09:00:00+08',
  '2026-09-17 11:30:00+08'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab0',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Acme Security Awareness Workshop',
  'Hands-on session covering phishing prevention, access hygiene, and incident reporting.',
  'Acme HQ — Training Room 2',
  '2026-10-23 13:00:00+08',
  '2026-10-23 15:00:00+08'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Acme Performance Review Clinic',
  'Manager clinic for preparing year-end performance reviews and calibration.',
  'Acme HQ — HR Suite',
  '2026-11-06 10:00:00+08',
  '2026-11-06 12:00:00+08'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab2',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Acme Roadmap Demo Review',
  'Review of product roadmap demos and release readiness for the next quarter.',
  'Acme HQ — Product Lab',
  '2026-11-28 14:00:00+08',
  '2026-11-28 16:00:00+08'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab3',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Acme Volunteer Day',
  'Company volunteer event supporting community clean-up and donation drive activities.',
  'City Community Center',
  '2026-12-19 08:00:00+08',
  '2026-12-19 12:00:00+08'
)
on conflict (id) do nothing;

-- ---------- ICPEP.SE extra events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e1313131-3131-3131-3131-313131313136',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP.SE Research Consultation Hours',
  'Open consultation hours for members preparing papers, theses, and capstone projects.',
  'CIT University — Engineering Lab 4',
  '2026-09-24 13:00:00+08',
  '2026-09-24 16:00:00+08'
),
(
  'e1313131-3131-3131-3131-313131313137',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP.SE Git & DevOps Bootcamp',
  'Bootcamp on Git workflows, CI/CD, and release automation for student developers.',
  'CIT University — Computer Labs Bldg 2',
  '2026-10-22 08:30:00+08',
  '2026-10-22 17:00:00+08'
),
(
  'e1313131-3131-3131-3131-313131313138',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP.SE Networking Night',
  'Evening networking event connecting students, alumni, and industry mentors.',
  'CIT University — Roof Deck Hall',
  '2026-11-14 18:00:00+08',
  '2026-11-14 21:00:00+08'
),
(
  'e1313131-3131-3131-3131-313131313139',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP.SE Final Project Showcase',
  'Demo day for final-year projects, capstone systems, and research prototypes.',
  'CIT University — AVR 3',
  '2026-12-03 09:00:00+08',
  '2026-12-03 15:00:00+08'
),
(
  'e1313131-3131-3131-3131-31313131313a',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP.SE Community Service Day',
  'Chapter-wide outreach activity for local schools and community partners.','CIT University — Offsite Outreach',
  '2026-12-20 07:30:00+08',
  '2026-12-20 13:30:00+08'
)
on conflict (id) do nothing;

-- ---------- CIT-U SSG extra events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e2020202-2020-2020-2020-202020202026',
  '20202020-2020-2020-2020-202020202020',
  'CIT-U Innovation Hackathon',
  'Student teams build solutions around campus services, student life, and sustainability.',
  'CIT University — Innovation Lab',
  '2026-09-18 08:00:00+08',
  '2026-09-19 18:00:00+08'
),
(
  'e2020202-2020-2020-2020-202020202027',
  '20202020-2020-2020-2020-202020202020',
  'Student Leadership Forum',
  'Forum for batch leaders and organization heads to align on student concerns and campus initiatives.',
  'CIT University — AVR 2',
  '2026-10-21 09:00:00+08',
  '2026-10-21 12:00:00+08'
),
(
  'e2020202-2020-2020-2020-202020202028',
  '20202020-2020-2020-2020-202020202020',
  'Campus Volunteer Drive',
  'Recruitment for volunteers supporting campus events, registration desks, and documentation.',
  'CIT University — Student Plaza',
  '2026-11-12 10:00:00+08',
  '2026-11-12 15:00:00+08'
),
(
  'e2020202-2020-2020-2020-202020202029',
  '20202020-2020-2020-2020-202020202020',
  'SSG Recognition Night',
  'Recognition program for outstanding student leaders, volunteers, and organization partners.',
  'CIT University — Grand Auditorium',
  '2026-12-11 18:00:00+08',
  '2026-12-11 21:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Tokyo Jujutsu extra events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e2121212-2121-2121-2121-212121212127',
  '21212121-2121-2121-2121-212121212121',
  'Third Years Curse Reconnaissance',
  'Advanced field reconnaissance exercise for third-year students and assigned faculty escorts.',
  'Tokyo Metropolitan Curse Technical College — Outer Grounds',
  '2026-09-26 08:00:00+08',
  '2026-09-26 14:00:00+08'
),
(
  'e2121212-2121-2121-2121-212121212128',
  '21212121-2121-2121-2121-212121212121',
  'Cursed Tool Maintenance Session',
  'Inventory and maintenance of cursed tools prior to winter deployment schedules.',
  'Tokyo Metropolitan Curse Technical College — Armory Hall',
  '2026-10-14 10:00:00+08',
  '2026-10-14 13:00:00+08'
),
(
  'e2121212-2121-2121-2121-212121212129',
  '21212121-2121-2121-2121-212121212121',
  'Sorcerer Strategy Seminar',
  'Seminar on barrier deployment strategy, rescue coordination, and mission communication.',
  'Tokyo Metropolitan Curse Technical College — Lecture Hall 1',
  '2026-11-21 09:30:00+08',
  '2026-11-21 12:30:00+08'
),
(
  'e2121212-2121-2121-2121-21212121212a',
  '21212121-2121-2121-2121-212121212121',
  'Winter Patrol Briefing',
  'Final briefing before winter patrol rotations begin across the Tokyo area.',
  'Tokyo Metropolitan Curse Technical College — War Room',
  '2026-12-09 16:00:00+08',
  '2026-12-09 18:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Acme extra announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaae',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Acme Engineering Hiring Sprint',
  'Engineering managers may submit new hiring requisitions for the 2027 planning cycle starting in late November. Review approvals will happen in December.',
  'Operations',
  '2026-10-28 09:00:00+08'
),
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaf',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Customer Success Roundtable',
  'A live roundtable with customer success, support, and product leadership to review service metrics and feedback themes.',
  'General',
  '2026-11-08 14:00:00+08'
),
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab0',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Acme Holiday Support Window',
  'Support coverage for critical systems will continue through the holiday season with reduced staffing and escalation procedures.',
  'Support',
  '2026-11-30 10:00:00+08'
),
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab1',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Infrastructure Maintenance Reminder',
  'Please note the scheduled infrastructure maintenance window for December 2026. Service owners should prepare validation steps in advance.',
  'Operations',
  '2026-12-02 09:30:00+08'
),
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab2',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Acme Year-End Town Hall',
  'All employees are invited to the year-end town hall for product updates, financial highlights, and a look ahead to 2027.',
  'General',
  '2026-12-18 15:00:00+08'
),
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaab3',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'New Benefits Enrollment Reminder',
  'Benefits enrollment for the 2027 cycle opens soon. Employees should review the updated plan options and deadlines before the portal opens.',
  'HR',
  '2026-12-22 11:00:00+08'
)
on conflict (id) do nothing;

-- ---------- ICPEP.SE extra announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1131313-1313-1313-1313-131313131318',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'ICPEP.SE Mentorship Program Launch',
  'The chapter is launching a mentorship program pairing junior members with senior students and alumni mentors.',
  'General',
  '2026-09-18 08:00:00+08'
),
(
  'a1131313-1313-1313-1313-131313131319',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'Paper Submission Deadline Extended',
  'The research symposium paper submission deadline has been extended by one week to accommodate more entries.',
  'Academic',
  '2026-09-24 10:00:00+08'
),
(
  'a1131313-1313-1313-1313-13131313131a',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'ICPEP.SE Alumni Panel Announcement',
  'A panel of alumni working in software, systems, and product engineering will speak during the October chapter meeting.',
  'General',
  '2026-10-11 09:00:00+08'
),
(
  'a1131313-1313-1313-1313-13131313131b',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'Chapter Lab Access Update',
  'Lab access policies are being updated for the final quarter of 2026. Members should review the new access schedule and safety reminders.',
  'Operations',
  '2026-11-05 13:30:00+08'
),
(
  'a1131313-1313-1313-1313-13131313131c',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'ICPEP.SE Holiday Tech Clinic',
  'Volunteers will host a holiday tech clinic focused on resume preparation, interview practice, and portfolio reviews.',
  'Academic',
  '2026-12-08 09:00:00+08'
)
on conflict (id) do nothing;

-- ---------- CIT-U SSG extra announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1202020-2020-2020-2020-202020202026',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'Campus Safety Drill Schedule',
  'A campus safety drill will be conducted across selected buildings in mid-October. Students and staff should follow official guidance during the drill.',
  'Campus Advisory',
  '2026-10-03 08:30:00+08'
),
(
  'a1202020-2020-2020-2020-202020202027',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'SSC and SSG Joint Forum',
  'Student councils will hold a joint forum to discuss transport, cafeteria, and classroom concerns.',
  'General',
  '2026-10-19 14:00:00+08'
),
(
  'a1202020-2020-2020-2020-202020202028',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'Volunteer Registration for Christmas Outreach',
  'Registration is now open for the annual Christmas outreach program. Volunteers will help with packing, logistics, and distribution.',
  'General',
  '2026-11-10 09:00:00+08'
),
(
  'a1202020-2020-2020-2020-202020202029',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'SSG Year-End Accomplishment Report',
  'The SSG will publish its end-of-year report highlighting projects, policy wins, and student service improvements.',
  'Reports',
  '2026-12-06 16:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Tokyo Jujutsu extra announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1212121-2121-2121-2121-212121212127',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'Night Patrol Assignments Posted',
  'Night patrol assignments for qualified sorcerers have been posted. Please confirm your availability and equipment checklist.',
  'Official',
  '2026-09-16 18:00:00+08'
),
(
  'a1212121-2121-2121-2121-212121212128',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212b-2121-212121212121',
  'Student Mission Safety Reminder',
  'All students are reminded to file mission reports promptly and never engage cursed spirits without authorization.',
  'Regulation',
  '2026-10-12 09:00:00+08'
),
(
  'a1212121-2121-2121-2121-212121212129',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'Special Grades Briefing Summary',
  'A summary of recent special-grade monitoring procedures has been circulated to all faculty and senior sorcerers.',
  'Official',
  '2026-11-07 11:00:00+08'
),
(
  'a1212121-2121-2121-2121-21212121212a',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212b-2121-212121212121',
  'Year-End Sorcerer Check-In',
  'Faculty are hosting individual year-end check-ins to review field performance, grades, and assignment readiness.',
  'General',
  '2026-12-14 10:00:00+08'
)
on conflict (id) do nothing;

-- ---------- ICPEP.SE events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e1313131-3131-3131-3131-313131313134',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP.SE Tech Talk Series: AI Systems',
  'Guest lecture on practical AI system design, deployment, and evaluation for student engineers.',
  'CIT University — Engineering AVR',
  '2026-10-08 14:00:00+08',
  '2026-10-08 16:30:00+08'
),
(
  'e1313131-3131-3131-3131-313131313135',
  '13131313-1313-1313-1313-131313131313',
  'ICPEP.SE Year-End Fellowship 2026',
  'Year-end fellowship and recognition program for chapter members, advisers, and graduating seniors.',
  'CIT University — Student Center',
  '2026-12-12 17:00:00+08',
  '2026-12-12 20:00:00+08'
)
on conflict (id) do nothing;

-- ---------- CIT-U SSG events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e2020202-2020-2020-2020-202020202024',
  '20202020-2020-2020-2020-202020202020',
  'CIT-U Mental Health Week Kickoff',
  'Campus-wide kickoff for student wellness activities, counseling booths, and peer support sessions.',
  'CIT University — Grand Plaza',
  '2026-10-05 08:00:00+08',
  '2026-10-05 10:00:00+08'
),
(
  'e2020202-2020-2020-2020-202020202025',
  '20202020-2020-2020-2020-202020202020',
  'SSG Year-End Assembly',
  'General assembly to review accomplishments, present reports, and recognize outstanding student leaders.',
  'CIT University — AVR 2',
  '2026-12-03 13:00:00+08',
  '2026-12-03 16:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Tokyo Jujutsu events ----------
insert into public.events (id, tenant_id, title, description, location, start_time, end_time)
values
(
  'e2121212-2121-2121-2121-212121212125',
  '21212121-2121-2121-2121-212121212121',
  'First Years Field Exercise',
  'Practical field exercise for first-year sorcerers focusing on teamwork, restraint, and curse response.',
  'Tokyo Metropolitan Curse Technical College — Training Grounds',
  '2026-10-22 09:00:00+08',
  '2026-10-22 15:00:00+08'
),
(
  'e2121212-2121-2121-2121-212121212126',
  '21212121-2121-2121-2121-212121212121',
  'Winter Barrier Inspection',
  'Inspection and reinforcement of barrier structures before the winter curse activity peak.',
  'Tokyo Metropolitan Curse Technical College — Perimeter',
  '2026-12-18 07:00:00+08',
  '2026-12-18 11:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Acme announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Acme Q4 Planning Is Underway',
  'Department heads should submit their Q4 goals, hiring requests, and operational risks by November 10, 2026. Planning meetings will be scheduled throughout the month.',
  'Operations',
  '2026-10-20 09:00:00+08'
),
(
  'a1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaad',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Holiday Schedule and Office Closure',
  'Acme offices will be closed on December 24 and 25, 2026. Teams should complete urgent tasks before the holiday shutdown window begins.',
  'General',
  '2026-12-15 11:00:00+08'
)
on conflict (id) do nothing;

-- ---------- ICPEP.SE announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1131313-1313-1313-1313-131313131316',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'ICPEP.SE Workshop Series Open for Registration',
  'Registration is now open for the 2026 workshop series covering cloud engineering, secure coding, and modern software architecture practices.',
  'Academic',
  '2026-09-10 08:00:00+08'
),
(
  'a1131313-1313-1313-1313-131313131317',
  '13131313-1313-1313-1313-131313131313',
  '14141414-1414-1414-1414-141414141414',
  'Chapter Elections and Officer Turnover',
  'Officer elections and turnover activities will take place in December. Nominations open to all active members in good standing.',
  'Governance',
  '2026-11-20 15:00:00+08'
)
on conflict (id) do nothing;

-- ---------- CIT-U SSG announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1202020-2020-2020-2020-202020202024',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'Tech Month Schedule Released',
  'CIT-U Tech Month activities, hackathons, and student showcases are now published. Check the student portal for section-specific schedules and registration links.',
  'Campus Advisory',
  '2026-09-15 09:00:00+08'
),
(
  'a1202020-2020-2020-2020-202020202025',
  '20202020-2020-2020-2020-202020202020',
  '20202020-2020-202a-2020-202020202020',
  'End-of-Year Student Assembly',
  'The SSG will hold its final assembly of 2026 on December 5 to present achievements, transition reports, and plans for the next academic year.',
  'General',
  '2026-11-25 10:00:00+08'
)
on conflict (id) do nothing;

-- ---------- Tokyo Jujutsu announcements ----------
insert into public.announcements (id, tenant_id, author_user_id, title, body, category, created_at)
values
(
  'a1212121-2121-2121-2121-212121212125',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212a-2121-212121212121',
  'Special Training Rotation for Grade 1 Sorcerers',
  'Grade 1 sorcerers will rotate through special training assignments and field support duties throughout October and November 2026.',
  'Official',
  '2026-09-28 08:00:00+08'
),
(
  'a1212121-2121-2121-2121-212121212126',
  '21212121-2121-2121-2121-212121212121',
  '21212121-2121-212b-2121-212121212121',
  'Winter Mission Briefing and Supply Check',
  'All active sorcerers must attend the winter mission briefing and verify cursed tool inventories before field deployment.',
  'Regulation',
  '2026-12-01 13:00:00+08'
)
on conflict (id) do nothing;
