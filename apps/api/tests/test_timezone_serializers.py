from matchmaking.astrology_service import AstrologyService
from matchmaking.models import PrivatePerson, UserProfile
from matchmaking.serializers import PrivatePersonSerializer, UserProfileSerializer


class _FakeTimezoneFinder:
    def timezone_at(self, *, lat, lng):
        if lat == 19.0760 and lng == 72.8777:
            return "Asia/Kolkata"
        if lat == 40.7128 and lng == -74.0060:
            return "America/New_York"
        return None


def test_user_profile_serializer_sets_timezone_from_coordinates(monkeypatch):
    monkeypatch.setattr(AstrologyService, "_timezone_finder", _FakeTimezoneFinder())
    serializer = UserProfileSerializer()
    validated_data = {
        "gender": "male",
        "place_of_birth": "Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777,
    }

    serializer._set_timezone(validated_data)

    assert validated_data["timezone"] == "Asia/Kolkata"


def test_user_profile_serializer_updates_timezone_from_coordinates(monkeypatch):
    monkeypatch.setattr(AstrologyService, "_timezone_finder", _FakeTimezoneFinder())
    profile = UserProfile(
        place_of_birth="Mumbai",
        latitude=19.0760,
        longitude=72.8777,
        timezone="Asia/Kolkata",
    )

    serializer = UserProfileSerializer()
    validated_data = {
        "place_of_birth": "New York",
        "latitude": 40.7128,
        "longitude": -74.0060,
    }

    serializer._set_timezone(validated_data, instance=profile)

    assert validated_data["timezone"] == "America/New_York"


def test_private_person_serializer_sets_timezone_from_coordinates(monkeypatch):
    monkeypatch.setattr(AstrologyService, "_timezone_finder", _FakeTimezoneFinder())
    serializer = PrivatePersonSerializer()
    validated_data = {
        "name": "Timezone Person",
        "date_of_birth": "1990-01-01",
        "place_of_birth": "Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777,
    }

    serializer._set_timezone(validated_data)

    assert validated_data["timezone"] == "Asia/Kolkata"


def test_user_profile_serializer_keeps_provided_timezone_without_lookup(monkeypatch):
    monkeypatch.setattr(AstrologyService, "_timezone_finder", None)
    serializer = UserProfileSerializer()
    validated_data = {
        "latitude": 19.0760,
        "longitude": 72.8777,
        "timezone": "Asia/Kolkata",
    }

    serializer._set_timezone(validated_data)

    assert validated_data["timezone"] == "Asia/Kolkata"
