# import pytest
# from django.conf import settings
# from users.utils.anonymize_user import anonymize_user
# from users.utils.hash_value import hash_value
# from users.tests.factories.user_factory import UserFactory
# from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
# from events.tests.factories.event_factory import EventFactory
# from events.models import UpfrontPlan, Event

# @pytest.mark.django_db
# def test_anonymize_user_full_process():
#     """
#     Tests the entire anonymize_user process, including:
#     - Deleting pending UpfrontPlans.
#     - Anonymizing active UpfrontPlans (hashing recipient PII, deleting undelivered events).
#     - Hashing user PII (first_name, last_name, email).
#     - Wiping original user PII.
#     - Deactivating the user account.
#     """
#     # 1. Arrange
#     # Create a user with some PII
#     user = UserFactory(
#         first_name="John",
#         last_name="Doe",
#         email="john@example.com"
#     )
    
#     # Create a pending UpfrontPlan (should be deleted)
#     pending_plan = UpfrontPlanFactory(user=user, status='pending_payment')
    
#     # Create an active UpfrontPlan (should be anonymized)
#     active_plan = UpfrontPlanFactory(
#         user=user, 
#         status='active',
#         recipient_first_name="Jane",
#         recipient_last_name="Smith",
#         recipient_street_address="123 Main St"
#     )
    
#     # Create events for the active plan
#     delivered_event = EventFactory(order=active_plan, status='delivered')
#     scheduled_event = EventFactory(order=active_plan, status='scheduled')

#     # 2. Act
#     anonymize_user(user)

#     # 3. Assert
#     # Assert pending plan was deleted
#     assert UpfrontPlan.objects.filter(pk=pending_plan.pk).count() == 0

#     # Assert active plan was anonymized
#     active_plan.refresh_from_db()
#     salt = getattr(settings, 'HASHING_SALT')
    
#     assert active_plan.recipient_first_name is None
#     assert active_plan.hash_recipient_first_name == hash_value("Jane", salt)
#     assert active_plan.recipient_last_name is None
#     assert active_plan.hash_recipient_last_name == hash_value("Smith", salt)
#     assert active_plan.recipient_street_address is None
#     assert active_plan.hash_recipient_street_address == hash_value("123 Main St", salt)

#     # Assert undelivered event was deleted, delivered event remains
#     assert Event.objects.filter(pk=delivered_event.pk).exists()
#     assert not Event.objects.filter(pk=scheduled_event.pk).exists()

#     # Assert user's own PII was wiped and they are inactive
#     user.refresh_from_db()
#     assert user.is_active is False
#     assert user.first_name == ""
#     assert user.last_name == ""
#     assert user.email == f"deleted_{user.pk}@deleted.com"
#     assert user.hash_first_name == hash_value("John", salt)
#     assert user.hash_last_name == hash_value("Doe", salt)
#     assert user.hash_email == hash_value("john@example.com", salt)
#     assert user.anonymized_at is not None
