import pytest

from django.conf import settings

from matchmaking.astrology_service import AstrologyService


def test_make_request_requires_dilaanu_base_url(monkeypatch):
    monkeypatch.setattr(settings, "DILAANU_BASE_URL", "")

    with pytest.raises(Exception, match="DILAANU_BASE_URL is not configured"):
        AstrologyService.make_request("detailed-compatibility/", {"user": {}, "matches": []})


def test_make_request_requires_absolute_dilaanu_base_url(monkeypatch):
    monkeypatch.setattr(settings, "DILAANU_BASE_URL", "dilaanupro.com")

    with pytest.raises(Exception, match="DILAANU_BASE_URL must include http:// or https://"):
        AstrologyService.make_request("detailed-compatibility/", {"user": {}, "matches": []})
