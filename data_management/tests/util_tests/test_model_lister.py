import pytest
from data_management.utils.archive_db.model_lister import ModelLister
from django.apps import apps

@pytest.mark.django_db
class TestModelLister:

    def test_get_all_models_no_exclusions(self):
        lister = ModelLister()
        models = lister.get_all_models()

        expected_models = []
        for app_config in apps.get_app_configs():
            expected_models.extend(app_config.get_models())
            
        assert set(models) == set(expected_models)
        assert len(models) > 0

    def test_get_all_models_with_exclusions(self):
        apps_to_exclude = ['auth', 'admin', 'contenttypes']
        lister = ModelLister(app_labels_to_exclude=apps_to_exclude)
        models = lister.get_all_models()

        for model in models:
            assert model._meta.app_label not in apps_to_exclude

        user_model = apps.get_model('auth', 'User')
        assert user_model not in models

    def test_empty_exclusion_list(self):
        lister_none = ModelLister()
        lister_empty = ModelLister(app_labels_to_exclude=[])
        
        models_none = lister_none.get_all_models()
        models_empty = lister_empty.get_all_models()
        
        assert set(models_none) == set(models_empty)
