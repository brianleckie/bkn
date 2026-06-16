from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    APP_ENV: str = "development"
    FRONTEND_ORIGIN: str = "*"
    SHOP_TIMEZONE: str = "America/Asuncion"

    FIRST_ADMIN_EMAIL: str = "admin@bknbarbershop.com"
    FIRST_ADMIN_PASSWORD: str = "changeme123"


settings = Settings()
