-- Add comprehensive college information
INSERT INTO knowledge_base (category, topic, content) VALUES
-- Vision & Mission
('about', 'vision', 'We aspire to be a premier institution of higher education, an inspiring Nodal Center, catering to the diverse needs of student fraternity, providing them State–of–the-Art facilities and a stimulating Teaching–Learning–Environment, to groom them into socially–responsible, excellent human resource.'),
('about', 'mission', 'To enable students to develop as intellectually alive, socially responsible citizens ever ready for continuous personal and professional growth.'),

-- Admission Information
('admissions', 'general_info', 'For admission to F. Y. B. A., F. Y. B. Com and F. Y. B. Sc. the student should have passed Standard XII Examination conducted by the Maharashtra State Board of Secondary and Higher Secondary education, Mumbai or an examination recognised as equivalent with subjects as may be specified by the University in Arts, Science and Commerce.'),
('admissions', 'bms_requirements', 'For admission to BMS Degree course the candidate should have passed Standard XII Examination with minimum 45% marks (40% for reserved category) at one and the same sitting.'),
('admissions', 'cancellation_rules', 'Prior to commencement of academic term: Rs 500/- Lump Sum
Up to 20 days after commencement: 20% of total fees
21-50 days after commencement: 30% of total fees
51-80 days after commencement: 50% of total fees
September 1st to 30th: 60% of total fees
After September 30th: 100% of total fees'),

-- Computer Science Faculty
('faculty', 'computer_science', 'Vinod Rajput - Head of Department, M.Sc. Computer Science, Coordinator, M.Sc. A.I
Ashwini Kulkarni - Assistant Professor, B.E, MCA
Kajal Jaisinghani - Assistant Professor, M.Sc. Information Technology
Pritam Kamble - Assistant Professor, M.E. Computer Science, UGC NET'),

-- IT Faculty Achievements
('faculty', 'it_achievements', 'Esmita Gupta - Received Teacher of the Year Awards 2021 at National level
Swapna Nikale - Certified Ethical Hacker by EC COUNCIL, Best Research Paper Award'),

-- Campus Information
('facilities', 'eco_sensitive', 'B.K. Birla College is committed to sustainability with solar street lights, vermicomposting, rain water harvesting, gardening beds, and LED lighting. The campus observes "No Vehicle Day" twice a year.'),

-- Leadership
('about', 'director_message', 'We firmly believe that education is the key to a nations progress. Our institution offers several new-age skill-based academic programs catering to industry needs. The College is spread over 20 acres with state-of-the-art facilities.'),
('about', 'principal_message', 'The College has introduced need-based job oriented programmes including M.Sc. Finance, Data Science, AI, and various other specialized courses. Research is an integral part with 24 faculty members as Ph.D. Guides.'),

-- Governing Council
('about', 'governing_council', 'Chairman: Shri O. R. Chitlange
Vice Chairman: Shri Subodh Dave
Hon. Secretary: Shri Yogesh R. Shah
Treasurer: Mrs. Shilpa V. Shah'),

-- Programs and Courses
('courses', 'undergraduate', 'B.A., B.Com, B.Sc., BMS, BCA, B.Sc. (IT), B.Sc. (Biotechnology), B.A.M.M.C.'),
('courses', 'postgraduate', 'M.A., M.Com, M.Sc. in Physics, Chemistry, Botany, Zoology, Microbiology, Biotechnology, Computer Science and Information Technology'),
('courses', 'vocational', 'B.VOC. Cyber Security and Forensics, Medical Laboratory Technology, Business Management and Entrepreneurial Development, Financial Market and Trading Operations');