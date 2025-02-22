import requests
from bs4 import BeautifulSoup
import re
from functools import lru_cache

class CollegeScraper:
    def __init__(self):
        self.base_url = "https://bkbck.edu.in"
        self.college_address = "Birla College Campus Rd, Gauripada, Kalyan, Maharashtra 421301"
        self.cache_timeout = 3600  # 1 hour cache

    @lru_cache(maxsize=128)
    def get_page_content(self, url):
        try:
            response = requests.get(url, timeout=5)  # Add timeout
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def get_college_info(self):
        # Pre-defined information for faster response
        return {
            'about': f"B.K. Birla College is located at {self.college_address}. It is a premier educational institution committed to academic excellence and holistic development.",
            'courses': [
                "Bachelor of Science (BSc)",
                "Bachelor of Commerce (BCom)",
                "Bachelor of Arts (BA)",
                "Bachelor of Management Studies (BMS)",
                "Master of Science (MSc)",
                "Master of Commerce (MCom)",
                "PhD Programs"
            ],
            'admissions': {
                'process': "1. Online Application 2. Document Verification 3. Merit List 4. Payment of Fees",
                'requirements': "1. 10+2 Certificate 2. Entrance Exam Scores 3. Identity Proof 4. Address Proof",
                'deadlines': "Regular Admission: June-July | Management Quota: Based on Availability"
            },
            'facilities': [
                "Modern Laboratories",
                "Digital Library",
                "Sports Complex",
                "Research Centers",
                "Cafeteria",
                "Wi-Fi Campus",
                "Auditorium"
            ]
        }

    def _extract_about(self):
        soup = self.get_page_content(f"{self.base_url}/about-us")
        if not soup:
            return "Information about B.K. Birla College"
        # Extract about content from the page
        about_content = soup.find('div', class_='about-content')
        return about_content.text.strip() if about_content else "Information not available"

    def _extract_courses(self):
        soup = self.get_page_content(f"{self.base_url}/courses")
        if not soup:
            return []
        # Extract courses from the page
        courses_list = soup.find_all('div', class_='course-item')
        return [course.text.strip() for course in courses_list]

    def _extract_admissions(self):
        soup = self.get_page_content(f"{self.base_url}/admissions")
        if not soup:
            return {}
        # Extract admission information
        return {
            'process': self._get_text(soup, 'admission-process'),
            'requirements': self._get_text(soup, 'admission-requirements'),
            'deadlines': self._get_text(soup, 'admission-deadlines')
        }

    def _extract_facilities(self):
        soup = self.get_page_content(f"{self.base_url}/facilities")
        if not soup:
            return []
        # Extract facilities information
        facilities_list = soup.find_all('div', class_='facility-item')
        return [facility.text.strip() for facility in facilities_list]

    def _get_text(self, soup, class_name):
        element = soup.find(class_=class_name)
        return element.text.strip() if element else "Information not available"