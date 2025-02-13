/*
  # Add additional college information

  1. New Content
    - Vision and Mission
    - Principal's Message
    - IT Faculty Achievements
    - Governing Council
    - Eco-Sensitive Campus Information

  2. Changes
    - Adds new entries to knowledge_base table
    - Preserves existing data structure
    - Maintains consistent categorization
*/

-- Add Vision and Mission
INSERT INTO knowledge_base (category, topic, content) VALUES
('about', 'vision', 'We aspire to be a premier institution of higher education, an inspiring Nodal Center, catering to the diverse needs of student fraternity, providing them State–of–the-Art facilities and a stimulating Teaching–Learning–Environment, to groom them into socially–responsible, excellent human resource.'),
('about', 'mission', 'To enable students to develop as intellectually alive, socially responsible citizens ever ready for continuous personal and professional growth.'),
('about', 'objectives', 'College Objectives:
- To unlock the multiple facets of the students and to facilitate realization of students'' potential for excellence.
- To provide them access to a comprehensive array of careers.
- To promote research culture in order to channelize their spirit of inquiry.
- To motivate the students for continuous personal and professional growth.
- To instill moral values to mould them into excellent human resource.
- To provide homely environment in the institution.
- To develop students into socially - responsible citizens.
- To attain still greater heights of glory and excellence.');

-- Add Principal's Message
INSERT INTO knowledge_base (category, topic, content) VALUES
('about', 'principals_message', 'Under the Autonomous Status, the College has introduced need-based job oriented programmes including M.Sc. Finance, Data Science, AI, and various other specialized courses. The College has a spacious eco-friendly campus spread over 20 acres with 2,14,887 sq. ft. of built-up area, including 72 classrooms with ICT facility, 50% being smart classrooms and one 3D studio. The college focuses on research with 24 faculty members as Ph.D. Guides and numerous publications in UGC Care and Peer Reviewed Journals. The faculty has contributed to 47 Patents (30 granted and 17 Published). The institution emphasizes green initiatives including STP, ETP, and solar power systems.');

-- Add IT Faculty Achievements
INSERT INTO knowledge_base (category, topic, content) VALUES
('faculty', 'it_achievements', 'Notable IT Faculty Achievements:

Esmita Gupta:
- Received ''Teacher of the Year Awards 2021'' at National level for E-Teaching and Learning
- Certificate of Recognition for Educationalist & Professional Award
- Class A award for e-Yantra Lab Setup Initiative from IIT Bombay

Swapna Nikale:
- Certificate of appreciation for IoT project guidance
- Certified Ethical Hacker by EC COUNCIL
- First responder of CopConnect, ISAC
- Best Research Paper Award at International Conference on Open Data Science');

-- Add Governing Council Information
INSERT INTO knowledge_base (category, topic, content) VALUES
('administration', 'governing_council', 'Governing Council Members:
- Shri O. R. Chitlange (Chairman)
- Shri Subodh Dave (Vice Chairman)
- Shri Yogesh R. Shah (Hon. Secretary)
- Mrs. Shilpa V. Shah (Treasurer)
And other distinguished members working towards the institution''s growth and development.');

-- Add Eco-Sensitive Campus Information
INSERT INTO knowledge_base (category, topic, content) VALUES
('facilities', 'eco_campus', 'B.K. Birla College maintains a sustainable campus through:
- Solar street lights
- Vermicomposting
- Rain water harvesting
- Gardening beds
- Vriksha Dindi program
- LED lighting
- "No Vehicle Day" twice a year
The campus promotes environmental awareness and sustainable practices in daily operations.');