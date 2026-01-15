import pytest
from data_management.serializers.faq_serializer import FaqSerializer
from data_management.tests.factories.faq_factory import FAQFactory

@pytest.mark.django_db
def test_faq_serializer():
    """
    Tests that the FaqSerializer correctly serializes an FAQ instance.
    """
    faq = FAQFactory()
    serializer = FaqSerializer(instance=faq)
    data = serializer.data

    assert data['question'] == faq.question
    assert data['answer'] == faq.answer
