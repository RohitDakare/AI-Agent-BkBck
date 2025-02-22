import requests
from bs4 import BeautifulSoup
import re

class CollegeScraper:
    def __init__(self):
        self.base_url = "https://bkbck.edu.in"
        self.cache = {}

    def get_page_content(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def get_college_info(self):
        if 'college_info' in self.cache:
            return self.cache['college_info']

        soup = self.get_page_content(self.base_url)
        if not soup:
            return None

        info = {
            'about': self._extract_about(),
            'courses': self._extract_courses(),
            'admissions': self._extract_admissions(),
            'facilities': self._extract_facilities()
        }

        self.cache['college_info'] = info
        return info

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