from app.models.dream import DreamRecord, utc_now_iso
from app.repositories.dream_repository import DreamRepository
from app.storage.image_storage import ImageStorage


def seed_demo_dreams(repository: DreamRepository, storage: ImageStorage | None = None) -> None:
    if repository.count() > 0:
        return

    image_storage = storage or ImageStorage()
    image_storage.ensure_mock_assets()
    now = utc_now_iso()
    records = [
        DreamRecord(
            id="dream_demo_exam",
            title="迟到的考试",
            raw_text="考试，教室，迟到，找不到座位，试卷已经发下来了。",
            organized_text="梦里我突然发现自己要考试，却已经迟到了。我赶到教室时，大家好像都已经开始写试卷。",
            image_prompt="写实电影感，清晨普通教室，柔和光线，桌面有试卷和铅笔，日常但有轻微梦感。",
            image_url=image_storage.mock_asset_url("exam-classroom"),
            keywords=["考试", "教室", "迟到"],
            emotions=["紧张", "焦急"],
            scenes=["教室"],
            source="text",
            status="image_generated",
            created_at=now,
            updated_at=now,
        ),
        DreamRecord(
            id="dream_demo_old_house",
            title="在老房子里找门",
            raw_text="老房子，楼道很长，很暗，找门找不到，老太太指了方向。",
            organized_text="梦里我在一栋很旧的房子里，楼道很长也很暗。我一直找门，却总觉得方向被拉远。",
            image_prompt="写实电影感，一个很旧的公寓楼走廊，远处门口透进柔和光线，日常空间里有轻微梦感。",
            image_url=image_storage.mock_asset_url("old-house"),
            keywords=["老房子", "走廊", "找门"],
            emotions=["焦虑", "迷失"],
            scenes=["老房子", "走廊"],
            source="text",
            status="image_generated",
            created_at=now,
            updated_at=now,
        ),
        DreamRecord(
            id="dream_demo_rain_bus",
            title="雨天的公交站",
            raw_text="下雨，公交站，人很少，等了很久车都没有来。",
            organized_text="梦里一直在下雨，我站在公交站等车。雨声让周围变得很安静，车像是快来了却一直没有停下。",
            image_prompt="写实电影感，雨天城市公交站，湿润路面反射柔和灯光，日常但有轻微梦感。",
            image_url=image_storage.mock_asset_url("rainy-bus-stop"),
            keywords=["下雨", "公交站", "等待"],
            emotions=["平静", "不确定"],
            scenes=["公交站", "雨天街道"],
            source="text",
            status="image_generated",
            created_at=now,
            updated_at=now,
        ),
        DreamRecord(
            id="dream_demo_mall",
            title="商场迷路",
            raw_text="在商场里迷路，一直找电梯，楼层好像重复。",
            organized_text="梦里我在商场里走了很久，电梯门开了又关，楼层和通道像是不断重复。",
            image_prompt="写实电影感，安静商场走廊和电梯口，柔和室内灯光，空间略微重复。",
            image_url=image_storage.mock_asset_url("mall-corridor"),
            keywords=["商场", "电梯", "迷路"],
            emotions=["困惑", "焦虑"],
            scenes=["商场", "电梯口"],
            source="text",
            status="image_generated",
            created_at=now,
            updated_at=now,
        ),
        DreamRecord(
            id="dream_demo_family",
            title="和家人吃饭",
            raw_text="和家人吃饭，灯很暖，大家说话但我记不清内容。",
            organized_text="梦里我和家人坐在一起吃饭，对话记不完整，只记得灯光、餐桌和安静温暖的氛围。",
            image_prompt="写实电影感，家里的餐桌和温暖灯光，几个人围坐吃饭，日常但带轻微梦感。",
            image_url=image_storage.mock_asset_url("family-dinner"),
            keywords=["家人", "吃饭", "餐桌"],
            emotions=["温暖", "怀旧"],
            scenes=["家里", "餐桌"],
            source="text",
            status="image_generated",
            created_at=now,
            updated_at=now,
        ),
    ]
    repository.bulk_create(records)

