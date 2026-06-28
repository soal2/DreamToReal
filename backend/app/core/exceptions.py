from dataclasses import dataclass


@dataclass
class AppError(Exception):
    code: str
    message: str
    status_code: int = 400


def dream_not_found() -> AppError:
    return AppError("DREAM_NOT_FOUND", "没有找到这条梦境记录。", 404)

