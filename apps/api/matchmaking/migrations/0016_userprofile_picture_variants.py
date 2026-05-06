from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matchmaking', '0015_remove_compatibilityscore_mars_compatibility_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='profile_picture_card',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='profile_picture_profile',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='profile_picture_thumb',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
    ]
