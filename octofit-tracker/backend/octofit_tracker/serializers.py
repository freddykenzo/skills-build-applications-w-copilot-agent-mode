from rest_framework import serializers

from .models import Activity, LeaderboardEntry, Team, UserProfile, Workout


class ObjectIdStringMixin(serializers.ModelSerializer):
    id = serializers.CharField(source="pk", read_only=True)


class UserProfileSerializer(ObjectIdStringMixin):
    class Meta:
        model = UserProfile
        fields = "__all__"


class TeamSerializer(ObjectIdStringMixin):
    class Meta:
        model = Team
        fields = "__all__"


class ActivitySerializer(ObjectIdStringMixin):
    class Meta:
        model = Activity
        fields = "__all__"


class LeaderboardEntrySerializer(ObjectIdStringMixin):
    class Meta:
        model = LeaderboardEntry
        fields = "__all__"


class WorkoutSerializer(ObjectIdStringMixin):
    class Meta:
        model = Workout
        fields = "__all__"
