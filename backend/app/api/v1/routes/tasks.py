from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate
from app.utils.response import api_response

router = APIRouter()


def serialize_task(task: Task):
    data = task.__dict__.copy()
    data.pop("_sa_instance_state", None)
    return data


@router.post("")
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = Task(
        title=payload.title,
        description=payload.description,
        status=payload.status or TaskStatus.pending,
        user_id=current_user.id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return api_response(True, "Task created", serialize_task(task), 201)


@router.get("")
def list_tasks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "admin":
        tasks = db.query(Task).all()
    else:
        tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    data = [serialize_task(t) for t in tasks]
    return api_response(True, "Tasks fetched", data, 200)


@router.get("/{task_id}")
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return api_response(False, "Task not found", None, 404)

    if current_user.role != "admin" and task.user_id != current_user.id:
        return api_response(False, "Forbidden", None, 403)

    return api_response(True, "Task fetched", serialize_task(task), 200)


@router.put("/{task_id}")
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return api_response(False, "Task not found", None, 404)

    if current_user.role != "admin" and task.user_id != current_user.id:
        return api_response(False, "Forbidden", None, 403)

    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.status is not None:
        task.status = payload.status

    db.commit()
    db.refresh(task)
    return api_response(True, "Task updated", serialize_task(task), 200)


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return api_response(False, "Task not found", None, 404)

    if current_user.role != "admin" and task.user_id != current_user.id:
        return api_response(False, "Forbidden", None, 403)

    db.delete(task)
    db.commit()
    return api_response(True, "Task deleted", None, 200)
