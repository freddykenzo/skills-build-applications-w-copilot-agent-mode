from django.core.management.base import BaseCommand

from octofit_tracker.models import Activity, LeaderboardEntry, Team, UserProfile, Workout


class Command(BaseCommand):
    help = "Populate the octofit_db database with test data"

    def handle(self, *args, **options):
        # Clear existing data in dependency order.
        Activity.objects.all().delete()
        LeaderboardEntry.objects.all().delete()
        Workout.objects.all().delete()
        UserProfile.objects.all().delete()
        Team.objects.all().delete()

        marvel = Team.objects.create(name="team marvel", city="New York")
        dc = Team.objects.create(name="team dc", city="Gotham")

        heroes = [
            {"name": "Peter Parker", "email": "spiderman@octofit.dev", "age": 21, "team_name": marvel.name},
            {"name": "Tony Stark", "email": "ironman@octofit.dev", "age": 45, "team_name": marvel.name},
            {"name": "Bruce Wayne", "email": "batman@octofit.dev", "age": 38, "team_name": dc.name},
            {"name": "Diana Prince", "email": "wonderwoman@octofit.dev", "age": 32, "team_name": dc.name},
        ]

        created_users = []
        for hero in heroes:
            created_users.append(UserProfile.objects.create(**hero))

        for idx, user in enumerate(created_users, start=1):
            Activity.objects.create(
                user=user,
                activity_type="Cardio" if idx % 2 else "Strength",
                duration_minutes=30 + idx * 5,
                calories_burned=250 + idx * 30,
            )
            LeaderboardEntry.objects.create(user=user, points=500 - idx * 25, rank=idx)
            Workout.objects.create(
                user=user,
                title=f"{user.name} Daily Session",
                intensity="High" if idx % 2 else "Moderate",
                notes="Auto-generated superhero sample workout.",
            )

        self.stdout.write(self.style.SUCCESS("octofit_db populated with superhero test data."))
