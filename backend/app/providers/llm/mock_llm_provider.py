from app.providers.llm.base import DreamOrganizedResult


class MockLLMProvider:
    def organize(self, raw_text: str) -> DreamOrganizedResult:
        text = " ".join(raw_text.strip().split())
        if self._contains(text, ["老房子", "楼道", "走廊", "找门"]):
            return DreamOrganizedResult(
                title="在老房子里找门",
                organized_text=(
                    "梦里我在一栋很旧的房子里，楼道又长又暗。我一直在找一扇门，"
                    "却总觉得方向被拉得很远。中途有位老太太像是给我指了方向，"
                    "但醒来后只剩下那种迷路和焦急的感觉。"
                ),
                image_prompt=(
                    "写实电影感，一个很旧的公寓楼走廊，墙皮轻微脱落，远处门口透进柔和光线，"
                    "日常空间里有轻微梦感，不恐怖，不玄幻。"
                ),
                keywords=["老房子", "走廊", "找门"],
                emotions=["焦虑", "迷失"],
                scenes=["老房子", "走廊"],
            )

        if self._contains(text, ["考试", "教室", "迟到"]):
            return DreamOrganizedResult(
                title="迟到的考试",
                organized_text=(
                    "梦里我像是突然意识到自己要参加考试，却已经迟到了。教室离我很近又很远，"
                    "我一边找座位和试卷，一边感到时间不断往前推。整个梦保持着赶不上的紧张感。"
                ),
                image_prompt=(
                    "写实电影感，清晨的普通教室，桌椅整齐，窗外柔和光线，桌面有试卷和铅笔，"
                    "日常但带轻微梦感，不玄幻，不恐怖。"
                ),
                keywords=["考试", "教室", "迟到"],
                emotions=["紧张", "焦急"],
                scenes=["教室"],
            )

        if self._contains(text, ["下雨", "公交站", "雨天"]):
            return DreamOrganizedResult(
                title="雨天的公交站",
                organized_text=(
                    "梦里一直在下雨，我站在公交站附近等车。周围的声音被雨水盖住，"
                    "路面反着光，车好像快来了又一直没有停下。梦的感觉安静、潮湿，也有一点等待中的不确定。"
                ),
                image_prompt=(
                    "写实电影感，雨天的城市公交站，湿润路面反射柔和灯光，几个人安静等车，"
                    "日常但有轻微梦感，不赛博朋克，不二次元。"
                ),
                keywords=["下雨", "公交站", "等待"],
                emotions=["平静", "不确定"],
                scenes=["公交站", "雨天街道"],
            )

        if self._contains(text, ["商场", "电梯", "迷路"]):
            return DreamOrganizedResult(
                title="商场迷路",
                organized_text=(
                    "梦里我在商场里走了很久，楼层和通道像是不断重复。电梯门开了又关，"
                    "我知道自己要去某个地方，却一直找不到正确出口。醒来时还记得那种绕不出去的感觉。"
                ),
                image_prompt=(
                    "写实电影感，安静的商场走廊和电梯口，柔和室内灯光，空间略微重复，"
                    "日常但有轻微梦感，不游戏 UI，不恐怖。"
                ),
                keywords=["商场", "电梯", "迷路"],
                emotions=["困惑", "焦虑"],
                scenes=["商场", "电梯口"],
            )

        if self._contains(text, ["家人", "晚餐", "吃饭"]):
            return DreamOrganizedResult(
                title="和家人吃饭",
                organized_text=(
                    "梦里我和家人坐在一起吃饭，场景很普通，却有一种醒来后仍然清晰的温暖感。"
                    "有些对话记不完整，只记得灯光、餐桌和大家坐在一起的安静氛围。"
                ),
                image_prompt=(
                    "写实电影感，家里的餐桌和温暖灯光，几个人围坐吃饭，画面柔和，"
                    "日常但带轻微梦感，不玄幻，不魔法。"
                ),
                keywords=["家人", "吃饭", "餐桌"],
                emotions=["温暖", "怀旧"],
                scenes=["家里", "餐桌"],
            )

        return self._generic_result(text)

    def _generic_result(self, text: str) -> DreamOrganizedResult:
        title_seed = text[:14].strip("，。,. ")
        title = f"{title_seed}的梦" if title_seed else "一段模糊的梦境"
        return DreamOrganizedResult(
            title=title,
            organized_text=(
                f"梦里最清楚的片段是：{text}。这些画面像刚醒来时留下的碎片，"
                "有些连接并不完整，但整体保留着原本的场景、人物和情绪。"
            ),
            image_prompt=(
                "写实电影感，普通日常空间，柔和自然光，画面安静，有轻微梦感，"
                "不玄幻，不魔法，不星空，不塔罗，不恐怖血腥，不二次元，不游戏 UI，不赛博朋克。"
            ),
            keywords=self._keywords_from_text(text),
            emotions=["模糊", "安静"],
            scenes=["梦境片段"],
        )

    def _keywords_from_text(self, text: str) -> list[str]:
        separators = "，。,.、；;：: \n\t"
        current = ""
        words: list[str] = []
        for char in text:
            if char in separators:
                if current:
                    words.append(current[:8])
                    current = ""
                continue
            current += char
        if current:
            words.append(current[:8])
        return words[:3] or ["梦境"]

    def _contains(self, text: str, keywords: list[str]) -> bool:
        return any(keyword in text for keyword in keywords)

