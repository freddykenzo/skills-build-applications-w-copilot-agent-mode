from django.test import TestCase
from rest_framework.test import APIClient


class ApiRouteTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root_available(self):
        response = self.client.get("/api/")
        self.assertEqual(response.status_code, 200)

    def test_users_endpoint_available(self):
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 200)
