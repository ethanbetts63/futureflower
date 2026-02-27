import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
FROM_EMAIL = os.environ.get("DEV_EMAIL", "")
APP_PASSWORD = os.environ.get("DEV_EMAIL_GOOGLE_APP_PASSWORD", "")


def send_email(to: str, subject: str, body: str) -> None:
    """
    Send a plain-text email via the dev Gmail account.
    Raises on failure.
    """
    if not FROM_EMAIL or not APP_PASSWORD:
        raise RuntimeError("DEV_EMAIL or DEV_EMAIL_GOOGLE_APP_PASSWORD not set in environment.")

    msg = MIMEMultipart()
    msg["From"]    = FROM_EMAIL
    msg["To"]      = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(FROM_EMAIL, APP_PASSWORD)
        server.sendmail(FROM_EMAIL, to, msg.as_string())
