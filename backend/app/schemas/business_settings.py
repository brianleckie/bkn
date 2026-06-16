from pydantic import BaseModel


class SettingRead(BaseModel):
    key: str
    value: str
    description: str | None

    model_config = {"from_attributes": True}


class SettingUpsert(BaseModel):
    key: str
    value: str
    description: str | None = None
