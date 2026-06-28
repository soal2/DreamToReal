from dataclasses import dataclass


@dataclass
class AppError(Exception):
    code: str
    message: str
    status_code: int = 400


def dream_not_found() -> AppError:
    return AppError("DREAM_NOT_FOUND", "没有找到这条梦境记录。", 404)


def missing_config(field: str) -> AppError:
    return AppError(
        "MISSING_CONFIG",
        f"缺少必要配置：{field}。请在 backend/.env 中补充该字段后重新启动服务。",
        500,
    )
