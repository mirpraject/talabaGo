from .auth import router as auth_router
from .universities import router as universities_router
from .files import router as files_router
from .ai import router as ai_router
from .tests import router as tests_router
from .stats import router as stats_router
from .rewards import router as rewards_router
from .admin import router as admin_router
from .announcements import router as announcements_router
from .subscription import router as subscription_router
from .learning import router as learning_router

__all__ = [
    "auth_router",
    "universities_router",
    "files_router",
    "ai_router",
    "tests_router",
    "stats_router",
    "rewards_router",
    "admin_router",
    "announcements_router",
    "subscription_router",
    "learning_router",
]