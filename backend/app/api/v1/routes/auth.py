from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.utils.response import api_response

router = APIRouter()


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        return api_response(False, "Email already in use", None, 409)

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return api_response(True, "Registered successfully", {"id": user.id, "email": user.email, "role": user.role}, 201)


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        return api_response(False, "Invalid credentials", None, 401)

    token = create_access_token({"user_id": user.id, "role": user.role})
    return api_response(True, "Login successful", {"token": token}, 200)
