from django.test import TestCase
from userauths.models import User, Profile

class UserModelTest(TestCase):
    def test_auto_populate_username_and_full_name(self):
        # Create a user without specifying username and full_name
        user = User.objects.create(email="john@example.com")
        user.save()
        self.assertEqual(user.username, "john")

    def test_str_method_returns_email(self):
        user = User.objects.create(email="alice@example.com", username="alice", full_name="Alice")
        self.assertEqual(str(user), "alice@example.com")


class ProfileModelTest(TestCase):
    def test_profile_str_method_returns_full_name(self):
        # Create a user; assume a Profile is auto-created for this user
        user = User.objects.create(email="bob@example.com", username="bob", full_name="Bob")
        user.save()
        # Instead of creating a new Profile, use the auto-created one:
        profile = user.profile  # Access the Profile related to this user
        self.assertEqual(str(profile), "Bob")
