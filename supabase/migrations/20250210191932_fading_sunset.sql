/*
  # Add comprehensive college data

  1. Changes
    - Add detailed college information to knowledge_base table
    - Organize data into clear categories and topics
    - Include all academic programs, facilities, and policies

  2. Data Structure
    - Each entry contains:
      - category: Main classification (e.g., 'programs', 'facilities', 'policies')
      - topic: Specific subject area
      - content: Detailed information
*/

-- Programs: Undergraduate
INSERT INTO knowledge_base (category, topic, content) VALUES
('programs', 'ba_programs', 'Bachelor of Arts (B.A.) Programs include:
- B.A. General (English, Hindi, Marathi, History, Political Science, Economics, Geography, Philosophy)
- B.A. Mass Media & Communication
- B.A. Management Studies - Sports Management
- B.A. Management Studies - Event Management & Public Relations
Eligibility: 12th Pass from any stream. Duration: 3 years'),

('programs', 'bsc_programs', 'Bachelor of Science (B.Sc.) Programs include:
- B.Sc. General (Physics, Chemistry, Maths, Biology, Zoology, Botany, Microbiology, Biotechnology)
- B.Sc. Computer Science
- B.Sc. Information Technology
- B.Sc. Data Science
- B.Sc. Biotechnology
- B.Sc. Integrative Nutrition & Dietetics
- B.Sc. Interior Design
Eligibility varies by program, generally requires 12th Science. Duration: 3 years'),

('programs', 'bcom_programs', 'Bachelor of Commerce (B.Com.) Programs include:
- B.Com. General
- B.Com. Accounting & Finance (BAF)
- B.Com. Banking & Insurance (BBI)
- B.Com. Financial Management (BFM)
Eligibility: 12th Pass (Commerce). Duration: 3 years'),

-- Programs: Postgraduate
('programs', 'ma_programs', 'Master of Arts (M.A.) Programs available in:
- Hindi
- Marathi
- Political Science
- History
- Business Economics
- Mass Media & Communication
Eligibility: Any Graduate. Duration: 2 years'),

('programs', 'msc_programs', 'Master of Science (M.Sc.) Programs include:
- Physics, Chemistry, Botany, Zoology
- Computer Science
- Information Technology
- Artificial Intelligence
- Data Science & Big Data Analytics
- Finance
- Environmental Science
- Industrial Biotechnology
Eligibility: B.Sc. in relevant subject. Duration: 2 years'),

-- College Information
('college', 'about', 'B.K. Birla College, established in 1972, is affiliated with the University of Mumbai and accredited with an A++ grade by NAAC (CGPA 3.51). The college holds ISO 9001:2015 certification and is recognized as a College of Excellence by UGC.'),

('college', 'campus', 'The campus spans 20 acres in Kalyan featuring:
- 72 classrooms (50% smart classrooms)
- 3D Studio for interactive learning
- Green Library with digital resources
- Sustainability initiatives including rainwater harvesting
- ETP and STP facilities
- Eco-friendly transportation with 25 sponsored cycles'),

('facilities', 'library', 'The Green Library features:
- Over 79,000 books
- 1,130 audio-visual materials
- 114 periodicals
- Institutional memberships with Inflibnet and Delnet
- Robust IT infrastructure
- Digital and traditional resources'),

('facilities', 'laboratories', 'State-of-the-art laboratories include:
- NABL-accredited Environmental Sciences Lab
- Computer Science labs
- Biotechnology research facilities
- Physics and Chemistry labs
- Language lab'),

-- Admissions
('admissions', 'process', 'Admission Process:
1. Pre-Admission Registration at bkbirlacollegekalyan.com/admissions
2. Fill Mumbai University Portal registration
3. Submit application and documents
4. Check merit list at bkbirlacollegekalyan.com/notices
5. Complete fee payment via cimsstudent.mastersofterp.in
6. Report to college with documents'),

('admissions', 'eligibility_ug', 'Undergraduate Eligibility:
- Arts: 12th pass from any stream
- Science: 12th Science with relevant subjects
- Commerce: 12th pass with minimum 45% (General) or 40% (Reserved)
- Professional courses like BMS/BCA require specific subject combinations'),

('admissions', 'eligibility_pg', 'Postgraduate Eligibility:
- M.Sc.: B.Sc. in relevant subject with minimum 46 credits
- M.Com.: B.Com./BMS/BBA with minimum 45%
- M.A.: Graduation in any stream
- Entrance tests may be required for specific programs'),

-- Rules and Policies
('policies', 'general_rules', 'General Rules:
- Mandatory ID card display
- No loitering in corridors
- No unauthorized fund collection
- No unauthorized picnics
- Zero tolerance for ragging
- Mobile phones restricted in classrooms
- Parking at own risk
- Photography requires permission'),

('policies', 'academic', 'Academic Policies:
- Mandatory ABC ID generation (NEP 2020)
- Regular attendance required
- Internal assessment guidelines
- Anti-plagiarism policy
- Research ethics guidelines'),

('contact', 'information', 'Contact Information:
Address: Birla College Campus Rd, Gauripada, Kalyan, Maharashtra 421301
Phone: 0251 223 1294
Email: admissionhelpdesk@bkbirlacollegekalyan.com
Website: www.bkbirlacollegekalyan.com
Student Portal: cimsstudent.mastersofterp.in');