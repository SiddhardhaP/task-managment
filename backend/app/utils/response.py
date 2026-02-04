from typing import Any
from fastapi import Response


def api_response(success: bool, message: str, data: Any = None, status_code: int = 200):
    response = {"success": success, "message": message, "data": data}
    return Response(content=__import__("json").dumps(response, default=str), status_code=status_code, media_type="application/json")
