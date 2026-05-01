from rest_framework.routers import DefaultRouter

from .views import AuthViewSet

router = DefaultRouter()

router.register(r"auth", AuthViewSet, "auth")

urlpatterns = router.urls
