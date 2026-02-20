import pytest
from data_management.serializers.admin_event_serializer import AdminEventSerializer
from events.tests.factories.event_factory import EventFactory
from events.tests.factories.upfront_plan_factory import UpfrontPlanFactory
from events.tests.factories.flower_type_factory import FlowerTypeFactory

@pytest.mark.django_db
def test_admin_event_serializer_fields():
    """
    Test that AdminEventSerializer correctly serializes event and related order fields.
    """
    # Setup order with specific details
    flower1 = FlowerTypeFactory(name="Rose")
    flower2 = FlowerTypeFactory(name="Tulip")
    
    order = UpfrontPlanFactory(
        budget=100.00,
        recipient_first_name="Jane",
        recipient_last_name="Doe",
        delivery_notes="Leave at door",
    )
    order.preferred_flower_types.add(flower1, flower2)
    
    event = EventFactory(order=order)
    
    serializer = AdminEventSerializer(event)
    data = serializer.data
    
    assert data['id'] == event.id
    assert data['order_id'] == order.id
    assert float(data['budget']) == 100.00
    assert data['recipient_first_name'] == "Jane"
    assert data['recipient_last_name'] == "Doe"
    assert data['delivery_notes'] == "Leave at door"
    assert data['order_type'] == "Upfront Plan"
    assert "Rose" in data['preferred_flower_types']
    assert "Tulip" in data['preferred_flower_types']
    assert data['customer_email'] == order.user.email
