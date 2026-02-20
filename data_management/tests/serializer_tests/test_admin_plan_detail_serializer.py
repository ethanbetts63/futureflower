import pytest
from data_management.serializers.admin_plan_detail_serializer import AdminPlanDetailSerializer
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.subscription_plan_factory import SubscriptionPlanFactory
from events.tests.factories.event_factory import EventFactory
from events.tests.factories.flower_type_factory import FlowerTypeFactory

@pytest.mark.django_db
def test_admin_plan_detail_serializer_upfront_plan():
    """
    Test that AdminPlanDetailSerializer correctly serializes an UpfrontPlan.
    """
    flower = FlowerTypeFactory(name="Lily")
    plan = UpfrontPlanFactory(years=5, budget=50.00)
    plan.preferred_flower_types.add(flower)
    
    # Create associated events
    event1 = EventFactory(order=plan, delivery_date="2023-01-01", status="delivered")
    event2 = EventFactory(order=plan, delivery_date="2023-02-01", status="scheduled")
    
    serializer = AdminPlanDetailSerializer(plan)
    data = serializer.data
    
    assert data['id'] == plan.id
    assert data['plan_type'] == 'upfront'
    assert data['years'] == 5
    assert data['subscription_message'] is None
    assert "Lily" in data['preferred_flower_types']
    assert len(data['events']) == 2
    # Check ordering of events
    assert data['events'][0]['id'] == event1.id
    assert data['events'][1]['id'] == event2.id
    assert float(data['budget']) == 50.00

@pytest.mark.django_db
def test_admin_plan_detail_serializer_subscription_plan():
    """
    Test that AdminPlanDetailSerializer correctly serializes a SubscriptionPlan.
    """
    plan = SubscriptionPlanFactory(subscription_message="Hello World", budget=75.00)
    
    serializer = AdminPlanDetailSerializer(plan)
    data = serializer.data
    
    assert data['id'] == plan.id
    assert data['plan_type'] == 'subscription'
    assert data['years'] is None
    assert data['subscription_message'] == "Hello World"
    assert float(data['budget']) == 75.00
