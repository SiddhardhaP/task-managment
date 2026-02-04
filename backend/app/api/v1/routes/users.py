from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_admin, get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserUpdate
from app.core.security import hash_password
from app.utils.response import api_response

router = APIRouter()


@router.get("")
def list_users(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    users = db.query(User).all()
    data = []
    for u in users:
        data.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at
        })
    return api_response(True, "Users fetched", data, 200)


@router.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at
    }
    return api_response(True, "Profile fetched", data, 200)


@router.put("/me")
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if payload.email and payload.email != current_user.email:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            return api_response(False, "Email already in use", None, 409)
        current_user.email = payload.email

    if payload.name is not None:
        current_user.name = payload.name

    if payload.password:
        current_user.password_hash = hash_password(payload.password)

    db.commit()
    db.refresh(current_user)

    data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at
    }
    return api_response(True, "Profile updated", data, 200)
