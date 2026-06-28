from pathlib import Path

from app.core.config import settings


MOCK_ASSETS: dict[str, tuple[str, str, str]] = {
    "old-house": ("old-house.svg", "#6d7f89", "在老房子里找门"),
    "exam-classroom": ("exam-classroom.svg", "#8b7d6b", "迟到的考试"),
    "rainy-bus-stop": ("rainy-bus-stop.svg", "#55758d", "雨天的公交站"),
    "mall-corridor": ("mall-corridor.svg", "#7f7488", "商场迷路"),
    "family-dinner": ("family-dinner.svg", "#9a7054", "和家人吃饭"),
    "default-dream": ("default-dream.svg", "#687b73", "梦境画面"),
}


class ImageStorage:
    def __init__(self, static_dir: Path | str | None = None, static_url_path: str | None = None) -> None:
        self.static_dir = Path(static_dir or settings.static_dir)
        self.static_url_path = static_url_path or settings.static_url_path
        self.image_dir = self.static_dir / "images"

    def ensure_mock_assets(self) -> None:
        self.image_dir.mkdir(parents=True, exist_ok=True)
        for filename, color, label in MOCK_ASSETS.values():
            path = self.image_dir / filename
            if not path.exists():
                path.write_text(self._placeholder_svg(color, label), encoding="utf-8")

    def mock_asset_url(self, asset_key: str) -> str:
        self.ensure_mock_assets()
        filename = MOCK_ASSETS.get(asset_key, MOCK_ASSETS["default-dream"])[0]
        return self.url_for_image(filename)

    def url_for_image(self, filename: str) -> str:
        return f"{self.static_url_path}/images/{filename}"

    def _placeholder_svg(self, color: str, label: str) -> str:
        return f"""<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640">
  <rect width="960" height="640" fill="{color}"/>
  <rect x="72" y="72" width="816" height="496" rx="28" fill="rgba(255,255,255,0.16)"/>
  <circle cx="740" cy="170" r="92" fill="rgba(255,255,255,0.18)"/>
  <path d="M120 470 C240 370 310 430 420 335 C540 230 700 325 840 220 L840 568 L120 568 Z" fill="rgba(255,255,255,0.20)"/>
  <text x="480" y="320" font-family="Arial, sans-serif" font-size="42" fill="white" text-anchor="middle">{label}</text>
</svg>
"""

