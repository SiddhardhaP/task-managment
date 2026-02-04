from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from app.models.user import RoleEnum


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: RoleEnum
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    # bcrypt supports max 72 bytes, keep consistent with register
    password: str | None = Field(default=None, min_length=6, max_length=72)
