# User Anonymization Process Summary

This document summarizes the user anonymization process within the application, detailing the functionality of `users\utils\anonymize_user.py` and `users\views\delete_user_view.py`, and outlining when and where this process is utilized.

## `users\utils\anonymize_user.py` - The Anonymization Logic

The `anonymize_user` function in this module is the core utility responsible for the comprehensive deactivation and anonymization of user accounts. Its primary goal is to erase personally identifiable information (PII) while preserving necessary data in a non-identifiable format for analytical or auditing purposes. The process involves several critical steps:

1.  **Stripe Subscription Cancellation:** Before any user data is wiped, the function attempts to cancel all active Stripe subscriptions associated with the user. This is crucial for preventing further billing and is performed while the system still has access to the user's original Stripe customer ID.

2.  **Handling Upfront Plans:**
    *   Any `UpfrontPlan`s with a `status` of `pending_payment` that are linked to the user are completely deleted from the database.
    *   For `active` `UpfrontPlan`s, all associated events that have not yet been marked as `delivered` are deleted.
    *   Personally identifiable information of recipients (specifically `recipient_first_name` and `recipient_last_name`) within these active plans is first hashed using a `HASHING_SALT` defined in Django settings, and then the original PII fields are wiped (set to `None`).

3.  **Handling Subscription Plans:**
    *   Similar to upfront plans, `SubscriptionPlan`s with a `status` of `pending_payment` are deleted.
    *   For `active` `SubscriptionPlan`s:
        *   Any pending notifications related to events associated with these plans are cancelled.
        *   All associated events that have not yet been marked as `delivered` are deleted.
        *   Recipient PII (first and last names) within these plans is hashed and the original fields are wiped.

4.  **User PII Hashing and Wiping:**
    *   The user's own `first_name` and `last_name` fields are hashed into their respective `hash_` counterparts, and then the original fields are cleared (set to an empty string).
    *   The user's `email` is treated as a special case; it is hashed and stored in `hash_email`.

5.  **Overwriting Unique Identifiers:**
    *   To maintain database uniqueness constraints while breaking the link to the original email, the user's `email` field is replaced with a placeholder in the format `deleted_{user.pk}@deleted.com`.
    *   Similarly, the `username` field is replaced with `deleted_user_{user.pk}`.

6.  **Account Deactivation:**
    *   The user's `is_active` status is set to `False` to prevent any further logins.
    *   A timestamp is recorded in the `anonymized_at` field, indicating when the anonymization took place.

This function relies on Django's settings for cryptographic salt and Stripe API keys, as well as various models from `users`, `events`, and `data_management` apps.

## `users\views\delete_user_view.py` - The API Endpoint

The `DeleteUserView` class implements a Django REST Framework API endpoint responsible for handling user account deletion requests.

*   **Authentication:** This view is secured with `IsAuthenticated` permission, meaning only authenticated users can access it.
*   **Purpose:** Its sole purpose is to provide an interface for authenticated users to delete their own accounts, which triggers the data anonymization process.
*   **Process Flow:**
    *   Upon receiving an HTTP DELETE request, the view identifies the authenticated user from the request.
    *   It then calls the `anonymize_user` function, passing the `User` object, to initiate the comprehensive anonymization.
    *   If the `anonymize_user` function executes successfully, the view returns an HTTP 204 No Content response, indicating successful processing without sending back any data.
    *   In case any exception occurs during the anonymization, the error is logged, and an HTTP 500 Internal Server Error response is returned to the client, advising them to contact support.

## Usage: Where and When it is Used

*   **`users\utils\anonymize_user.py`** (`anonymize_user` function): This utility function is called exclusively by `users\views\delete_user_view.py`. It serves as the encapsulated logic for performing the actual anonymization steps.
*   **`users\views\delete_user_view.py`** (`DeleteUserView`): This is a REST API endpoint that is intended to be accessed by the frontend client of the application.
    *   **When:** The process is triggered when an authenticated user, typically from their account settings or profile page, explicitly chooses to delete their account. This user action results in an HTTP DELETE request being sent to the URL mapped to this `DeleteUserView`.
    *   **Implication:** This is a **destructive and irreversible operation**. Once a user initiates this process, their account will be deactivated, and all associated PII will be either removed or hashed, making recovery of their original personal data impossible. This action is designed to comply with data privacy requirements by permanently severing identifiable links to the user.