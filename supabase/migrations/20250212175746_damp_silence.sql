/*
  # Add detailed college information

  1. New Data
    - Director's message
    - Computer Science department faculty
    - Chairman's message
    - Admission rules and regulations
    - Admission general information

  2. Changes
    - Add new entries to knowledge_base table
*/

-- Add Director's Message
INSERT INTO knowledge_base (category, topic, content) VALUES
('about', 'directors_message', 'We firmly believe that education is the key to a nation''s progress. Our institution is built upon a solid foundation of the values, that aims to promote holistic education and culture in all aspects in order to achieve and fulfil the mission statement that we believe in. The College offers several new-age skill-based academic programs catering to the needs of the industry and endeavours to comfort the students with all the necessary knowledge and skills to succeed in their chosen fields. Our students have the opportunity to participate in a variety of co-curricular and extracurricular activities, such as NCC, NSS, sports, various associations, clubs, etc. With a repute of being excellent and honored with numerous accolades, we try to maintain the highest academic standards, promote discipline, and provide holistic education.');

-- Add Computer Science Faculty
INSERT INTO knowledge_base (category, topic, content) VALUES
('faculty', 'computer_science', 'Computer Science Department Faculty:
- Vinod Rajput (Head of Department) - M.Sc. Computer Science, Coordinator M.Sc. A.I
- Ashwini Kulkarni - B.E, MCA
- Kajal Jaisinghani - M.Sc. Information Technology, M.A. Economics, Coordinator BSc Data Science
- Pritam Kamble - M.E. Computer Science, UGC NET
- Esmita Gupta - Vice Principal, M.E., M.B.A., M.C.A, Coordinator M.Sc. Data Science and Big Data Analytics
- Hemangi Talele - M.Sc. Computer Science, SET
And more experienced faculty members dedicated to computer science education.');

-- Add Admission Rules
INSERT INTO knowledge_base (category, topic, content) VALUES
('admissions', 'cancellation_rules', 'Admission Cancellation Rules:
- Prior to term start: Rs 500/- deduction
- Up to 20 days after term start: 20% fee deduction
- 21-50 days after term start: 30% fee deduction
- 51-80 days or until Aug 31st: 50% fee deduction
- Sept 1st to Sept 30th: 60% fee deduction
- After Sept 30th: 100% fee deduction');

-- Add Detailed Admission Information
INSERT INTO knowledge_base (category, topic, content) VALUES
('admissions', 'eligibility_detailed', 'Undergraduate Course Eligibility:
- B.A./B.Com./B.Sc.: Standard XII pass from Maharashtra State Board or equivalent
- BMS: XII pass with 45% (Open) or 40% (Reserved)
- B.Com (Accounting & Finance): XII pass with 45% aggregate (40% Reserved)
- B.Sc. (Computer Science): XII with Mathematics and Statistics
- B.Sc. (IT): XII with Mathematics, 45% (Open) or 40% (Reserved)
- B.Sc. (Biotechnology): XII with Mathematics

Postgraduate Courses:
- M.A., M.Com., M.Sc.: Merit-based admission as per University norms
- M.Sc. Environmental Science & Bioanalytical Science: Entrance examination required');