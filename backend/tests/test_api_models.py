from django.test import TestCase
from userauths.models import User, Profile
from api.models import Course, Variant, Notification, EnrolledCourse, Teacher, CartOrderItem

class CourseModelTest(TestCase):
    def setUp(self):
        teacher_user = User.objects.create(email="teacher@test.com", username="teacher", full_name="Teacher Test")
        self.teacher = Teacher.objects.create(user=teacher_user)
        self.course = Course.objects.create(title="Test Course", teacher=self.teacher, language="English", level="Beginner", slug="test-course")
    def test_course_creation(self):
        self.assertEqual(self.course.title, "Test Course")
        self.assertEqual(self.course.teacher, self.teacher)
        self.assertEqual(self.course.language, "English")
        self.assertEqual(self.course.level, "Beginner")
        self.assertEqual(self.course.slug, "test-course")

class VariantModelTest(TestCase):
    def setUp(self):
        teacher_user = User.objects.create(email="teacher2@test.com", username="teacher2", full_name="Teacher Two")
        self.teacher = Teacher.objects.create(user=teacher_user)
        self.course = Course.objects.create(title="Course Two", teacher=self.teacher, language="French", level="Intermediate", slug="course-two")
        self.variant = Variant.objects.create(course=self.course, title="Lecture Session 1")
    def test_variant_creation(self):
        self.assertEqual(self.variant.course, self.course)
        self.assertEqual(self.variant.title, "Lecture Session 1")

class NotificationModelTest(TestCase):
    def setUp(self):
        self.student = User.objects.create(email="student4@test.com", username="student4", full_name="Student Four")
        teacher_user = User.objects.create(email="teacher4@test.com", username="teacher4", full_name="Teacher Four")
        self.teacher = Teacher.objects.create(user=teacher_user)
        self.course = Course.objects.create(title="Course Four", teacher=self.teacher, language="English", level="Advanced", slug="course-four")
    def test_notification_creation(self):
        notification = Notification.objects.create(user=self.student, teacher=self.teacher, type="New Order")
        self.assertEqual(notification.teacher, self.teacher)
        self.assertEqual(notification.user, self.student)
        self.assertEqual(notification.type, "New Order")
