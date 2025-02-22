import requests
from bs4 import BeautifulSoup
import re
from functools import lru_cache
from supabase import create_client, Client
import os

class CollegeScraper:
    def __init__(self):
        self.supabase_url = os.getenv('https://okyogpnugkodivswzllg.supabase.co')
        self.supabase_key = os.getenv('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reW9ncG51Z2tvZGl2c3d6bGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzODMxNjMsImV4cCI6MjA1NDk1OTE2M30.XdjZLoXR9Vtg1aLVhKohuK1tnBVcQimXmbMTm3N5C_A')
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.cache = {}

    async def get_college_info(self):
        try:
            # Fetch data from Supabase knowledge_base table
            response = self.supabase.table('knowledge_base').select("*").execute()
            
            if not response.data:
                return self._get_fallback_info()

            # Organize the data by category
            organized_data = {
                'about': [],
                'courses': [],
                'admissions': [],
                'facilities': [],
                'programs': [],
                'policies': [],
                'contact': []
            }

            for item in response.data:
                category = item['category']
                if category in organized_data:
                    organized_data[category].append({
                        'topic': item['topic'],
                        'content': item['content']
                    })

            return {
                'about': self._format_about(organized_data['about']),
                'courses': self._format_courses(organized_data['programs']),
                'admissions': self._format_admissions(organized_data['admissions']),
                'facilities': self._format_facilities(organized_data['facilities']),
                'policies': self._format_policies(organized_data['policies']),
                'contact': self._format_contact(organized_data['contact'])
            }
        except Exception as e:
            print(f"Error fetching data from Supabase: {e}")
            return self._get_fallback_info()

    def _format_about(self, data):
        about_info = next((item for item in data if item['topic'] == 'about'), None)
        return about_info['content'] if about_info else "Information about B.K. Birla College"

    def _format_courses(self, data):
        courses = []
        for program in data:
            if program['topic'] in ['ba_programs', 'bsc_programs', 'bcom_programs', 'ma_programs', 'msc_programs']:
                courses.extend(self._extract_courses_from_content(program['content']))
        return courses

    def _format_admissions(self, data):
        return {
            'process': next((item['content'] for item in data if item['topic'] == 'process'), ''),
            'requirements': next((item['content'] for item in data if item['topic'] == 'eligibility_ug'), ''),
            'deadlines': next((item['content'] for item in data if item['topic'] == 'deadlines'), '')
        }

    def _format_facilities(self, data):
        facilities = []
        for facility in data:
            facilities.extend(self._extract_facilities_from_content(facility['content']))
        return facilities

    def _extract_courses_from_content(self, content):
        return [line.strip('- ') for line in content.split('\n') if line.strip().startswith('-')]

    def _extract_facilities_from_content(self, content):
        return [line.strip('- ') for line in content.split('\n') if line.strip().startswith('-')]

    def _get_fallback_info(self):
        # Fallback information in case of database connection issues
        return {
            'about': "B.K. Birla College is located at Birla College Campus Rd, Gauripada, Kalyan, Maharashtra 421301",
            'courses': ["Please contact the college for current course offerings"],
            'admissions': {
                'process': "Please visit the college website for admission process",
                'requirements': "Please contact admission office for requirements",
                'deadlines': "Please check college website for current deadlines"
            },
            'facilities': ["Please visit the college for facility information"]
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