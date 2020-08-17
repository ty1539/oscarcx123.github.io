const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: false,
    order: 'random',
    audio: [
    {
        "name": "宿星のガールフレンド３",
        "artist": "mirai",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/宿星のガールフレンド３.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/宿星のガールフレンド３.jpg"
    },
    {
        "name": "宿星のガールフレンド",
        "artist": "mirai",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/宿星のガールフレンド.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/宿星のガールフレンド.jpg"
    },
    {
        "name": "夏恋花火",
        "artist": "40mP",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/夏恋花火.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/夏恋花火.jpg"
    },
    {
        "name": "ETERNAL DRAIN",
        "artist": "Colorful Sounds Port",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/ETERNAL DRAIN.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/ETERNAL DRAIN.jpg"
    },
    {
        "name": "君と誰かの優しさに",
        "artist": "senya",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/君と誰かの優しさに.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/君と誰かの優しさに.jpg"
    },
    {
        "name": "Accel World Ending 1 Unfinished",
        "artist": "Kotoko",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Accel World Ending 1 Unfinished.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Accel World Ending 1 Unfinished.jpg"
    },
    {
        "name": "ニヒル神楽",
        "artist": "senya",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/ニヒル神楽.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/ニヒル神楽.jpg"
    },
    {
        "name": "fragment of tears",
        "artist": "仲村芽衣子",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/fragment of tears.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/fragment of tears.jpg"
    },
    {
        "name": "Dynasty",
        "artist": "Yooh",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Dynasty.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Dynasty.jpg"
    },
    {
        "name": "Moonlight of Sand Castle",
        "artist": "旅人E",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Moonlight of Sand Castle.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Moonlight of Sand Castle.jpg"
    },
    {
        "name": "Oracle",
        "artist": "TQ☆",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Oracle.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Oracle.jpg"
    },
    {
        "name": "Hazukashigariya no Toy Soldier",
        "artist": "AAAA",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Hazukashigariya no Toy Soldier.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Hazukashigariya no Toy Soldier.jpg"
    },
    {
        "name": "アスノヨゾラ哨戒班",
        "artist": "Orangestar",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/アスノヨゾラ哨戒班.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/アスノヨゾラ哨戒班.jpg"
    },
    {
        "name": "Mono Logic",
        "artist": "Ayumi Nomiya",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Mono Logic.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Mono Logic.jpg"
    },
    {
        "name": "MELODY FLAG",
        "artist": "水瀬いのり",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/MELODY FLAG.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/MELODY FLAG.jpg"
    },
    {
        "name": "fortissimo -from insanity affection-",
        "artist": "fripSide",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/fortissimo -from insanity affection-.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/fortissimo -from insanity affection-.jpg"
    },
    {
        "name": "灼熱のユートピア",
        "artist": "Xceon",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/灼熱のユートピア.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/灼熱のユートピア.jpg"
    },
    {
        "name": "Scarlet Faith",
        "artist": "仲村芽衣子",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Scarlet Faith.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Scarlet Faith.jpg"
    },
    {
        "name": "創造のイデア",
        "artist": "Ariabl'eyeS",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/創造のイデア.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/創造のイデア.jpg"
    },
    {
        "name": "瑠璃色ソワレ",
        "artist": "Ariabl'eyeS",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/瑠璃色ソワレ.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/瑠璃色ソワレ.jpg"
    },
    {
        "name": "Ultimate Fate",
        "artist": "Jun Kuroda",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/Ultimate Fate.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/Ultimate Fate.jpg"
    },
    {
        "name": "惑星☆ロリポップ",
        "artist": "Nana Takahashi",
        "url": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/song/惑星☆ロリポップ.mp3",
        "cover": "https://raw.githubusercontent.com/oscarcx123/hexo_resource/master/music/cover/惑星☆ロリポップ.jpg"
    }
]});